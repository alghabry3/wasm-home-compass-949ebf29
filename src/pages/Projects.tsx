import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters, { FilterState } from "@/components/properties/PropertyFilters";
import { propertiesData } from "@/data/properties";
import { Search, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>({
    city: "الكل",
    category: "الكل",
    status: "الكل",
    priceRange: [0, 5000000],
    rooms: "الكل",
  });

  const filteredProperties = useMemo(() => {
    return propertiesData.filter((property) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          property.name.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.district.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // City filter
      if (filters.city !== "الكل" && property.city !== filters.city) {
        return false;
      }

      // Category filter
      if (filters.category !== "الكل" && property.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status !== "الكل" && property.status !== filters.status) {
        return false;
      }

      // Price range filter
      if (
        property.priceNum < filters.priceRange[0] ||
        property.priceNum > filters.priceRange[1]
      ) {
        return false;
      }

      // Rooms filter
      if (filters.rooms !== "الكل") {
        const roomCount = filters.rooms === "5+" ? 5 : parseInt(filters.rooms);
        if (filters.rooms === "5+" && property.rooms < 5) return false;
        if (filters.rooms !== "5+" && property.rooms !== roomCount) return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  return (
    <>
      <Helmet>
        <title>المشاريع العقارية | وسم هوم العقارية</title>
        <meta
          name="description"
          content="استكشف أفضل المشاريع العقارية في الخبر والدمام والرياض وجدة. شقق وفلل وأراضي للبيع والإيجار بأسعار تنافسية."
        />
        <meta name="keywords" content="عقارات, شقق للبيع, فلل للبيع, أراضي, استثمار عقاري, الخبر, الدمام, الرياض, جدة" />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Page Header */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="section-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              المشاريع <span className="text-accent">العقارية</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-8">
              استكشف مجموعة متنوعة من المشاريع السكنية والتجارية الموثوقة في جميع أنحاء المملكة
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن مشروع أو منطقة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 rounded-xl border-0 bg-background text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="py-12 bg-background">
          <div className="section-container">
            {/* Filters */}
            <PropertyFilters
              filters={filters}
              onFilterChange={setFilters}
              resultCount={filteredProperties.length}
            />

            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">
                {filteredProperties.length > 0
                  ? `${filteredProperties.length} عقار متاح`
                  : "لا توجد نتائج"}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  aria-label="عرض شبكي"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  aria-label="عرض قائمة"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results Grid */}
            {filteredProperties.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {filteredProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  لا توجد عقارات مطابقة
                </h3>
                <p className="text-muted-foreground mb-6">
                  جرب تغيير معايير البحث أو إعادة ضبط الفلاتر
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      city: "الكل",
                      category: "الكل",
                      status: "الكل",
                      priceRange: [0, 5000000],
                      rooms: "الكل",
                    })
                  }
                >
                  إعادة ضبط الفلاتر
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary">
          <div className="section-container text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              لم تجد ما تبحث عنه؟
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              تواصل مع مستشارينا وسنساعدك في إيجاد العقار المناسب لاحتياجاتك
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold" size="lg" asChild>
                <a href="https://wa.me/966920017195" target="_blank" rel="noopener noreferrer">
                  تواصل عبر واتساب
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/smart-advisor">استخدم المستشار الذكي</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Projects;
