/**
 * Reading a page's structured data the way a crawler does: out of the HTML of
 * the first response, with no script run (ADR-0001), and checked against what
 * schema.org and Google's rich results ask of each kind of thing (ticket 32).
 */
import { expect } from '@playwright/test';

export type Node = Record<string, unknown> & { '@type': string | string[] };

/** Every `application/ld+json` block in the HTML, as written. */
export function jsonLdBlocks(html: string): string[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json]) => json);
}

/**
 * Every node the page describes, at the top level or inside an `@graph`, with
 * each block held to the shape a validator accepts: JSON that parses, the
 * schema.org context, and a type on every node.
 */
export function structuredData(html: string): Node[] {
  return jsonLdBlocks(html).flatMap((json) => {
    // A `<` left in would let text from the CMS close the script tag early.
    expect(json, 'an unescaped "<" in structured data').not.toContain('<');
    const block = JSON.parse(json) as Record<string, unknown>;
    expect(block['@context'], 'structured data context').toBe('https://schema.org');

    const nodes = (Array.isArray(block['@graph']) ? block['@graph'] : [block]) as Node[];
    for (const node of nodes) {
      expect(node['@type'], `a node with no type: ${JSON.stringify(node)}`).toBeTruthy();
      expectRequiredProperties(node);
    }
    return nodes;
  });
}

/** The nodes of one type. */
export function nodesOf(nodes: Node[], type: string): Node[] {
  return nodes.filter((node) => [node['@type']].flat().includes(type));
}

/**
 * What each type must carry to be valid and, where Google reads it, eligible
 * for a rich result. Restated from schema.org and Google Search Central rather
 * than taken from the code, for the reason `routes.ts` gives.
 */
const REQUIRED: Record<string, readonly string[]> = {
  Organization: ['name', 'url', 'logo'],
  WebSite: ['name', 'url'],
  SoftwareApplication: ['name', 'applicationCategory', 'operatingSystem'],
  FAQPage: ['mainEntity'],
  BreadcrumbList: ['itemListElement'],
  BlogPosting: ['headline', 'image', 'datePublished', 'author'],
};

function expectRequiredProperties(node: Node) {
  for (const type of [node['@type']].flat()) {
    for (const property of REQUIRED[type] ?? []) {
      expect(node[property], `${type} without ${property}`).toBeTruthy();
    }
  }

  if (nodesOf([node], 'FAQPage').length) {
    const questions = node.mainEntity as Node[];
    expect(questions.length, 'an FAQPage with no questions').toBeGreaterThan(0);
    for (const question of questions) {
      expect(question['@type']).toBe('Question');
      expect(question.name).toBeTruthy();
      expect((question.acceptedAnswer as Node)['@type']).toBe('Answer');
      expect((question.acceptedAnswer as Node).text).toBeTruthy();
    }
  }

  if (nodesOf([node], 'BreadcrumbList').length) {
    const items = node.itemListElement as Node[];
    expect(items.length, 'a breadcrumb trail of fewer than two steps').toBeGreaterThan(1);
    items.forEach((item, index) => {
      expect(item['@type']).toBe('ListItem');
      expect(item.position).toBe(index + 1);
      expect(item.name).toBeTruthy();
      expect(item.item).toBeTruthy();
    });
  }
}

/** A breadcrumb trail as its names and absolute addresses, in order. */
export function trail(node: Node): [string, string][] {
  return (node.itemListElement as Node[]).map((item) => [item.name as string, item.item as string]);
}
