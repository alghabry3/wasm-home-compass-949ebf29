import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Target, Eye, Users, Award } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "الدقة",
    description: "نقدم معلومات دقيقة وشاملة عن كل مشروع لمساعدتك في اتخاذ القرار الصحيح",
  },
  {
    icon: Eye,
    title: "الشفافية",
    description: "نؤمن بالوضوح التام في جميع تعاملاتنا مع عملائنا ومطورينا",
  },
  {
    icon: Users,
    title: "العميل أولاً",
    description: "نضع مصلحة العميل في المقام الأول ونسعى لتحقيق أهدافه العقارية",
  },
  {
    icon: Award,
    title: "الجودة",
    description: "نختار فقط المشاريع عالية الجودة من مطورين موثوقين ومرخصين",
  },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>من نحن | وسم هوم العقارية</title>
        <meta name="description" content="تعرف على وسم هوم العقارية - شريكك الموثوق في رحلة البحث عن العقار المثالي في السعودية." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="section-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              من <span className="text-accent">نحن</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              وسم هوم هي شركة عقارية سعودية متخصصة في مساعدة العملاء على اختيار العقار المناسب بثقة واحترافية
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                قصتنا
              </h2>
              <div className="prose prose-lg mx-auto text-muted-foreground leading-relaxed space-y-6">
                <p>
                  بدأت رحلة وسم هوم العقارية من إيماننا بأن كل شخص يستحق تجربة شراء عقار سهلة وموثوقة. في سوق عقاري مليء بالخيارات، وجدنا أن الكثير من العملاء يحتاجون إلى مرشد موثوق يساعدهم في اتخاذ القرار الصحيح.
                </p>
                <p>
                  منذ تأسيسنا، ساعدنا أكثر من 500 عائلة في إيجاد منزل أحلامهم، ونفخر بعلاقاتنا الطويلة مع عملائنا والمطورين الموثوقين في جميع أنحاء المملكة.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-20 bg-secondary">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="bg-card p-8 rounded-2xl shadow-soft">
                <h3 className="text-2xl font-bold text-foreground mb-4">رؤيتنا</h3>
                <p className="text-muted-foreground leading-relaxed">
                  أن نكون المرجع الأول والأكثر موثوقية في السوق العقاري السعودي، ونقود التحول نحو تجربة عقارية ذكية وشفافة.
                </p>
              </div>
              <div className="bg-card p-8 rounded-2xl shadow-soft">
                <h3 className="text-2xl font-bold text-foreground mb-4">رسالتنا</h3>
                <p className="text-muted-foreground leading-relaxed">
                  تمكين العملاء من اتخاذ قرارات عقارية واثقة من خلال تقديم استشارات ذكية ومعلومات شاملة عن أفضل المشاريع الموثوقة.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="section-container">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              قيمنا
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-card shadow-soft animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;
