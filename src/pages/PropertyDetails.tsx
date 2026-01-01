import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Home, 
  Ruler, 
  Building2, 
  CheckCircle, 
  Phone,
  ArrowRight,
  Share2,
  Heart,
  Bath
} from "lucide-react";
import { propertiesData } from "@/data/properties";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // البحث في البيانات الثابتة
  const property = propertiesData.find(p => p.id === Number(id));

  if (!property) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">العقار غير موجود</h1>
            <p className="text-muted-foreground mb-6">لم نتمكن من العثور على العقار المطلوب</p>
            <Button variant="gold" asChild>
              <Link to="/projects">العودة للمشاريع</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const paymentPlans = [
    { name: "الدفعة المقدمة", percentage: "10%", amount: Math.round(property.priceNum * 0.1).toLocaleString() },
    { name: "عند التعاقد", percentage: "20%", amount: Math.round(property.priceNum * 0.2).toLocaleString() },
    { name: "أقساط البناء", percentage: "40%", amount: Math.round(property.priceNum * 0.4).toLocaleString() },
    { name: "عند الاستلام", percentage: "30%", amount: Math.round(property.priceNum * 0.3).toLocaleString() },
  ];

  return (
    <>
      <Helmet>
        <title>{property.name} | وسم هوم العقارية</title>
        <meta name="description" content={`${property.name} - ${property.category} في ${property.district}، ${property.city}. ${property.area} م² بسعر ${property.price} ريال.`} />
        <link rel="canonical" href={`https://wasmhome.sa/properties/${id}`} />
        <meta property="og:title" content={`${property.name} | وسم هوم العقارية`} />
        <meta property="og:description" content={`${property.name} - ${property.category} في ${property.district}، ${property.city}.`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-secondary py-4">
          <div className="section-container">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-accent">الرئيسية</Link>
              <ArrowRight className="w-4 h-4 rotate-180" />
              <Link to="/projects" className="hover:text-accent">العقارات</Link>
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span className="text-foreground">{property.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Image */}
        <section className="relative">
          <div className="aspect-[21/9] max-h-[500px] overflow-hidden">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          
          {/* Quick Actions */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
              <Heart className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-2 rounded-full font-bold ${
              property.status === "للبيع" 
                ? "bg-accent text-accent-foreground" 
                : property.status === "للإيجار"
                ? "bg-blue-500 text-white"
                : "bg-red-500 text-white"
            }`}>
              {property.status}
            </span>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-background">
          <div className="section-container">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Title & Location */}
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                      {property.category}
                    </span>
                    <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm">
                      {property.type}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {property.name}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span>{property.district}، {property.city}</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-xl text-center shadow-soft">
                    <Ruler className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">المساحة</p>
                    <p className="font-bold text-foreground">{property.area} م²</p>
                  </div>
                  <div className="bg-card p-4 rounded-xl text-center shadow-soft">
                    <Home className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">الغرف</p>
                    <p className="font-bold text-foreground">{property.rooms || "-"}</p>
                  </div>
                  <div className="bg-card p-4 rounded-xl text-center shadow-soft">
                    <Bath className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">دورات المياه</p>
                    <p className="font-bold text-foreground">{property.bathrooms || "-"}</p>
                  </div>
                  <div className="bg-card p-4 rounded-xl text-center shadow-soft">
                    <Building2 className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">المطور</p>
                    <p className="font-bold text-foreground text-sm">{property.developer}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-card p-6 rounded-2xl shadow-soft">
                  <h2 className="text-xl font-bold text-foreground mb-4">وصف العقار</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.name} هو عقار مميز يتميز بموقعه الاستراتيجي في {property.district} بمدينة {property.city}. 
                    بمساحة إجمالية {property.area} متر مربع، يوفر هذا العقار تجربة معيشية فريدة مع {property.rooms} غرف و {property.bathrooms} حمامات.
                    مقدم من {property.developer}.
                  </p>
                </div>

                {/* Features */}
                {property.features.length > 0 && (
                  <div className="bg-card p-6 rounded-2xl shadow-soft">
                    <h2 className="text-xl font-bold text-foreground mb-4">المميزات</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-accent" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Plan */}
                <div className="bg-card p-6 rounded-2xl shadow-soft">
                  <h2 className="text-xl font-bold text-foreground mb-4">خطة الدفع</h2>
                  <div className="space-y-3">
                    {paymentPlans.map((plan, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium text-foreground">{plan.name}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-accent font-bold">{plan.percentage}</span>
                          <span className="text-muted-foreground text-sm block">{plan.amount} ريال</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price Card */}
                <div className="bg-card p-6 rounded-2xl shadow-medium sticky top-24">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-1">السعر</p>
                    <p className="text-3xl font-bold text-accent">{property.price}</p>
                    <p className="text-muted-foreground">ريال سعودي</p>
                  </div>

                  <div className="space-y-3">
                    <Button variant="gold" size="lg" className="w-full gap-2" asChild>
                      <a href="https://wa.me/966920017195" target="_blank" rel="noopener noreferrer">
                        <Phone className="w-5 h-5" />
                        تواصل الآن
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <Link to="/contact">طلب معلومات إضافية</Link>
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-bold text-foreground mb-3">هل تحتاج تمويل؟</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      نساعدك في الحصول على أفضل عروض التمويل العقاري
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/financing-solutions">اكتشف خيارات التمويل</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="section-container text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              مهتم بهذا العقار؟
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              تواصل معنا الآن للحصول على استشارة مجانية ومعرفة المزيد من التفاصيل
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold" size="lg" className="gap-2" asChild>
                <a href="https://wa.me/966920017195" target="_blank" rel="noopener noreferrer">
                  <Phone className="w-5 h-5" />
                  تواصل الآن
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/projects">تصفح عقارات أخرى</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PropertyDetails;
