import React, { forwardRef } from "react";
import { Brain, Shield, Eye, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "استشارة ذكية",
    description: "نظام ذكي يساعدك في اختيار العقار الأنسب لاحتياجاتك وميزانيتك",
  },
  {
    icon: Shield,
    title: "مشاريع موثوقة",
    description: "نختار لك فقط المشاريع من المطورين الموثوقين والمرخصين رسمياً",
  },
  {
    icon: Eye,
    title: "شفافية كاملة",
    description: "معلومات واضحة وشاملة عن كل مشروع دون أي مفاجآت",
  },
  {
    icon: HeadphonesIcon,
    title: "دعم حتى الإفراغ",
    description: "نرافقك في كل خطوة من البحث حتى استلام مفاتيح منزلك الجديد",
  },
];

const WhyUsSection = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  return (
    <section ref={ref} className="py-20 bg-primary text-primary-foreground" {...props}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            لماذا <span className="text-accent">وسم هوم</span>؟
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            نؤمن بأن شراء العقار يجب أن يكون تجربة سهلة وموثوقة
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:border-accent/50 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/20 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

WhyUsSection.displayName = "WhyUsSection";

export default WhyUsSection;
