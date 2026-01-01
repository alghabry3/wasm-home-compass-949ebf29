import { useState, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";
const navItems = [
  { label: "الرئيسية", href: "/" },
  { label: "المشاريع", href: "/projects" },
  { label: "اختر لك عقارك", href: "/smart-advisor" },
  { 
    label: "الخدمات", 
    href: "#",
    submenu: [
      { label: "الحلول التمويلية", href: "/financing-solutions" },
      { label: "القروض العقارية", href: "/mortgage-loans" },
      { label: "الرهن العقاري", href: "/mortgage" },
      { label: "حلول التعثر", href: "/default-solutions" },
      { label: "الدعم السكني", href: "/housing-support" },
    ]
  },
  { label: "الاستثمار", href: "/investment" },
  { label: "المدونة", href: "/blog" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل معنا", href: "/contact" },
];

const Header = forwardRef<HTMLElement>((_, ref) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  return (
    <header ref={ref} className="fixed top-0 right-0 left-0 z-50 glass border-b border-border/50">
    
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="وسم هوم العقارية" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <div key={item.href + item.label} className="relative group">
                {item.submenu ? (
                  <>
                    <button
                      className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent text-foreground py-2"
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-card rounded-xl shadow-lg border border-border p-2 min-w-[200px]">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-accent/10 hover:text-accent rounded-lg transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`animated-underline text-sm font-medium transition-colors hover:text-accent ${
                      location.pathname === item.href ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/admin">لوحة التحكم</Link>
                  </Button>
                )}
                <Button variant="gold" size="lg" className="gap-2" asChild>
                  <a href="https://wa.me/966920017195" target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4" />
                    تحدث مع مستشار
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <Link to="/auth">
                    <User className="h-4 w-4" />
                    تسجيل الدخول
                  </Link>
                </Button>
                <Button variant="gold" size="lg" className="gap-2" asChild>
                  <a href="https://wa.me/966920017195" target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4" />
                    تحدث مع مستشار
                  </a>
                </Button>
              </>
            )}
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
                <div key={item.href + item.label}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between py-3 px-4 text-sm font-medium text-foreground"
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform ${openSubmenu === item.label ? "rotate-180" : ""}`} />
                      </button>
                      {openSubmenu === item.label && (
                        <div className="pr-4 space-y-1">
                          {item.submenu.map((sub) => (
                            <Link
                              key={sub.href}
                              to={sub.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-2 px-4 text-sm text-muted-foreground hover:text-accent"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
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
                  )}
                </div>
              ))}
              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="outline" size="lg" className="mt-4 w-full" asChild>
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>لوحة التحكم</Link>
                    </Button>
                  )}
                </>
              ) : (
                <Button variant="outline" size="lg" className="mt-4 w-full gap-2" asChild>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-4 w-4" />
                    تسجيل الدخول
                  </Link>
                </Button>
              )}
              <Button variant="gold" size="lg" className="mt-2 w-full gap-2" asChild>
                <a href="https://wa.me/966920017195" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-4 w-4" />
                  تحدث مع مستشار
                </a>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;