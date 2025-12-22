import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(100, "الاسم طويل جداً")
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على أحرف فقط"),
  phone: z
    .string()
    .regex(/^(05|5)?[0-9]{8,9}$/, "رقم الجوال غير صحيح"),
  type: z.enum(["استشارة", "شراء", "استثمار", "أخرى"]),
  message: z
    .string()
    .max(1000, "الرسالة طويلة جداً")
    .optional()
    .or(z.literal("")),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      type: "استشارة",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    // Data is validated by zod schema
    console.log("Form submitted with validated data");
    toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");
    reset();
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الاسم</label>
                    <input
                      type="text"
                      {...register("name")}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-destructive' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-accent`}
                      placeholder="أدخل اسمك الكامل"
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">رقم الجوال</label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-destructive' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-accent`}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                    />
                    {errors.phone && (
                      <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">نوع الطلب</label>
                    <select
                      {...register("type")}
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
                      {...register("message")}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-destructive' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-accent resize-none`}
                      placeholder="اكتب رسالتك هنا..."
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>
                  <Button type="submit" variant="gold" size="lg" className="w-full gap-2" disabled={isSubmitting}>
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
