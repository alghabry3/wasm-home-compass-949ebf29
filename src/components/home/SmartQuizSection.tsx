import React, { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Home, TrendingUp, MapPin, Wallet, ArrowLeft } from "lucide-react";

const SmartQuizSection = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    purpose: "",
    city: "",
    budget: "",
  });

  const questions = [
    {
      id: "purpose",
      title: "ما هو الغرض من الشراء؟",
      options: [
        { value: "living", label: "سكن شخصي", icon: Home },
        { value: "investment", label: "استثمار", icon: TrendingUp },
      ],
    },
    {
      id: "city",
      title: "في أي مدينة تبحث؟",
      options: [
        { value: "riyadh", label: "الرياض" },
        { value: "jeddah", label: "جدة" },
        { value: "dammam", label: "الدمام" },
        { value: "other", label: "مدينة أخرى" },
      ],
    },
    {
      id: "budget",
      title: "ما هي ميزانيتك التقريبية؟",
      options: [
        { value: "under500", label: "أقل من 500 ألف" },
        { value: "500to700", label: "500 - 700 ألف" },
        { value: "700to1m", label: "700 ألف - مليون" },
        { value: "over1m", label: "أكثر من مليون" },
      ],
    },
  ];

  const handleSelect = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const currentQuestion = questions[step];
  const isComplete = step === questions.length - 1 && answers.budget;

  return (
    <section ref={ref} className="py-20 bg-secondary" {...props}>
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              اختر لك <span className="text-accent">عقارك</span> بذكاء
            </h2>
            <p className="text-muted-foreground">
              أجب على 3 أسئلة سريعة ودعنا نقترح لك أفضل المشاريع المناسبة
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= step ? "w-12 bg-accent" : "w-8 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Question Card */}
          <div className="bg-card rounded-2xl p-8 shadow-medium">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                {currentQuestion.id === "purpose" && <Home className="w-5 h-5 text-accent" />}
                {currentQuestion.id === "city" && <MapPin className="w-5 h-5 text-accent" />}
                {currentQuestion.id === "budget" && <Wallet className="w-5 h-5 text-accent" />}
              </div>
              <h3 className="text-xl font-bold text-foreground">{currentQuestion.title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id as keyof typeof answers] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(currentQuestion.id, option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-right ${
                      isSelected
                        ? "border-accent bg-accent/10 shadow-gold"
                        : "border-border hover:border-accent/50 hover:bg-secondary"
                    }`}
                  >
                    <span className={`font-medium ${isSelected ? "text-accent" : "text-foreground"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {isComplete && (
              <div className="mt-8 pt-6 border-t border-border">
                <Button variant="gold" size="lg" className="w-full gap-2">
                  اعرض التوصيات
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

SmartQuizSection.displayName = "SmartQuizSection";

export default SmartQuizSection;
