import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Search } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "أفضل 5 مناطق للاستثمار العقاري في المملكة 2024",
    excerpt: "تعرف على أفضل المناطق التي تحقق عوائد استثمارية مرتفعة في سوق العقارات السعودي هذا العام.",
    category: "الاستثمار",
    author: "فريق وسم هوم",
    date: "15 ديسمبر 2024",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "دليلك الشامل للتمويل العقاري في السعودية",
    excerpt: "كل ما تحتاج معرفته عن خيارات التمويل العقاري المتاحة وكيفية اختيار الأنسب لك.",
    category: "التمويل",
    author: "فريق وسم هوم",
    date: "10 ديسمبر 2024",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    id: 3,
    title: "كيف تختار العقار المناسب لأول مرة؟",
    excerpt: "نصائح ذهبية للمشترين لأول مرة لتجنب الأخطاء الشائعة واتخاذ القرار الصحيح.",
    category: "نصائح",
    author: "فريق وسم هوم",
    date: "5 ديسمبر 2024",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    id: 4,
    title: "مستقبل سوق العقارات في رؤية 2030",
    excerpt: "تحليل شامل لتأثير رؤية المملكة 2030 على القطاع العقاري والفرص المتاحة.",
    category: "تحليلات",
    author: "فريق وسم هوم",
    date: "1 ديسمبر 2024",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    id: 5,
    title: "الفرق بين الشقق والفلل: أيهما أفضل لك؟",
    excerpt: "مقارنة تفصيلية بين أنواع العقارات لمساعدتك في اتخاذ القرار المناسب.",
    category: "مقارنات",
    author: "فريق وسم هوم",
    date: "25 نوفمبر 2024",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    id: 6,
    title: "أهم العوامل التي تؤثر على أسعار العقارات",
    excerpt: "فهم العوامل الأساسية التي تحدد قيمة العقار وكيفية الاستفادة منها.",
    category: "تحليلات",
    author: "فريق وسم هوم",
    date: "20 نوفمبر 2024",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=500&fit=crop",
    featured: false,
  },
];

const categories = ["الكل", "الاستثمار", "التمويل", "نصائح", "تحليلات", "مقارنات"];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "الكل" || post.category === selectedCategory;
    const matchesSearch = post.title.includes(searchQuery) || post.excerpt.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);

  return (
    <>
      <Helmet>
        <title>المدونة | وسم هوم العقارية</title>
        <meta name="description" content="اقرأ أحدث المقالات والنصائح العقارية من خبراء وسم هوم. كل ما تحتاج معرفته عن سوق العقارات السعودي." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="section-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              مدونة <span className="text-accent">وسم هوم</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              نصائح ومقالات عقارية من خبرائنا لمساعدتك في اتخاذ قرارات استثمارية ذكية
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 bg-background border-b border-border">
          <div className="section-container">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ابحث في المقالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-foreground hover:bg-accent/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && selectedCategory === "الكل" && !searchQuery && (
          <section className="py-12 bg-background">
            <div className="section-container">
              <div className="grid lg:grid-cols-2 gap-8 items-center bg-card rounded-2xl overflow-hidden shadow-medium">
                <div className="aspect-video lg:aspect-auto lg:h-full">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <span className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                    مقال مميز
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </div>
                  </div>
                  <Button variant="gold" className="gap-2" asChild>
                    <Link to={`/blog/${featuredPost.id}`}>
                      قراءة المقال
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-16 bg-background">
          <div className="section-container">
            {filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts
                  .filter((post) => !post.featured || selectedCategory !== "الكل" || searchQuery)
                  .map((post) => (
                    <article
                      key={post.id}
                      className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all group"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-3">
                          {post.category}
                        </span>
                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {post.date}
                          </div>
                          <Link 
                            to={`/blog/${post.id}`}
                            className="text-accent font-medium flex items-center gap-1 hover:gap-2 transition-all"
                          >
                            اقرأ المزيد
                            <ArrowLeft className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">لا توجد مقالات تطابق بحثك</p>
              </div>
            )}

            {/* Load More */}
            {filteredPosts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/blog">
                    تحميل المزيد من المقالات
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-secondary">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                اشترك في نشرتنا البريدية
              </h2>
              <p className="text-muted-foreground mb-8">
                احصل على أحدث المقالات والنصائح العقارية مباشرة في بريدك الإلكتروني
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button variant="gold">اشترك الآن</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
