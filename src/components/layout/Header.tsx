import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "الرئيسية", href: "/" },
  { label: "المشاريع", href: "/projects" },
  { label: "اختر لك عقارك", href: "/smart-advisor" },
  { label: "الاستثمار العقاري", href: "/investment" },
  { label: "المدونة", href: "/blog" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل معنا", href: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 glass border-b border-border/50">
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="وسم هوم العقارية" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`animated-underline text-sm font-medium transition-colors hover:text-accent ${
                  location.pathname === item.href
                    ? "text-accent"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="gold" size="lg" className="gap-2">
              <Phone className="h-4 w-4" />
              تحدث مع مستشار
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="القائمة"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border/50 animate-fade-up">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? "bg-accent/10 text-accent"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button variant="gold" size="lg" className="mt-4 gap-2">
                <Phone className="h-4 w-4" />
                تحدث مع مستشار
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
