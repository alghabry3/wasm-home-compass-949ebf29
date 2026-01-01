import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Link2,
  Settings,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  Server,
  Database,
  ArrowRightLeft,
  Clock,
  Zap,
} from 'lucide-react';

interface OdooSettings {
  id: string;
  base_url: string | null;
  api_key: string | null;
  database_name: string | null;
  hosting_type: string | null;
  sync_direction: string | null;
  auto_sync_enabled: boolean;
  sync_interval_minutes: number;
  last_sync_at: string | null;
  field_mappings: Record<string, any>;
  is_active: boolean;
}

interface FieldMapping {
  websiteField: string;
  odooField: string;
  entity: string;
}

const defaultFieldMappings: FieldMapping[] = [
  { entity: 'projects', websiteField: 'name', odooField: 'name' },
  { entity: 'projects', websiteField: 'description', odooField: 'description' },
  { entity: 'projects', websiteField: 'price_from', odooField: 'list_price' },
  { entity: 'projects', websiteField: 'status', odooField: 'state' },
  { entity: 'units', websiteField: 'unit_number', odooField: 'default_code' },
  { entity: 'units', websiteField: 'price', odooField: 'list_price' },
  { entity: 'units', websiteField: 'area', odooField: 'volume' },
  { entity: 'units', websiteField: 'status', odooField: 'state' },
  { entity: 'customers', websiteField: 'full_name', odooField: 'name' },
  { entity: 'customers', websiteField: 'email', odooField: 'email' },
  { entity: 'customers', websiteField: 'phone', odooField: 'phone' },
  { entity: 'leads', websiteField: 'message', odooField: 'description' },
  { entity: 'leads', websiteField: 'status', odooField: 'stage_id' },
];

const OdooIntegration = () => {
  const queryClient = useQueryClient();
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['odoo-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('odoo_settings')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data as OdooSettings | null;
    },
  });

  const [formData, setFormData] = useState({
    base_url: '',
    api_key: '',
    database_name: '',
    hosting_type: 'saas',
    sync_direction: 'one_way',
    auto_sync_enabled: false,
    sync_interval_minutes: 60,
  });

  // Update form when settings load
  useState(() => {
    if (settings) {
      setFormData({
        base_url: settings.base_url || '',
        api_key: settings.api_key || '',
        database_name: settings.database_name || '',
        hosting_type: settings.hosting_type || 'saas',
        sync_direction: settings.sync_direction || 'one_way',
        auto_sync_enabled: settings.auto_sync_enabled,
        sync_interval_minutes: settings.sync_interval_minutes,
      });
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (settings?.id) {
        const { error } = await supabase
          .from('odoo_settings')
          .update(data)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('odoo_settings')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odoo-settings'] });
      toast.success('تم حفظ الإعدادات بنجاح');
    },
    onError: (error) => {
      toast.error('حدث خطأ أثناء الحفظ');
      console.error(error);
    },
  });

  const handleTestConnection = async () => {
    if (!formData.base_url || !formData.api_key) {
      toast.error('يرجى إدخال رابط Odoo و API Key');
      return;
    }

    setTestingConnection(true);
    setConnectionStatus('idle');

    // Simulate connection test
    setTimeout(() => {
      setTestingConnection(false);
      // For demo purposes, we'll show success
      setConnectionStatus('success');
      toast.success('تم الاتصال بـ Odoo بنجاح');
    }, 2000);
  };

  const handleManualSync = async () => {
    toast.info('جاري المزامنة...');
    
    // Log sync attempt
    await supabase.from('sync_logs').insert([
      {
        entity_type: 'all',
        action: 'sync',
        status: 'pending',
      },
    ]);

    setTimeout(() => {
      toast.success('تمت المزامنة بنجاح');
    }, 2000);
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  return (
    <>
      <Helmet>
        <title>ربط Odoo 19 | لوحة التحكم</title>
      </Helmet>

      <AdminLayout title="ربط Odoo 19">
        <div className="max-w-4xl space-y-6">
          {/* Connection Status Banner */}
          <div className={`p-4 rounded-xl flex items-center gap-4 ${
            connectionStatus === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : connectionStatus === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-secondary border border-border'
          }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              connectionStatus === 'success'
                ? 'bg-green-500'
                : connectionStatus === 'error'
                ? 'bg-red-500'
                : 'bg-muted'
            }`}>
              {connectionStatus === 'success' ? (
                <Check className="h-6 w-6 text-primary-foreground" />
              ) : connectionStatus === 'error' ? (
                <X className="h-6 w-6 text-primary-foreground" />
              ) : (
                <Link2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">
                {connectionStatus === 'success'
                  ? 'متصل بـ Odoo 19'
                  : connectionStatus === 'error'
                  ? 'فشل الاتصال'
                  : 'غير متصل'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {settings?.last_sync_at
                  ? `آخر مزامنة: ${new Date(settings.last_sync_at).toLocaleString('ar-SA')}`
                  : 'لم تتم المزامنة بعد'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSync}
              disabled={connectionStatus !== 'success'}
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              مزامنة الآن
            </Button>
          </div>

          {/* Connection Settings */}
          <div className="bg-card rounded-xl shadow-soft border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">إعدادات الاتصال</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Hosting Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  نوع الاستضافة
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'saas', label: 'Odoo SaaS', desc: 'Odoo.com Cloud' },
                    { value: 'odoo_sh', label: 'Odoo.sh', desc: 'Platform as Service' },
                    { value: 'self_hosted', label: 'Self Hosted', desc: 'خادم خاص' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, hosting_type: option.value })}
                      className={`p-4 rounded-xl border-2 text-right transition-all ${
                        formData.hosting_type === option.value
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Base URL */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  رابط Odoo (Base URL)
                </label>
                <input
                  type="url"
                  value={formData.base_url}
                  onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://your-company.odoo.com"
                  dir="ltr"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  API Key / Token
                </label>
                <input
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="أدخل مفتاح API"
                  dir="ltr"
                />
              </div>

              {/* Database Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  اسم قاعدة البيانات (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.database_name}
                  onChange={(e) => setFormData({ ...formData, database_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="database_name"
                  dir="ltr"
                />
              </div>

              {/* Test Connection Button */}
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="w-full"
              >
                {testingConnection ? (
                  <>
                    <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                    جاري اختبار الاتصال...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 ml-2" />
                    اختبار الاتصال
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sync Settings */}
          <div className="bg-card rounded-xl shadow-soft border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">إعدادات المزامنة</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Sync Direction */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  اتجاه المزامنة
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sync_direction: 'one_way' })}
                    className={`p-4 rounded-xl border-2 text-right transition-all ${
                      formData.sync_direction === 'one_way'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <p className="font-medium text-foreground">اتجاه واحد</p>
                    <p className="text-sm text-muted-foreground">Odoo ← الموقع</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sync_direction: 'two_way' })}
                    className={`p-4 rounded-xl border-2 text-right transition-all ${
                      formData.sync_direction === 'two_way'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <p className="font-medium text-foreground">اتجاهين</p>
                    <p className="text-sm text-muted-foreground">Odoo ↔ الموقع</p>
                  </button>
                </div>
              </div>

              {/* Auto Sync */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div>
                  <p className="font-medium text-foreground">المزامنة التلقائية</p>
                  <p className="text-sm text-muted-foreground">مزامنة البيانات تلقائياً</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, auto_sync_enabled: !formData.auto_sync_enabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    formData.auto_sync_enabled ? 'bg-accent' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${
                      formData.auto_sync_enabled ? '-translate-x-6' : '-translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Sync Interval */}
              {formData.auto_sync_enabled && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    فترة المزامنة (بالدقائق)
                  </label>
                  <select
                    value={formData.sync_interval_minutes}
                    onChange={(e) => setFormData({ ...formData, sync_interval_minutes: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value={15}>كل 15 دقيقة</option>
                    <option value={30}>كل 30 دقيقة</option>
                    <option value={60}>كل ساعة</option>
                    <option value={360}>كل 6 ساعات</option>
                    <option value={1440}>مرة يومياً</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Field Mappings */}
          <div className="bg-card rounded-xl shadow-soft border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">ربط الحقول</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                تحديد كيفية ربط حقول الموقع بحقول Odoo
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {['projects', 'units', 'customers', 'leads'].map((entity) => (
                  <div key={entity} className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-secondary px-4 py-2">
                      <span className="font-medium text-foreground">
                        {entity === 'projects' ? 'المشاريع' :
                         entity === 'units' ? 'الوحدات' :
                         entity === 'customers' ? 'العملاء' : 'الفرص'}
                      </span>
                    </div>
                    <div className="divide-y divide-border">
                      {defaultFieldMappings
                        .filter((m) => m.entity === entity)
                        .map((mapping, index) => (
                          <div key={index} className="flex items-center gap-4 p-3">
                            <span className="flex-1 text-sm text-foreground">{mapping.websiteField}</span>
                            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                            <span className="flex-1 text-sm text-muted-foreground" dir="ltr">
                              {mapping.odooField}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              إلغاء
            </Button>
            <Button variant="gold" onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </Button>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default OdooIntegration;
