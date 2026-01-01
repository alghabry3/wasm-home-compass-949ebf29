import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Building2,
  Home,
  Users,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Eye,
  Calendar,
} from 'lucide-react';

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [projects, units, customers, leads, financing] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('units').select('id', { count: 'exact', head: true }),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('financing_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      return {
        projects: projects.count || 0,
        units: units.count || 0,
        customers: customers.count || 0,
        newLeads: leads.count || 0,
        pendingFinancing: financing.count || 0,
      };
    },
  });

  const { data: recentLeads } = useQuery({
    queryKey: ['recent-leads'],
    queryFn: async () => {
      const { data } = await supabase
        .from('leads')
        .select(`
          id,
          lead_type,
          status,
          created_at,
          customer:customers(full_name, phone)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const statCards = [
    {
      label: 'المشاريع',
      value: stats?.projects || 0,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      label: 'الوحدات',
      value: stats?.units || 0,
      icon: Home,
      color: 'bg-green-500',
    },
    {
      label: 'العملاء',
      value: stats?.customers || 0,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      label: 'فرص جديدة',
      value: stats?.newLeads || 0,
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
    {
      label: 'طلبات تمويل معلقة',
      value: stats?.pendingFinancing || 0,
      icon: CreditCard,
      color: 'bg-red-500',
    },
  ];

  const getLeadTypeLabel = (type: string) => {
    switch (type) {
      case 'inquiry': return 'استفسار';
      case 'booking': return 'حجز';
      case 'financing': return 'تمويل';
      case 'consultation': return 'استشارة';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'جديد';
      case 'contacted': return 'تم التواصل';
      case 'qualified': return 'مؤهل';
      case 'proposal': return 'عرض سعر';
      case 'negotiation': return 'تفاوض';
      case 'won': return 'مكتمل';
      case 'lost': return 'مفقود';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'qualified': return 'bg-green-100 text-green-700';
      case 'won': return 'bg-emerald-100 text-emerald-700';
      case 'lost': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم | وسم هوم العقارية</title>
      </Helmet>

      <AdminLayout title="لوحة التحكم">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-soft border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <div className="bg-card rounded-xl shadow-soft border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">آخر الفرص العقارية</h2>
            </div>
            <div className="divide-y divide-border">
              {recentLeads && recentLeads.length > 0 ? (
                recentLeads.map((lead: any) => (
                  <div key={lead.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {lead.customer?.full_name || 'غير محدد'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getLeadTypeLabel(lead.lead_type)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  لا توجد فرص حالياً
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl shadow-soft border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">إجراءات سريعة</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'إضافة مشروع', icon: Building2, href: '/admin/projects' },
                { label: 'إضافة وحدة', icon: Home, href: '/admin/units' },
                { label: 'إضافة عميل', icon: Users, href: '/admin/customers' },
                { label: 'إضافة مقال', icon: Eye, href: '/admin/blog' },
              ].map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-secondary hover:bg-secondary/70 transition-colors"
                >
                  <action.icon className="h-8 w-8 text-accent" />
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
