import { RolesBehaviour } from '@/components/product/roles-behaviour';
import { FIRST_ROLE, roleAppearance } from '@/components/product/roles-state';
import { ScreenMockPicture } from '@/components/product/screen-mock-picture';
import { ROLES, ROLES_EYEBROW, ROLES_HEADING, SHARED_PROMISES } from '@/content/roles';

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
export function Roles() {
  return (
    <section id="roles" className="light pad" data-direction="rtl">
      <div className="wrap">
        <div className="eyebrow">{ROLES_EYEBROW}</div>
        <h2 id="roles-heading">{ROLES_HEADING}</h2>

        <div className="tabs" role="tablist" aria-labelledby="roles-heading">
          {ROLES.map((role, index) => {
            const look = roleAppearance(index, FIRST_ROLE);
            return (
              <button
                key={role.mock}
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

        {ROLES.map((role, index) => (
          <div
            key={role.mock}
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
              <ScreenMockPicture mock={role.mock} sizes="(max-width: 700px) 1040px, (max-width: 980px) 920px, 620px" />
            </div>
          </div>
        ))}

        <div className="shared">
          {SHARED_PROMISES.map((promise) => (
            <span key={promise}>{promise}</span>
          ))}
        </div>
      </div>

      <RolesBehaviour />
    </section>
  );
}
