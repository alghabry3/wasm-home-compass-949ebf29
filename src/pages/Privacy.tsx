import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>سياسة الخصوصية | وسم هوم العقارية</title>
        <meta name="description" content="سياسة الخصوصية لشركة وسم هوم العقارية - كيف نحمي بياناتك الشخصية" />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Page Header */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="section-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              سياسة <span className="text-accent">الخصوصية</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="section-container max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-8">
              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. جمع المعلومات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نقوم بجمع المعلومات التي تقدمها لنا طواعية عند استخدام موقعنا، مثل الاسم ورقم الهاتف والبريد الإلكتروني عند ملء نماذج الاتصال أو طلب الاستشارات.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. استخدام المعلومات</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  نستخدم المعلومات التي نجمعها للأغراض التالية:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>التواصل معك بخصوص استفساراتك</li>
                  <li>تقديم الخدمات العقارية المطلوبة</li>
                  <li>إرسال معلومات عن المشاريع الجديدة (بموافقتك)</li>
                  <li>تحسين تجربة المستخدم على الموقع</li>
                </ul>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. حماية البيانات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الإفصاح أو التعديل أو الإتلاف. نستخدم تشفير SSL لحماية البيانات أثناء النقل.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. مشاركة المعلومات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية دون موافقتك الصريحة. قد نشارك المعلومات مع شركائنا في الخدمات العقارية لتقديم خدمة أفضل.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. ملفات تعريف الارتباط (Cookies)</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع. يمكنك تعديل إعدادات متصفحك لرفض ملفات تعريف الارتباط، لكن ذلك قد يؤثر على بعض وظائف الموقع.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. حقوقك</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  لديك الحق في:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>الوصول إلى بياناتك الشخصية</li>
                  <li>تصحيح أي معلومات غير دقيقة</li>
                  <li>طلب حذف بياناتك</li>
                  <li>الاعتراض على معالجة بياناتك</li>
                </ul>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. التواصل معنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني: privacy@wasmhome.sa أو الاتصال على الرقم الموحد: 920017195
                </p>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                آخر تحديث: ديسمبر 2024
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Privacy;
