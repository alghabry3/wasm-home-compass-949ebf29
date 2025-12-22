import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>الشروط والأحكام | وسم هوم العقارية</title>
        <meta name="description" content="الشروط والأحكام لاستخدام موقع وسم هوم العقارية" />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Page Header */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="section-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              الشروط <span className="text-accent">والأحكام</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="section-container max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-8">
              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. القبول بالشروط</h2>
                <p className="text-muted-foreground leading-relaxed">
                  باستخدامك لموقع وسم هوم العقارية، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الموقع.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. الخدمات المقدمة</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  نقدم الخدمات التالية:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>عرض المشاريع العقارية المتاحة</li>
                  <li>استشارات عقارية مجانية</li>
                  <li>المساعدة في التمويل العقاري</li>
                  <li>خدمات الاستثمار العقاري</li>
                  <li>تقييم العقارات</li>
                </ul>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. دقة المعلومات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نسعى لتقديم معلومات دقيقة ومحدثة عن المشاريع العقارية، لكننا لا نضمن دقة أو اكتمال هذه المعلومات. الأسعار والتوافر قابلة للتغيير دون إشعار مسبق.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. حدود المسؤولية</h2>
                <p className="text-muted-foreground leading-relaxed">
                  لا تتحمل وسم هوم العقارية مسؤولية أي خسائر مباشرة أو غير مباشرة ناتجة عن استخدام الموقع أو الاعتماد على المعلومات المقدمة فيه. القرارات الاستثمارية تقع على مسؤولية العميل.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. حقوق الملكية الفكرية</h2>
                <p className="text-muted-foreground leading-relaxed">
                  جميع المحتويات على هذا الموقع، بما في ذلك النصوص والصور والشعارات والتصميمات، هي ملك لشركة وسم هوم العقارية ومحمية بموجب قوانين حقوق الملكية الفكرية.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. الاستشارات المالية</h2>
                <p className="text-muted-foreground leading-relaxed">
                  المعلومات المقدمة على الموقع، بما في ذلك حاسبة العائد الاستثماري، هي لأغراض تقديرية فقط ولا تعتبر نصيحة مالية أو استثمارية. ننصح باستشارة مختص مالي قبل اتخاذ قرارات استثمارية.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. التعديلات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم نشر التعديلات على هذه الصفحة، واستمرارك في استخدام الموقع بعد التعديلات يعني موافقتك عليها.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. القانون الساري</h2>
                <p className="text-muted-foreground leading-relaxed">
                  تخضع هذه الشروط والأحكام لأنظمة المملكة العربية السعودية. أي نزاع ينشأ عن استخدام الموقع يخضع لاختصاص المحاكم السعودية المختصة.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. التواصل</h2>
                <p className="text-muted-foreground leading-relaxed">
                  للاستفسارات حول هذه الشروط والأحكام، يرجى التواصل معنا:
                </p>
                <ul className="list-none text-muted-foreground space-y-2 mt-4">
                  <li><strong>الهاتف:</strong> 920017195</li>
                  <li><strong>البريد الإلكتروني:</strong> info@wasmhome.sa</li>
                  <li><strong>العنوان:</strong> الخبر، شارع الأمير تركي، الرمز البريدي 34412</li>
                </ul>
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

export default Terms;
