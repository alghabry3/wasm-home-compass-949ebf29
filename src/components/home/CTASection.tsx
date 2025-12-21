import { Button } from "@/components/ui/button";
import { Phone, ArrowLeft } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center bg-card rounded-3xl p-12 shadow-strong relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              جاهز تبدأ رحلتك العقارية؟
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              تحدث مع مستشارينا الآن واحصل على استشارة مجانية تساعدك في اتخاذ القرار الصحيح
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="gold" size="xl" className="w-full sm:w-auto gap-2">
                <Phone className="h-5 w-5" />
                احصل على استشارة مجانية
              </Button>
              <Button variant="outline" size="xl" className="w-full sm:w-auto gap-2">
                تصفح المشاريع
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
