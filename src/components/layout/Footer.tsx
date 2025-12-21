import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <img src={logo} alt="وسم هوم العقارية" className="h-14 w-auto brightness-0 invert" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              شريكك الموثوق في رحلة البحث عن العقار المثالي. نساعدك في اتخاذ القرار الصحيح بثقة واحترافية.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              {[
                { label: "المشاريع", href: "/projects" },
                { label: "اختر لك عقارك", href: "/smart-advisor" },
                { label: "الاستثمار العقاري", href: "/investment" },
                { label: "المدونة", href: "/blog" },
                { label: "من نحن", href: "/about" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">خدماتنا</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>استشارات عقارية مجانية</li>
              <li>تمويل عقاري</li>
              <li>تقييم العقارات</li>
              <li>إدارة الأملاك</li>
              <li>الاستثمار العقاري</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <a href="https://wa.me/966920017195" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-accent transition-colors">
                  <Phone className="h-5 w-5 text-accent" />
                  <span dir="ltr">920017195</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-5 w-5 text-accent" />
                info@wasmhome.sa
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                <span>الخبر، شارع الإمام تركي</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2024 وسم هوم العقارية. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/60">
            <Link to="/privacy" className="hover:text-accent transition-colors">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="hover:text-accent transition-colors">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
