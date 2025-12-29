import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Landmark,
  MessageSquare,
  CreditCard,
  Link2,
  HelpCircle,
  MapPin,
  Building,
} from 'lucide-react';
import logo from '@/assets/logo.png';

const menuItems = [
  {
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    label: 'المشاريع',
    icon: Building2,
    href: '/admin/projects',
  },
  {
    label: 'الوحدات',
    icon: Home,
    href: '/admin/units',
  },
  {
    label: 'العقارات',
    icon: Building,
    href: '/admin/properties',
  },
  {
    label: 'العملاء',
    icon: Users,
    href: '/admin/customers',
  },
  {
    label: 'الفرص العقارية',
    icon: MessageSquare,
    href: '/admin/leads',
  },
  {
    label: 'طلبات التمويل',
    icon: CreditCard,
    href: '/admin/financing',
  },
  {
    label: 'المدونة',
    icon: FileText,
    href: '/admin/blog',
  },
  {
    label: 'الأسئلة الشائعة',
    icon: HelpCircle,
    href: '/admin/faqs',
  },
  {
    label: 'المطورين',
    icon: Landmark,
    href: '/admin/developers',
  },
  {
    label: 'المدن والأحياء',
    icon: MapPin,
    href: '/admin/locations',
  },
  {
    label: 'ربط Odoo 19',
    icon: Link2,
    href: '/admin/odoo-integration',
  },
  {
    label: 'الإعدادات',
    icon: Settings,
    href: '/admin/settings',
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'super_admin': return 'مدير النظام';
      case 'admin': return 'مدير';
      case 'content_manager': return 'مدير المحتوى';
      case 'finance_manager': return 'مدير التمويل';
      default: return 'مستخدم';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="وسم هوم" className="h-10 brightness-0 invert" />
              <span className="text-sidebar-foreground font-bold">لوحة التحكم</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sidebar-foreground font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {getRoleLabel(userRole)}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-sidebar-foreground/70 hover:text-destructive rounded-lg hover:bg-sidebar-accent/50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:mr-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border h-16 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 -mr-2 text-foreground"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <h1 className="text-xl font-bold text-foreground mr-4">{title}</h1>
          <div className="flex-1" />
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            العودة للموقع
          </Link>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
