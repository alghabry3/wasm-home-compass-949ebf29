import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calculator, Building, ChartBar, Target, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const investmentProjects = [
  {
    id: 1,
    name: "برج الخليج التجاري",
    location: "الخبر",
    roi: "12%",
    minInvestment: "500,000",
    type: "تجاري",
    status: "متاح",
  },
  {
    id: 2,
    name: "مجمع الواحة السكني",
    location: "الدمام",
    roi: "9%",
    minInvestment: "350,000",
    type: "سكني",
    status: "متاح",
  },
  {
    id: 3,
    name: "فندق النخيل",
    location: "الخبر",
    roi: "15%",
    minInvestment: "1,000,000",
    type: "فندقي",
    status: "قريباً",
  },
];

const Investment = () => {
  const [investment, setInvestment] = useState(500000);
  const [years, setYears] = useState(5);
  const [roi, setRoi] = useState(10);

  const calculateReturn = () => {
    const totalReturn = investment * Math.pow(1 + roi / 100, years);
    const profit = totalReturn - investment;
    return { totalReturn: totalReturn.toFixed(0), profit: profit.toFixed(0) };
  };

  const results = calculateReturn();

  return (
    <>
      <Helmet>
        <title>الاستثمار العقاري | وسم هوم العقارية</title>
        <meta name="description" content="استثمر بذكاء مع وسم هوم العقارية. احصل على عوائد استثمارية مميزة مع مشاريع موثوقة ومدروسة." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
          </div>
          <div className="section-container text-center relative z-10">
            <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
              استثمار عقاري ذكي
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              استثمر بذكاء <span className="text-accent">مع وسم هوم</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg mb-8">
              نقدم لك فرص استثمارية مدروسة بعناية لتحقيق عوائد مجزية ومستدامة
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold" size="lg">
                استكشف الفرص
              </Button>
              <Button variant="heroOutline" size="lg">
                تحدث مع خبير
              </Button>
            </div>
          </div>
        </section>

        {/* Why Invest */}
        <section className="py-20 bg-background">
          <div className="section-container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                لماذا الاستثمار العقاري معنا؟
              </h2>
              <p className="text-muted-foreground text-lg">
                نوفر لك كل ما تحتاجه لاتخاذ قرار استثماري ناجح
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "عوائد مرتفعة",
                  description: "عوائد استثمارية تصل إلى 15% سنوياً",
                },
                {
                  icon: Shield,
                  title: "استثمار آمن",
                  description: "مشاريع مدروسة من مطورين موثوقين",
                },
                {
                  icon: Target,
                  title: "تنوع الفرص",
                  description: "خيارات متنوعة تناسب جميع الميزانيات",
                },
                {
                  icon: ChartBar,
                  title: "تقارير شفافة",
                  description: "تحليلات دقيقة وتقارير دورية",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-8 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-shadow"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-gold mx-auto mb-6 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-20 bg-secondary">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                  أداة حساب العائد
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  احسب عائدك الاستثماري
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  استخدم حاسبة العائد الاستثماري لتقدير أرباحك المتوقعة بناءً على مبلغ الاستثمار والمدة الزمنية
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      مبلغ الاستثمار (ريال)
                    </label>
                    <input
                      type="range"
                      min="100000"
                      max="5000000"
                      step="50000"
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>100,000</span>
                      <span className="text-accent font-bold">{investment.toLocaleString()}</span>
                      <span>5,000,000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      مدة الاستثمار (سنوات)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>1</span>
                      <span className="text-accent font-bold">{years} سنوات</span>
                      <span>20</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      العائد السنوي المتوقع (%)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={roi}
                      onChange={(e) => setRoi(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>5%</span>
                      <span className="text-accent font-bold">{roi}%</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary p-8 rounded-2xl text-primary-foreground">
                <div className="flex items-center gap-3 mb-8">
                  <Calculator className="w-8 h-8 text-accent" />
                  <h3 className="text-2xl font-bold">نتائج الحساب</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-primary-foreground/20">
                    <span className="text-primary-foreground/70">مبلغ الاستثمار</span>
                    <span className="text-xl font-bold">{investment.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-primary-foreground/20">
                    <span className="text-primary-foreground/70">الأرباح المتوقعة</span>
                    <span className="text-xl font-bold text-accent">
                      {Number(results.profit).toLocaleString()} ريال
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-foreground/70">إجمالي العائد</span>
                    <span className="text-2xl font-bold text-accent">
                      {Number(results.totalReturn).toLocaleString()} ريال
                    </span>
                  </div>
                </div>

                <Button variant="gold" size="lg" className="w-full mt-8">
                  ابدأ الاستثمار الآن
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Projects */}
        <section className="py-20 bg-background">
          <div className="section-container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                فرص استثمارية مميزة
              </h2>
              <p className="text-muted-foreground text-lg">
                اختر من بين مجموعة مختارة من المشاريع ذات العوائد المرتفعة
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {investmentProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                        {project.type}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.status === "متاح"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">{project.name}</h3>
                    <p className="text-muted-foreground mb-6">{project.location}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-secondary rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">العائد السنوي</p>
                        <p className="text-xl font-bold text-accent">{project.roi}</p>
                      </div>
                      <div className="text-center p-3 bg-secondary rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">الحد الأدنى</p>
                        <p className="text-xl font-bold text-foreground">{project.minInvestment}</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors">
                      عرض التفاصيل
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/projects">
                <Button variant="gold" size="lg">
                  عرض جميع المشاريع
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-primary text-primary-foreground">
          <div className="section-container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              هل أنت مستعد للاستثمار؟
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
              تواصل معنا الآن واحصل على استشارة استثمارية مجانية من خبرائنا
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button variant="gold" size="lg">
                  احصل على استشارة مجانية
                </Button>
              </Link>
              <a href="https://wa.me/966920017195" target="_blank" rel="noopener noreferrer">
                <Button variant="heroOutline" size="lg">
                  تواصل عبر واتساب
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Investment;
