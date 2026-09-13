/**
 * The demo request form: one form, placed at the end of the home, product and
 * start pages. The handoff asks for it to be built once for all three, and
 * ticket 27 relies on that when it makes the form work.
 *
 * **It is a real form, and it sends nothing yet.** Every field has a name and
 * the right type, so ticket 27 wires it by giving the form somewhere to send
 * to, not by rebuilding it. Until then the submit button is disabled:
 *
 * - The Reference site's button showed "وصلنا طلبك" — we received your request
 *   — without sending anything. A visitor who believed it would wait for a
 *   call that never came. The spec forbids that outright.
 * - A form with a live button and nowhere to go would put what the visitor
 *   typed — name, email, phone — into the address bar on submit.
 * - A disabled button is where ticket 27 is going anyway: "the submit button
 *   gates on validity".
 *
 * Pressing Enter in a field submits nothing either: a form whose submit button
 * is disabled has no implicit submission.
 *
 * `method="post"` is set now so that the day the button is enabled, the answers
 * travel in the request body rather than the address.
 *
 * All copy is verbatim from `reference/site/index.html`.
 */
export function DemoRequestForm() {
  return (
    <form className="form" id="demo" method="post" aria-labelledby="demo-title">
      <h3 id="demo-title">احجز عرضاً حياً على مشروعك</h3>
      <small>30 دقيقة · بالعربية · على مشروع من مشاريعك</small>
      {/* Only the numeral is `.mono`: DM Mono has no Arabic glyphs, as in the
          hero's guarantee pill (spec: Design system). */}
      <div className="guar" style={{ marginBottom: '14px' }}>
        <b>
          <span className="mono">60</span> يوماً
        </b>{' '}
        ضمان استرجاع كامل المبلغ
      </div>

      {/* Each field is named by its `aria-label`, which says the same as its
          placeholder, as on the Reference site; visible labels are ticket
          36's to decide. Which fields are required is ticket 27's. */}
      <div className="two">
        <input name="name" placeholder="الاسم الكامل" autoComplete="name" aria-label="الاسم الكامل" />
        <input
          name="email"
          type="email"
          placeholder="البريد الإلكتروني"
          autoComplete="email"
          aria-label="البريد الإلكتروني"
        />
      </div>
      <div className="two">
        <select name="role" aria-label="دورك في المشروع" defaultValue="">
          <option value="">دورك في المشروع</option>
          <option value="owner">مالك / مطوّر</option>
          <option value="consultant">استشاري</option>
          <option value="contractor">مقاول</option>
        </select>
        <input name="phone" type="tel" placeholder="رقم الجوال" autoComplete="tel" aria-label="رقم الجوال" />
      </div>
      <div className="two">
        <input name="company" placeholder="اسم الشركة" autoComplete="organization" aria-label="اسم الشركة" />
        <input
          name="activeProjects"
          type="number"
          placeholder="عدد المشاريع النشطة"
          aria-label="عدد المشاريع النشطة"
        />
      </div>

      <button type="submit" className="btn p" disabled style={{ justifyContent: 'center' }}>
        احجز عرضاً حياً
      </button>
      <small className="fine">نستخدم بياناتك لتحديد موعد العرض فقط، ولا نشاركها مع أي طرف ثالث.</small>
    </form>
  );
}
