import { UploadField } from '@/components/upload-field';

/**
 * The Partnership Program application: the office, its commercial
 * registration, the person applying, five questions about the practice, and
 * what it wants from the partnership.
 *
 * **It is a real form, and it sends nothing yet**, for the reasons the demo
 * request form gives (`src/components/demo-request-form.tsx`): its submit
 * button stays disabled until ticket 29 gives it somewhere to send, and ticket
 * 28 stores the commercial registration privately and checks it on the server.
 *
 * - **The Reference site's fake success is gone.** Its button revealed «وصلنا
 *   طلبك. يتواصل معك فريق الشراكات خلال يومي عمل…» for an application nobody
 *   stored (spec: Forms). An office that believed it would wait two working
 *   days for a call that never came.
 * - **Every field has a name**, and the ones the Reference site stars are
 *   `required`, the commercial registration among them (HANDOFF §4.ج). The
 *   free text is optional, as it says.
 * - **Every list's first line is its prompt, with no value**, so `required`
 *   refuses it and the visitor has to choose.
 * - **The small print still says the form is a prototype that sends nothing**,
 *   word for word from the Reference site, because it is true.
 *
 * All copy is verbatim from `reference/site/partnership.html`.
 */
export function PartnershipApplicationForm() {
  return (
    <form className="form" method="post" encType="multipart/form-data" aria-labelledby="partnership-apply-title">
      <h3 id="partnership-apply-title">اطلب اجتماع شراكة</h3>
      <small>بيانات المكتب تساعدنا على اقتراح النمط الأنسب قبل الاجتماع.</small>

      {/* Each field is named by its `aria-label`, as on the Reference site
          and in the other forms; visible labels are ticket 36's. */}
      <div className="two">
        <input
          name="company"
          placeholder="اسم المكتب / الشركة *"
          autoComplete="organization"
          aria-label="اسم المكتب أو الشركة"
          required
        />
        <UploadField name="commercialRegistration" label="السجل التجاري" note="PDF أو صورة" required />
      </div>
      <div className="two">
        <input name="city" placeholder="المدينة *" aria-label="المدينة" required />
        <input name="name" placeholder="اسم مقدّم الطلب *" autoComplete="name" aria-label="اسم مقدّم الطلب" required />
      </div>
      <div className="two">
        <input name="jobTitle" placeholder="المنصب *" autoComplete="organization-title" aria-label="المنصب" required />
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
        <select name="activity" aria-label="نوع النشاط" defaultValue="" required>
          <option value="">نوع النشاط *</option>
          <option value="consulting-office">مكتب استشاري</option>
          <option value="project-management">إدارة مشاريع</option>
          <option value="contracting">مقاولات</option>
          <option value="real-estate-development">تطوير عقاري</option>
          <option value="other">أخرى</option>
        </select>
      </div>
      <div className="two">
        <select name="activeProjects" aria-label="عدد المشاريع تحت الإشراف حالياً" defaultValue="" required>
          <option value="">عدد المشاريع تحت الإشراف *</option>
          <option value="1-3">1–3</option>
          <option value="4-10">4–10</option>
          <option value="11-25">11–25</option>
          <option value="over-25">أكثر من 25</option>
        </select>
        <select name="clientType" aria-label="نوع العملاء الغالب" defaultValue="" required>
          <option value="">نوع العملاء الغالب *</option>
          <option value="individual-developers">مطوّرون أفراد</option>
          <option value="development-companies">شركات تطوير</option>
          <option value="government">جهات حكومية</option>
          <option value="mixed">مزيج</option>
        </select>
      </div>
      <div className="two">
        {/* In square metres. */}
        <select name="projectArea" aria-label="متوسط مساحة المشروع" defaultValue="" required>
          <option value="">متوسط مساحة المشروع *</option>
          <option value="under-5000">أقل من 5,000 م²</option>
          <option value="5000-20000">5,000–20,000 م²</option>
          <option value="20000-50000">20,000–50,000 م²</option>
          <option value="over-50000">أكثر من 50,000 م²</option>
        </select>
        {/* The three modes on this page, or none yet. */}
        <select name="partnershipMode" aria-label="نمط التعاون المبدئي" defaultValue="" required>
          <option value="">نمط التعاون المبدئي *</option>
          <option value="embedded-in-proposal">التضمين في العرض</option>
          <option value="office-licence">رخصة المكتب</option>
          <option value="approved-referral">الترشيح المعتمد</option>
          <option value="undecided">غير محدد</option>
        </select>
      </div>
      <textarea
        name="goals"
        rows={3}
        placeholder="ما الذي تريد تحقيقه من الشراكة؟ (اختياري)"
        aria-label="ما الذي تريد تحقيقه من الشراكة"
      />

      <button type="submit" className="btn p" disabled style={{ justifyContent: 'center' }}>
        اطلب اجتماع شراكة
      </button>
      <small className="fine">نموذج أولي — لا يُرسل فعلياً في هذه النسخة.</small>
    </form>
  );
}
