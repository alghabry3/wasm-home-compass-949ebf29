import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, Search } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const allProjects = [
  {
    id: 1,
    name: "مشروع النخيل ريزيدنس",
    city: "الرياض",
    price: "650,000",
    image: project1,
    type: "شقق سكنية",
    rooms: 3,
    status: "جاهز",
  },
  {
    id: 2,
    name: "كمباوند الواحة الذهبية",
    city: "الرياض",
    price: "1,200,000",
    image: project2,
    type: "فلل",
    rooms: 5,
    status: "على الخارطة",
  },
  {
    id: 3,
    name: "برج السيف التجاري",
    city: "جدة",
    price: "850,000",
    image: project3,
    type: "مكاتب تجارية",
    rooms: 0,
    status: "جاهز",
  },
  {
    id: 4,
    name: "مجمع الربوة السكني",
    city: "الدمام",
    price: "580,000",
    image: project1,
    type: "شقق سكنية",
    rooms: 2,
    status: "جاهز",
  },
  {
    id: 5,
    name: "فلل الصفوة",
    city: "الرياض",
    price: "1,500,000",
    image: project2,
    type: "فلل فاخرة",
    rooms: 6,
    status: "على الخارطة",
  },
  {
    id: 6,
    name: "أبراج المستقبل",
    city: "جدة",
    price: "690,000",
    image: project3,
    type: "شقق",
    rooms: 3,
    status: "جاهز",
  },
];

const Projects = () => {
  const [selectedCity, setSelectedCity] = useState("الكل");
  const cities = ["الكل", "الرياض", "جدة", "الدمام"];

  const filteredProjects = selectedCity === "الكل" 
    ? allProjects 
    : allProjects.filter(p => p.city === selectedCity);

  return (
    <>
      <Helmet>
        <title>المشاريع العقارية | وسم هوم العقارية</title>
        <meta name="description" content="استكشف أفضل المشاريع العقارية في الرياض وجدة والدمام. شقق وفلل للبيع بأسعار تنافسية." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Page Header */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="section-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              المشاريع <span className="text-accent">العقارية</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              استكشف مجموعة متنوعة من المشاريع السكنية والتجارية الموثوقة
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-secondary sticky top-20 z-40">
          <div className="section-container">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              {/* City Filter */}
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <div className="flex gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCity === city
                          ? "bg-accent text-accent-foreground"
                          : "bg-card text-foreground hover:bg-accent/10"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ابحث عن مشروع..."
                  className="pr-10 pl-4 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-soft card-hover animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                        {project.type}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-card/90 text-foreground text-xs font-medium">
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2">{project.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{project.city}</span>
                      {project.rooms > 0 && <span>• {project.rooms} غرف</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground">يبدأ من</span>
                        <div className="text-xl font-bold text-accent">
                          {project.price} <span className="text-sm">ر.س</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">التفاصيل</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Projects;
