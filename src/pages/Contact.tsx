import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "استشارة",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");
    setFormData({ name: "", phone: "", type: "استشارة", message: "" });
  };

  return (
    <>
      <Helmet>
        <title>تواصل معنا | وسم هوم العقارية</title>
        <meta name="description" content="تواصل مع فريق وسم هوم العقارية للحصول على استشارة مجانية. نحن هنا لمساعدتك في رحلتك العقارية." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="section-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              تواصل <span className="text-accent">معنا</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              فريقنا جاهز لمساعدتك في أي استفسار أو طلب
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="bg-card p-8 rounded-2xl shadow-medium">
                <h2 className="text-2xl font-bold text-foreground mb-6">أرسل لنا رسالة</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الاسم</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">رقم الجوال</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">نوع الطلب</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="استشارة">استشارة عقارية</option>
                      <option value="شراء">طلب شراء</option>
                      <option value="استثمار">استثمار عقاري</option>
                      <option value="أخرى">استفسار آخر</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الرسالة</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>
                  <Button type="submit" variant="gold" size="lg" className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    إرسال الرسالة
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">معلومات التواصل</h2>
                  <p className="text-muted-foreground mb-8">
                    يسعدنا تواصلك معنا عبر أي من القنوات التالية. فريقنا متاح لخدمتك.
                  </p>
                </div>

                <div className="space-y-6">
                  <a href="https://wa.me/966920017195" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-soft hover:shadow-medium transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">واتساب</h3>
                      <p className="text-muted-foreground" dir="ltr">920017195</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-soft">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">البريد الإلكتروني</h3>
                      <p className="text-muted-foreground">info@wasmhome.sa</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-soft">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">العنوان</h3>
                      <p className="text-muted-foreground">الخبر، شارع الإمام تركي</p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="p-6 bg-secondary rounded-xl">
                  <h3 className="font-bold text-foreground mb-4">ساعات العمل</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>الأحد - الخميس</span>
                      <span>9:00 ص - 6:00 م</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الجمعة</span>
                      <span>مغلق</span>
                    </div>
                    <div className="flex justify-between">
                      <span>السبت</span>
                      <span>10:00 ص - 4:00 م</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
