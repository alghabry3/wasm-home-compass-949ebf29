import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { propertiesService, PropertyWithRelations } from '@/services/properties.service';
import { useToast } from '@/hooks/use-toast';
import {
  Building,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const propertyTypes = [
  { value: 'شقة', label: 'شقة' },
  { value: 'فيلا', label: 'فيلا' },
  { value: 'دوبلكس', label: 'دوبلكس' },
  { value: 'تاون هاوس', label: 'تاون هاوس' },
  { value: 'أرض', label: 'أرض' },
  { value: 'عمارة', label: 'عمارة' },
  { value: 'مكتب', label: 'مكتب' },
  { value: 'محل', label: 'محل' },
];

const propertyStatuses = [
  { value: 'للبيع', label: 'للبيع' },
  { value: 'للإيجار', label: 'للإيجار' },
  { value: 'مباع', label: 'مباع' },
  { value: 'مؤجر', label: 'مؤجر' },
];

const furnishedOptions = [
  { value: 'مفروشة', label: 'مفروشة' },
  { value: 'غير مفروشة', label: 'غير مفروشة' },
  { value: 'نصف مفروشة', label: 'نصف مفروشة' },
];

interface PropertyFormData {
  title: string;
  description: string;
  property_type: string;
  status: string;
  price: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  living_rooms: string;
  city_id: string;
  district_id: string;
  address: string;
  age: string;
  furnished: string;
  is_featured: boolean;
  financing_available: boolean;
  housing_support_eligible: boolean;
  video_url: string;
  virtual_tour_url: string;
  owner_name: string;
  owner_phone: string;
  latitude: string;
  longitude: string;
}

const initialFormData: PropertyFormData = {
  title: '',
  description: '',
  property_type: '',
  status: 'للبيع',
  price: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  living_rooms: '',
  city_id: '',
  district_id: '',
  address: '',
  age: '',
  furnished: '',
  is_featured: false,
  financing_available: false,
  housing_support_eligible: false,
  video_url: '',
  virtual_tour_url: '',
  owner_name: '',
  owner_phone: '',
  latitude: '',
  longitude: '',
};

const AdminProperties = () => {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyWithRelations | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch cities
  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch districts based on selected city
  const { data: districts = [] } = useQuery({
    queryKey: ['districts', formData.city_id],
    queryFn: async () => {
      if (!formData.city_id) return [];
      const { data, error } = await supabase
        .from('districts')
        .select('*')
        .eq('city_id', formData.city_id)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!formData.city_id,
  });

  // Fetch all properties (including inactive for admin)
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          city:cities(*),
          district:districts(*)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PropertyWithRelations[];
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Omit<PropertyFormData, 'id'>) => {
      const slug = data.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0621-\u064A-]/g, '');
      
      return propertiesService.create({
        title: data.title,
        description: data.description || null,
        property_type: data.property_type || null,
        status: data.status || 'للبيع',
        price: parseFloat(data.price) || 0,
        area: parseFloat(data.area) || 0,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
        living_rooms: data.living_rooms ? parseInt(data.living_rooms) : null,
        city_id: data.city_id || null,
        district_id: data.district_id || null,
        address: data.address || null,
        age: data.age ? parseInt(data.age) : null,
        furnished: data.furnished || null,
        is_featured: data.is_featured,
        financing_available: data.financing_available,
        housing_support_eligible: data.housing_support_eligible,
        video_url: data.video_url || null,
        virtual_tour_url: data.virtual_tour_url || null,
        owner_name: data.owner_name || null,
        owner_phone: data.owner_phone || null,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        slug,
        is_active: true,
        images: [],
        features: [],
        view_count: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({ title: 'تم إضافة العقار بنجاح' });
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ في إضافة العقار', description: error.message, variant: 'destructive' });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PropertyFormData }) => {
      return propertiesService.update(id, {
        title: data.title,
        description: data.description || null,
        property_type: data.property_type || null,
        status: data.status || 'للبيع',
        price: parseFloat(data.price) || 0,
        area: parseFloat(data.area) || 0,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
        living_rooms: data.living_rooms ? parseInt(data.living_rooms) : null,
        city_id: data.city_id || null,
        district_id: data.district_id || null,
        address: data.address || null,
        age: data.age ? parseInt(data.age) : null,
        furnished: data.furnished || null,
        is_featured: data.is_featured,
        financing_available: data.financing_available,
        housing_support_eligible: data.housing_support_eligible,
        video_url: data.video_url || null,
        virtual_tour_url: data.virtual_tour_url || null,
        owner_name: data.owner_name || null,
        owner_phone: data.owner_phone || null,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({ title: 'تم تحديث العقار بنجاح' });
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ في تحديث العقار', description: error.message, variant: 'destructive' });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: propertiesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({ title: 'تم حذف العقار بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ في حذف العقار', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProperty(null);
    setDialogOpen(false);
  };

  const handleEdit = (property: PropertyWithRelations) => {
    setEditingProperty(property);
    setFormData({
      title: property.title || '',
      description: property.description || '',
      property_type: property.property_type || '',
      status: property.status || 'للبيع',
      price: property.price?.toString() || '',
      area: property.area?.toString() || '',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      living_rooms: property.living_rooms?.toString() || '',
      city_id: property.city_id || '',
      district_id: property.district_id || '',
      address: property.address || '',
      age: property.age?.toString() || '',
      furnished: property.furnished || '',
      is_featured: property.is_featured || false,
      financing_available: property.financing_available || false,
      housing_support_eligible: property.housing_support_eligible || false,
      video_url: property.video_url || '',
      virtual_tour_url: property.virtual_tour_url || '',
      owner_name: property.owner_name || '',
      owner_phone: property.owner_phone || '',
      latitude: property.latitude?.toString() || '',
      longitude: property.longitude?.toString() || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProperty) {
      updateMutation.mutate({ id: editingProperty.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredProperties = properties.filter((property) =>
    property.title?.toLowerCase().includes(search.toLowerCase()) ||
    property.address?.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Helmet>
        <title>إدارة العقارات | وسم هوم العقارية</title>
      </Helmet>

      <AdminLayout title="إدارة العقارات">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في العقارات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingProperty(null); setFormData(initialFormData); }}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة عقار
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? 'تعديل العقار' : 'إضافة عقار جديد'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">عنوان العقار *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="property_type">نوع العقار</Label>
                    <Select
                      value={formData.property_type}
                      onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price and Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">السعر (ريال) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">المساحة (م²) *</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">عمر العقار (سنوات)</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                </div>

                {/* Rooms */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">غرف النوم</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">دورات المياه</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="living_rooms">غرف المعيشة</Label>
                    <Input
                      id="living_rooms"
                      type="number"
                      value={formData.living_rooms}
                      onChange={(e) => setFormData({ ...formData, living_rooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="furnished">التأثيث</Label>
                    <Select
                      value={formData.furnished}
                      onValueChange={(value) => setFormData({ ...formData, furnished: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        {furnishedOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city_id">المدينة</Label>
                    <Select
                      value={formData.city_id}
                      onValueChange={(value) => setFormData({ ...formData, city_id: value, district_id: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district_id">الحي</Label>
                    <Select
                      value={formData.district_id}
                      onValueChange={(value) => setFormData({ ...formData, district_id: value })}
                      disabled={!formData.city_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحي" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">العنوان التفصيلي</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">خط العرض</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">خط الطول</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    />
                  </div>
                </div>

                {/* Owner Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="owner_name">اسم المالك</Label>
                    <Input
                      id="owner_name"
                      value={formData.owner_name}
                      onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner_phone">هاتف المالك</Label>
                    <Input
                      id="owner_phone"
                      value={formData.owner_phone}
                      onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Media URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="video_url">رابط الفيديو</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="virtual_tour_url">رابط الجولة الافتراضية</Label>
                    <Input
                      id="virtual_tour_url"
                      value={formData.virtual_tour_url}
                      onChange={(e) => setFormData({ ...formData, virtual_tour_url: e.target.value })}
                    />
                  </div>
                </div>

                {/* Switches */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">عقار مميز</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="financing_available"
                      checked={formData.financing_available}
                      onCheckedChange={(checked) => setFormData({ ...formData, financing_available: checked })}
                    />
                    <Label htmlFor="financing_available">يقبل التمويل</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="housing_support_eligible"
                      checked={formData.housing_support_eligible}
                      onCheckedChange={(checked) => setFormData({ ...formData, housing_support_eligible: checked })}
                    />
                    <Label htmlFor="housing_support_eligible">مؤهل لدعم السكن</Label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingProperty ? 'تحديث' : 'إضافة'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Properties Table */}
        <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العقار</TableHead>
                <TableHead className="text-right">الموقع</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">المواصفات</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">المشاهدات</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    لا توجد عقارات
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties.map((property) => (
                  <TableRow key={property.id} className={!property.is_active ? 'opacity-50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                          <Building className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            {property.title}
                            {property.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                          </p>
                          <p className="text-sm text-muted-foreground">{property.property_type}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {property.city?.name || '-'}
                        {property.district?.name && ` - ${property.district.name}`}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(property.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {property.bedrooms}
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {property.bathrooms}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Maximize2 className="h-4 w-4" />
                          {property.area} م²
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === 'للبيع' ? 'bg-green-100 text-green-700' :
                        property.status === 'للإيجار' ? 'bg-blue-100 text-blue-700' :
                        property.status === 'مباع' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {property.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {property.view_count || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(property)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(property.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminProperties;
