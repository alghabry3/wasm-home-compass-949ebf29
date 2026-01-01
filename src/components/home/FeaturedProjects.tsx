import React, { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const tabs = [
  { id: "living", label: "الأفضل للسكن" },
  { id: "investment", label: "الأفضل للاستثمار" },
  { id: "budget", label: "أقل من 700 ألف" },
];

const projects = [
  {
    id: 1,
    name: "مشروع النخيل ريزيدنس",
    city: "الرياض",
    price: "650,000",
    image: project1,
    category: ["living", "budget"],
    type: "شقق سكنية",
  },
  {
    id: 2,
    name: "كمباوند الواحة الذهبية",
    city: "الرياض",
    price: "1,200,000",
    image: project2,
    category: ["living", "investment"],
    type: "فلل",
  },
  {
    id: 3,
    name: "برج السيف التجاري",
    city: "جدة",
    price: "850,000",
    image: project3,
    category: ["investment"],
    type: "مكاتب تجارية",
  },
  {
    id: 4,
    name: "مجمع الربوة السكني",
    city: "الدمام",
    price: "580,000",
    image: project1,
    category: ["living", "budget"],
    type: "شقق سكنية",
  },
  {
    id: 5,
    name: "فلل الصفوة",
    city: "الرياض",
    price: "1,500,000",
    image: project2,
    category: ["investment"],
    type: "فلل فاخرة",
  },
  {
    id: 6,
    name: "أبراج المستقبل",
    city: "جدة",
    price: "690,000",
    image: project3,
    category: ["budget", "investment"],
    type: "شقق",
  },
];

const FeaturedProjects = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  const [activeTab, setActiveTab] = useState("living");

  const filteredProjects = projects.filter((project) =>
    project.category.includes(activeTab)
  );

  return (
    <section ref={ref} className="py-20" {...props}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            مشاريع <span className="text-accent">مختارة</span> لك
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            استكشف مجموعة من أفضل المشاريع العقارية الموثوقة والمناسبة لاحتياجاتك
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-accent text-accent-foreground shadow-gold"
                  : "bg-secondary text-foreground hover:bg-accent/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft card-hover animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                    {project.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{project.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">يبدأ من</span>
                    <div className="text-xl font-bold text-accent">
                      {project.price} <span className="text-sm">ر.س</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/projects/${project.id}`}>التفاصيل</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/projects">
            <Button variant="default" size="lg" className="gap-2">
              عرض جميع المشاريع
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
});

FeaturedProjects.displayName = "FeaturedProjects";

export default FeaturedProjects;
