import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Facebook, Twitter, Linkedin } from "lucide-react";

// Static blog posts data (same as Blog.tsx)
const blogPosts = [
  {
    id: 1,
    title: "أفضل 5 مناطق للاستثمار العقاري في المملكة 2024",
    excerpt: "تعرف على أفضل المناطق التي تحقق عوائد استثمارية مرتفعة في سوق العقارات السعودي هذا العام.",
    content: `<p>يعتبر الاستثمار العقاري في المملكة العربية السعودية من أفضل أنواع الاستثمارات طويلة المدى. في هذا المقال، نستعرض أفضل 5 مناطق للاستثمار العقاري:</p>
    <h2>1. الرياض</h2>
    <p>العاصمة والمركز الاقتصادي الرئيسي، تشهد نمواً مستمراً في الطلب على العقارات.</p>
    <h2>2. جدة</h2>
    <p>بوابة الحرمين الشريفين وأهم الموانئ البحرية في المملكة.</p>
    <h2>3. الدمام</h2>
    <p>مركز صناعي رئيسي في المنطقة الشرقية مع نمو اقتصادي ملحوظ.</p>
    <h2>4. مكة المكرمة</h2>
    <p>طلب دائم على العقارات بسبب الحج والعمرة.</p>
    <h2>5. نيوم</h2>
    <p>مشروع المستقبل الذي يعد بفرص استثمارية استثنائية.</p>`,
    category: "الاستثمار",
    author: "فريق وسم هوم",
    date: "15 ديسمبر 2024",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
  },
  {
    id: 2,
    title: "دليلك الشامل للتمويل العقاري في السعودية",
    excerpt: "كل ما تحتاج معرفته عن خيارات التمويل العقاري المتاحة وكيفية اختيار الأنسب لك.",
    content: `<p>التمويل العقاري هو الخطوة الأساسية لتملك منزل أحلامك. إليك دليلاً شاملاً:</p>
    <h2>أنواع التمويل العقاري</h2>
    <p>تتوفر عدة خيارات للتمويل منها التمويل البنكي التقليدي والتمويل الإسلامي المتوافق مع الشريعة.</p>
    <h2>شروط الحصول على التمويل</h2>
    <p>تختلف الشروط من بنك لآخر ولكن تشمل عادةً: الراتب الشهري، مدة الخدمة، والتصنيف الائتماني.</p>
    <h2>نصائح للحصول على أفضل عرض</h2>
    <p>قارن بين عدة بنوك، تحقق من الرسوم المخفية، واحسب التكلفة الإجمالية.</p>`,
    category: "التمويل",
    author: "فريق وسم هوم",
    date: "10 ديسمبر 2024",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop",
  },
  {
    id: 3,
    title: "كيف تختار العقار المناسب لأول مرة؟",
    excerpt: "نصائح ذهبية للمشترين لأول مرة لتجنب الأخطاء الشائعة واتخاذ القرار الصحيح.",
    content: `<p>شراء العقار لأول مرة قرار مهم يتطلب دراسة متأنية. إليك أهم النصائح:</p>
    <h2>حدد ميزانيتك بدقة</h2>
    <p>احسب قدرتك الشرائية الفعلية مع مراعاة التكاليف الإضافية.</p>
    <h2>اختر الموقع بعناية</h2>
    <p>قرب الخدمات والمدارس والمواصلات من العوامل الأساسية.</p>
    <h2>افحص العقار جيداً</h2>
    <p>استعن بخبير لفحص البناء والتأكد من سلامته.</p>`,
    category: "نصائح",
    author: "فريق وسم هوم",
    date: "5 ديسمبر 2024",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=500&fit=crop",
  },
  {
    id: 4,
    title: "مستقبل سوق العقارات في رؤية 2030",
    excerpt: "تحليل شامل لتأثير رؤية المملكة 2030 على القطاع العقاري والفرص المتاحة.",
    content: `<p>رؤية 2030 تفتح آفاقاً واسعة للقطاع العقاري في المملكة.</p>
    <h2>المشاريع الكبرى</h2>
    <p>نيوم، ذا لاين، القدية، ومشروع البحر الأحمر تخلق فرصاً استثمارية ضخمة.</p>
    <h2>تحسين البيئة التنظيمية</h2>
    <p>إصلاحات تشريعية تسهل الاستثمار العقاري.</p>`,
    category: "تحليلات",
    author: "فريق وسم هوم",
    date: "1 ديسمبر 2024",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop",
  },
  {
    id: 5,
    title: "الفرق بين الشقق والفلل: أيهما أفضل لك؟",
    excerpt: "مقارنة تفصيلية بين أنواع العقارات لمساعدتك في اتخاذ القرار المناسب.",
    content: `<p>اختيار نوع العقار يعتمد على عدة عوامل:</p>
    <h2>الشقق</h2>
    <p>مناسبة للعائلات الصغيرة، تكلفة أقل، صيانة أسهل.</p>
    <h2>الفلل</h2>
    <p>خصوصية أكبر، مساحة واسعة، مناسبة للعائلات الكبيرة.</p>`,
    category: "مقارنات",
    author: "فريق وسم هوم",
    date: "25 نوفمبر 2024",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop",
  },
  {
    id: 6,
    title: "أهم العوامل التي تؤثر على أسعار العقارات",
    excerpt: "فهم العوامل الأساسية التي تحدد قيمة العقار وكيفية الاستفادة منها.",
    content: `<p>تتأثر أسعار العقارات بعدة عوامل رئيسية:</p>
    <h2>الموقع</h2>
    <p>العامل الأهم في تحديد قيمة العقار.</p>
    <h2>البنية التحتية</h2>
    <p>توفر الخدمات والمرافق يرفع القيمة.</p>
    <h2>العرض والطلب</h2>
    <p>ديناميكيات السوق تؤثر على الأسعار.</p>`,
    category: "تحليلات",
    author: "فريق وسم هوم",
    date: "20 نوفمبر 2024",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=500&fit=crop",
  },
];

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">المقال غير موجود</h1>
            <p className="text-muted-foreground mb-6">لم نتمكن من العثور على المقال المطلوب</p>
            <Button variant="gold" asChild>
              <Link to="/blog">العودة للمدونة</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <Helmet>
        <title>{post.title} | مدونة وسم هوم</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={`https://wasmhome.sa/blog/${id}`} />
        <meta property="og:title" content={`${post.title} | مدونة وسم هوم`} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image} />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-secondary py-4">
          <div className="section-container">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-accent">الرئيسية</Link>
              <ArrowRight className="w-4 h-4 rotate-180" />
              <Link to="/blog" className="hover:text-accent">المدونة</Link>
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span className="text-foreground line-clamp-1">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article */}
        <article className="py-12 bg-background">
          <div className="section-container max-w-4xl">
            {/* Header */}
            <header className="mb-8">
              {post.category && (
                <span className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>فريق وسم هوم</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{post.date}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed border-r-4 border-accent pr-4">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none text-foreground">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p className="text-muted-foreground">لا يوجد محتوى متاح لهذا المقال.</p>
              )}
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">شارك المقال:</span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-accent/10 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-foreground" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-accent/10 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-foreground" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-accent/10 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-foreground" />
                  </a>
                </div>
              </div>
            </div>

            {/* Back to Blog */}
            <div className="mt-8">
              <Button variant="outline" asChild>
                <Link to="/blog" className="gap-2">
                  <ArrowRight className="w-4 h-4" />
                  العودة للمدونة
                </Link>
              </Button>
            </div>
          </div>
        </article>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="section-container text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              هل تبحث عن عقارك المثالي؟
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              تواصل مع مستشارينا العقاريين للحصول على أفضل النصائح والعروض
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold" size="lg" asChild>
                <Link to="/projects">تصفح المشاريع</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/contact">تواصل معنا</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BlogPost;
