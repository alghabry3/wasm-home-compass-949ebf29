import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import { Landmark } from 'lucide-react';

const AdminDevelopers = () => {
  return (
    <>
      <Helmet>
        <title>إدارة المطورين | وسم هوم العقارية</title>
      </Helmet>

      <AdminLayout title="إدارة المطورين">
        <div className="bg-card rounded-xl p-8 shadow-soft border border-border text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Landmark className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">إدارة المطورين</h2>
          <p className="text-muted-foreground">
            صفحة إدارة المطورين العقاريين - سيتم إضافة المحتوى لاحقاً
          </p>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDevelopers;
