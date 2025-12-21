import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Home, Building, TrendingUp, MapPin, Wallet, Check, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

const steps = [
  {
    id: 1,
    question: "ما هو الهدف من الشراء؟",
    options: [
      { value: "سكن", label: "سكن شخصي", icon: Home, description: "أبحث عن منزل للعائلة" },
      { value: "استثمار", label: "استثمار", icon: TrendingUp, description: "أريد عائد استثماري" },
      { value: "كلاهما", label: "سكن واستثمار", icon: Building, description: "أريد السكن والاستثمار معاً" },
    ],
  },
  {
    id: 2,
    question: "ما هي المدينة المفضلة؟",
    options: [
      { value: "الخبر", label: "الخبر", icon: MapPin, description: "المنطقة الشرقية" },
      { value: "الدمام", label: "الدمام", icon: MapPin, description: "المنطقة الشرقية" },
      { value: "الرياض", label: "الرياض", icon: MapPin, description: "منطقة الرياض" },
      { value: "جدة", label: "جدة", icon: MapPin, description: "منطقة مكة" },
    ],
  },
  {
    id: 3,
    question: "ما هي ميزانيتك التقريبية؟",
    options: [
      { value: "اقل-500", label: "أقل من 500 ألف", icon: Wallet, description: "ميزانية محدودة" },
      { value: "500-800", label: "500 - 800 ألف", icon: Wallet, description: "ميزانية متوسطة" },
      { value: "800-1200", label: "800 ألف - 1.2 مليون", icon: Wallet, description: "ميزانية مرتفعة" },
      { value: "اكثر-1200", label: "أكثر من 1.2 مليون", icon: Wallet, description: "بدون حد" },
    ],
  },
  {
    id: 4,
    question: "هل تحتاج تمويل عقاري؟",
    options: [
      { value: "نعم", label: "نعم، أحتاج تمويل", icon: Check, description: "سأعتمد على التمويل البنكي" },
      { value: "لا", label: "لا، دفع كاش", icon: Wallet, description: "لدي المبلغ كاملاً" },
      { value: "غير-متأكد", label: "غير متأكد", icon: Building, description: "أحتاج استشارة" },
    ],
  },
];

const recommendedProjects = [
  {
    id: 1,
    name: "واحة الخليج",
    location: "الخبر",
    price: "650,000",
    reason: "مناسب لميزانيتك ويقع في منطقة راقية مع عائد استثماري جيد",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    name: "برج النخيل",
    location: "الدمام",
    price: "580,000",
    reason: "خيار مثالي للسكن العائلي مع مرافق متكاملة",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    name: "مشروع الياسمين",
    location: "الخبر",
    reason: "أعلى عائد استثماري في المنطقة مع موقع استراتيجي",
    price: "720,000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  },
];

const SmartAdvisor = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (value: string) => {
    setAnswers({ ...answers, [currentStep]: value });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <Helmet>
        <title>اختر لك عقارك | وسم هوم العقارية</title>
        <meta name="description" content="استخدم أداة الاستشارة الذكية للعثور على العقار المناسب لك بناءً على احتياجاتك وميزانيتك." />
      </Helmet>

      <Header />

      <main className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="section-container text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              استشارة ذكية
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              اختر لك <span className="text-accent">عقارك</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-xl mx-auto">
              أجب على بعض الأسئلة البسيطة وسنرشح لك أفضل المشاريع المناسبة
            </p>
          </div>
        </section>

        {!showResults ? (
          /* Quiz Section */
          <section className="py-16">
            <div className="section-container max-w-3xl">
              {/* Progress Bar */}
              <div className="mb-12">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>الخطوة {currentStep + 1} من {steps.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-gold transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {steps[currentStep].question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {steps[currentStep].options.map((option) => {
                  const Icon = option.icon;
                  const isSelected = answers[currentStep] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`p-6 rounded-2xl border-2 text-right transition-all ${
                        isSelected
                          ? "border-accent bg-accent/10 shadow-lg"
                          : "border-border bg-card hover:border-accent/50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "bg-gradient-gold" : "bg-secondary"
                          }`}
                        >
                          <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-accent"}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-1">{option.label}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center mr-auto">
                            <Check className="h-4 w-4 text-accent-foreground" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  السابق
                </Button>
                <Button
                  variant="gold"
                  onClick={handleNext}
                  disabled={!answers[currentStep]}
                  className="gap-2"
                >
                  {currentStep === steps.length - 1 ? "عرض النتائج" : "التالي"}
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        ) : (
          /* Results Section */
          <section className="py-16">
            <div className="section-container">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4" />
                  توصياتنا لك
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  المشاريع المناسبة لك
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  بناءً على إجاباتك، هذه أفضل 3 مشاريع نرشحها لك
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {recommendedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all group relative"
                  >
                    {index === 0 && (
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-gold text-primary rounded-full text-sm font-bold">
                        الأفضل لك
                      </div>
                    )}
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">{project.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {project.location}
                      </p>
                      <p className="text-accent font-bold text-lg mb-4">
                        يبدأ من {project.price} ريال
                      </p>
                      <div className="p-3 bg-secondary rounded-lg mb-4">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">لماذا نرشحه:</strong> {project.reason}
                        </p>
                      </div>
                      <Link to="/projects">
                        <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
                          عرض التفاصيل
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="gold" size="lg" onClick={handleRestart}>
                  إعادة الاختبار
                </Button>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    تحدث مع مستشار
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default SmartAdvisor;
