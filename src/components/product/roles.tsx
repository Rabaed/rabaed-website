import { RolesBehaviour } from '@/components/product/roles-behaviour';
import { FIRST_ROLE, roleAppearance } from '@/components/product/roles-state';
import { ScreenMockPicture, type ScreenMockPictureContent } from '@/components/product/screen-mock-picture';

export type Role = {
  /** The tab's label. */
  readonly party: string;
  /** The promise, as the heading. */
  readonly promise: string;
  readonly body: string;
  /** What this party says against a new system, in the party's own words and quotation marks. */
  readonly objection: string;
  readonly answer: string;
  readonly screen: ScreenMockPictureContent;
};

export type RolesContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly roles: readonly Role[];
  /** What every party gets, whichever is chosen. */
  readonly sharedPromises: readonly string[];
};

/**
 * «ماذا يرى كل طرف حين يفتح المنصة؟» — a tab for each of the three parties,
 * and under it what that party sees: the promise, the objection it raises and
 * the answer, and the screen.
 *
 * A server component. Every party's copy, screen description and caption are
 * in the first response, with the Owner chosen; `RolesBehaviour` switches
 * between them.
 *
 * **The tabs are tabs to assistive technology**, which the Reference site's
 * plain buttons are not: a tab list named by the section's heading, each tab
 * saying whether it is selected and which panel it controls.
 */
export function Roles({ content }: { content: RolesContent }) {
  return (
    <section id="roles" className="light pad" data-direction="rtl">
      <div className="wrap">
        <div className="eyebrow">{content.eyebrow}</div>
        <h2 id="roles-heading">{content.heading}</h2>

        <div className="tabs" role="tablist" aria-labelledby="roles-heading">
          {content.roles.map((role, index) => {
            const look = roleAppearance(index, FIRST_ROLE);
            return (
              <button
                key={role.screen.mock}
                type="button"
                role="tab"
                id={`role-tab-${index}`}
                aria-controls={`role-panel-${index}`}
                aria-selected={look.selected}
                className={look.tabClass}
              >
                {role.party}
              </button>
            );
          })}
        </div>

        {content.roles.map((role, index) => (
          <div
            key={role.screen.mock}
            id={`role-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`role-tab-${index}`}
            className={roleAppearance(index, FIRST_ROLE).panelClass}
          >
            <div>
              <h3>{role.promise}</h3>
              <p>{role.body}</p>
              <p className="gain">
                <b>{role.objection}</b> {role.answer}
              </p>
            </div>
            <div className="role-shot">
              {/* Below 700px the screen is shown at 1040px and panned across;
                  stacked, it is never wider than 920px; beside the copy, never
                  wider than 620px. */}
              <ScreenMockPicture
                content={role.screen}
                sizes="(max-width: 700px) 1040px, (max-width: 980px) 920px, 620px"
              />
            </div>
          </div>
        ))}

        <div className="shared">
          {content.sharedPromises.map((promise) => (
            <span key={promise}>{promise}</span>
          ))}
        </div>
      </div>

      <RolesBehaviour />
    </section>
  );
}
