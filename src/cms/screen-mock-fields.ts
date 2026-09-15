/**
 * Where a Screen mock's picture and description live in the CMS's Screen mocks
 * entry (ticket 57): a field named after the mock, as the entry's configuration
 * and the site's reader both need to say it.
 *
 * A mock's id has hyphens — `daily-report` — which a field name cannot; the
 * field is its camel case, `dailyReport`.
 *
 * Imported by the CMS configuration, so it imports nothing.
 */
export function screenMockFieldName(mockId: string): string {
  return mockId.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase());
}
