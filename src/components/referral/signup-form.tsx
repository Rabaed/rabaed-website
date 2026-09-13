import { UploadField } from '@/components/upload-field';
import { localePath } from '@/lib/locales';

/**
 * The Referral Program signup form: the referrer's details, their bank
 * details as documents rather than typed numbers, and the two consents.
 *
 * **It is a real form, and it sends nothing yet**, for the reasons the demo
 * request form gives (`src/components/demo-request-form.tsx`): its submit
 * button stays disabled until ticket 28 gives it somewhere to send, stores the
 * documents privately, and checks them on the server.
 *
 * - **The Reference site's fake success is gone.** Its button revealed «تم
 *   تسجيلك. كودك هو RB-A47K» — a referral code nobody issued, for a
 *   registration nobody stored (spec: Forms). A referrer who believed it would
 *   hand a developer a code that means nothing.
 * - **Every field has a name**, and the ones the Reference site stars are
 *   `required`, as are the IBAN certificate and both consents (HANDOFF §4.ب).
 * - **The small print still says the form is a prototype that sends nothing**,
 *   word for word from the Reference site, because it is true. Ticket 28
 *   replaces it with what happens to the referrer's documents.
 *
 * All copy is verbatim from `reference/site/referral.html`.
 */
export function ReferralSignupForm() {
  return (
    <form className="form" method="post" encType="multipart/form-data" aria-labelledby="referral-signup-title">
      <h3 id="referral-signup-title">سجّل في برنامج الإحالة</h3>
      <small>البيانات والمستندات تُستخدم لإصدار كودك وتحويل مستحقاتك فقط.</small>

      {/* Each field is named by its `aria-label`, as on the Reference site
          and in the demo request form; visible labels are ticket 36's. */}
      <div className="two">
        <input name="name" placeholder="الاسم الكامل *" autoComplete="name" aria-label="الاسم الكامل" required />
        <input name="phone" type="tel" placeholder="رقم الجوال *" autoComplete="tel" aria-label="رقم الجوال" required />
      </div>
      <div className="two">
        <input
          name="email"
          type="email"
          placeholder="البريد الإلكتروني *"
          autoComplete="email"
          aria-label="البريد الإلكتروني"
          required
        />
        <input name="city" placeholder="المدينة *" aria-label="المدينة" required />
      </div>
      <div className="two">
        <select name="profession" aria-label="الصفة المهنية" defaultValue="" required>
          <option value="">الصفة المهنية *</option>
          <option value="engineer">مهندس</option>
          <option value="project-manager">مدير مشروع</option>
          <option value="independent-consultant">استشاري مستقل</option>
          <option value="contractor">مقاول</option>
          <option value="real-estate-advisor">مستشار تطوير عقاري</option>
          <option value="content-creator">صانع محتوى</option>
          <option value="other">أخرى</option>
        </select>
        <input name="employer" placeholder="جهة العمل (اختياري)" autoComplete="organization" aria-label="جهة العمل" />
      </div>
      <div className="two">
        <UploadField name="ibanCertificate" label="شهادة الآيبان" note="PDF أو صورة" required />
        <input name="accountHolder" placeholder="اسم صاحب الحساب البنكي *" aria-label="اسم صاحب الحساب البنكي" required />
      </div>
      <div className="two">
        <UploadField name="commercialRegistration" label="السجل التجاري" note="اختياري · PDF أو صورة" />
        <UploadField name="taxRegistrationCertificate" label="شهادة التسجيل الضريبي" note="اختياري · PDF أو صورة" />
      </div>

      <label className="chk">
        <input type="checkbox" name="acceptTerms" aria-label="الموافقة على الشروط والأحكام" required />
        <span>
          أوافق على <a href={localePath('ar', '/referral-terms')}>شروط وأحكام برنامج الإحالة</a> و
          <a href={localePath('ar', '/privacy')}>سياسة الخصوصية</a>.
        </span>
      </label>
      {/* What the checkbox under it declares, so it is read with it. */}
      <div className="declar" id="referral-declaration">
        أُقرّ بأن ترشيحي لمنصة ربائد لا يتعارض مع واجباتي المهنية، وأنه لا يؤثر على أي قرار فني أو تعاقدي أتخذه أو أُشارك فيه بحكم عملي. كما أُقرّ بعدم وجود ما يمنعني نظاماً أو تعاقدياً مع جهة عملي من قبول هذا المقابل، وأتحمّل وحدي مسؤولية أي إخلال بذلك.
      </div>
      <label className="chk">
        <input
          type="checkbox"
          name="declareNoConflict"
          aria-label="إقرار عدم التعارض"
          aria-describedby="referral-declaration"
          required
        />
        <span>أُقرّ بما ورد أعلاه (إقرار عدم التعارض).</span>
      </label>

      <button type="submit" className="btn p" disabled style={{ justifyContent: 'center' }}>
        سجّل في برنامج الإحالة
      </button>
      <small className="fine">نموذج أولي — لا يُرسل فعلياً في هذه النسخة.</small>
    </form>
  );
}
