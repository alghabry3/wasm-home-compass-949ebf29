import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" {...props}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="مشاريع وسم هوم العقارية"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent backdrop-blur-sm animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium">شريكك الموثوق في عالم العقارات</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight animate-fade-up animation-delay-100">
            نساعدك تختار العقار
            <span className="block text-gradient-gold mt-2">المناسب لك بثقة</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed animate-fade-up animation-delay-200">
            استشارة ذكية ومشاريع موثوقة وشفافية كاملة. دعنا نرافقك في رحلتك العقارية من البحث حتى الإفراغ.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-up animation-delay-300">
            <Button variant="gold" size="xl" className="w-full sm:w-auto gap-2" asChild>
              <Link to="/smart-advisor">
                ابدأ الاستشارة الذكية
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" className="w-full sm:w-auto gap-2" asChild>
              <Link to="/projects">
                <Play className="h-5 w-5" />
                تصفح المشاريع
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 animate-fade-up animation-delay-400">
            {[
              { value: "+500", label: "عميل سعيد" },
              { value: "+50", label: "مشروع موثوق" },
              { value: "+10", label: "سنوات خبرة" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</div>
                <div className="text-sm text-primary-foreground/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
