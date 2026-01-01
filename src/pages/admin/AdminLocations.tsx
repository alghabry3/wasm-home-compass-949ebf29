import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  Building2,
  Map,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tables } from '@/integrations/supabase/types';

type City = Tables<'cities'>;
type District = Tables<'districts'> & { city?: City | null };

const regions = [
  { value: 'المنطقة الوسطى', label: 'المنطقة الوسطى' },
  { value: 'المنطقة الغربية', label: 'المنطقة الغربية' },
  { value: 'المنطقة الشرقية', label: 'المنطقة الشرقية' },
  { value: 'المنطقة الجنوبية', label: 'المنطقة الجنوبية' },
  { value: 'المنطقة الشمالية', label: 'المنطقة الشمالية' },
];

const AdminLocations = () => {
  const [activeTab, setActiveTab] = useState('cities');
  const [citySearch, setCitySearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [districtDialogOpen, setDistrictDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [cityForm, setCityForm] = useState({ name: '', name_en: '', region: '', is_active: true });
  const [districtForm, setDistrictForm] = useState({ name: '', name_en: '', city_id: '', is_active: true });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch cities
  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['admin-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as City[];
    },
  });

  // Fetch districts with city relation
  const { data: districts = [], isLoading: districtsLoading } = useQuery({
    queryKey: ['admin-districts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('districts')
        .select('*, city:cities(*)')
        .order('name');
      if (error) throw error;
      return data as District[];
    },
  });

  // City mutations
  const createCityMutation = useMutation({
    mutationFn: async (data: typeof cityForm) => {
      const { data: result, error } = await supabase
        .from('cities')
        .insert({
          name: data.name,
          name_en: data.name_en || null,
          region: data.region || null,
          is_active: data.is_active,
        })
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      toast({ title: 'تم إضافة المدينة بنجاح' });
      resetCityForm();
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ في إضافة المدينة', description: error.message, variant: 'destructive' });
    },
  });

  const updateCityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof cityForm }) => {
      const { data: result, error } = await supabase
        .from('cities')
        .update({
          name: data.name,
          name_en: data.name_en || null,
          region: data.region || null,
          is_active: data.is_active,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-districts'] });
      toast({ title: 'تم تحديث المدينة بنجاح' });
      resetCityForm();
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ في تحديث المدينة', description: error.message, variant: 'destructive' });
    },
  });

  const deleteCityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cities').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      toast({ title: 'تم حذف المدينة بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ في حذف المدينة', description: error.message, variant: 'destructive' });
    },
  });

  // District mutations
  const createDistrictMutation = useMutation({
    mutationFn: async (data: typeof districtForm) => {
      const { data: result, error } = await supabase
        .from('districts')
        .insert({
          name: data.name,
          name_en: data.name_en || null,
          city_id: data.city_id,
          is_active: data.is_active,
        })
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-districts'] });
      toast({ title: 'تم إضافة الحي بنجاح' });
      resetDistrictForm();
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ في إضافة الحي', description: error.message, variant: 'destructive' });
    },
  });

  const updateDistrictMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof districtForm }) => {
      const { data: result, error } = await supabase
        .from('districts')
        .update({
          name: data.name,
          name_en: data.name_en || null,
          city_id: data.city_id,
          is_active: data.is_active,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-districts'] });
      toast({ title: 'تم تحديث الحي بنجاح' });
      resetDistrictForm();
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ في تحديث الحي', description: error.message, variant: 'destructive' });
    },
  });

  const deleteDistrictMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('districts').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-districts'] });
      toast({ title: 'تم حذف الحي بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ في حذف الحي', description: error.message, variant: 'destructive' });
    },
  });

  const resetCityForm = () => {
    setCityForm({ name: '', name_en: '', region: '', is_active: true });
    setEditingCity(null);
    setCityDialogOpen(false);
  };

  const resetDistrictForm = () => {
    setDistrictForm({ name: '', name_en: '', city_id: '', is_active: true });
    setEditingDistrict(null);
    setDistrictDialogOpen(false);
  };

  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setCityForm({
      name: city.name,
      name_en: city.name_en || '',
      region: city.region || '',
      is_active: city.is_active ?? true,
    });
    setCityDialogOpen(true);
  };

  const handleEditDistrict = (district: District) => {
    setEditingDistrict(district);
    setDistrictForm({
      name: district.name,
      name_en: district.name_en || '',
      city_id: district.city_id,
      is_active: district.is_active ?? true,
    });
    setDistrictDialogOpen(true);
  };

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCity) {
      updateCityMutation.mutate({ id: editingCity.id, data: cityForm });
    } else {
      createCityMutation.mutate(cityForm);
    }
  };

  const handleDistrictSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDistrict) {
      updateDistrictMutation.mutate({ id: editingDistrict.id, data: districtForm });
    } else {
      createDistrictMutation.mutate(districtForm);
    }
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    city.name_en?.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
    district.name_en?.toLowerCase().includes(districtSearch.toLowerCase()) ||
    district.city?.name.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const getDistrictCount = (cityId: string) => {
    return districts.filter(d => d.city_id === cityId && d.is_active).length;
  };

  return (
    <>
      <Helmet>
        <title>إدارة المدن والأحياء | وسم هوم العقارية</title>
      </Helmet>

      <AdminLayout title="إدارة المدن والأحياء">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="cities" className="gap-2">
              <Building2 className="h-4 w-4" />
              المدن ({cities.filter(c => c.is_active).length})
            </TabsTrigger>
            <TabsTrigger value="districts" className="gap-2">
              <Map className="h-4 w-4" />
              الأحياء ({districts.filter(d => d.is_active).length})
            </TabsTrigger>
          </TabsList>

          {/* Cities Tab */}
          <TabsContent value="cities">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-72">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث في المدن..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Dialog open={cityDialogOpen} onOpenChange={setCityDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingCity(null); setCityForm({ name: '', name_en: '', region: '', is_active: true }); }}>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة مدينة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCity ? 'تعديل المدينة' : 'إضافة مدينة جديدة'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCitySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="city_name">اسم المدينة (عربي) *</Label>
                      <Input
                        id="city_name"
                        value={cityForm.name}
                        onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city_name_en">اسم المدينة (إنجليزي)</Label>
                      <Input
                        id="city_name_en"
                        value={cityForm.name_en}
                        onChange={(e) => setCityForm({ ...cityForm, name_en: e.target.value })}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="region">المنطقة</Label>
                      <Select
                        value={cityForm.region}
                        onValueChange={(value) => setCityForm({ ...cityForm, region: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المنطقة" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="city_active"
                        checked={cityForm.is_active}
                        onCheckedChange={(checked) => setCityForm({ ...cityForm, is_active: checked })}
                      />
                      <Label htmlFor="city_active">مدينة نشطة</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={resetCityForm}>
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={createCityMutation.isPending || updateCityMutation.isPending}>
                        {editingCity ? 'تحديث' : 'إضافة'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المدينة</TableHead>
                    <TableHead className="text-right">الاسم بالإنجليزية</TableHead>
                    <TableHead className="text-right">المنطقة</TableHead>
                    <TableHead className="text-right">عدد الأحياء</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citiesLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">جاري التحميل...</TableCell>
                    </TableRow>
                  ) : filteredCities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">لا توجد مدن</TableCell>
                    </TableRow>
                  ) : (
                    filteredCities.map((city) => (
                      <TableRow key={city.id} className={!city.is_active ? 'opacity-50' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-accent" />
                            </div>
                            <span className="font-medium">{city.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground" dir="ltr">
                          {city.name_en || '-'}
                        </TableCell>
                        <TableCell>{city.region || '-'}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full bg-secondary text-sm">
                            {getDistrictCount(city.id)} حي
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            city.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {city.is_active ? 'نشطة' : 'غير نشطة'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditCity(city)}>
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
                                    هل أنت متأكد من حذف مدينة "{city.name}"؟ سيتم إلغاء تفعيلها.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteCityMutation.mutate(city.id)}
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
          </TabsContent>

          {/* Districts Tab */}
          <TabsContent value="districts">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-72">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث في الأحياء..."
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Dialog open={districtDialogOpen} onOpenChange={setDistrictDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingDistrict(null); setDistrictForm({ name: '', name_en: '', city_id: '', is_active: true }); }}>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة حي
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingDistrict ? 'تعديل الحي' : 'إضافة حي جديد'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleDistrictSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="district_city">المدينة *</Label>
                      <Select
                        value={districtForm.city_id}
                        onValueChange={(value) => setDistrictForm({ ...districtForm, city_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.filter(c => c.is_active).map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="district_name">اسم الحي (عربي) *</Label>
                      <Input
                        id="district_name"
                        value={districtForm.name}
                        onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="district_name_en">اسم الحي (إنجليزي)</Label>
                      <Input
                        id="district_name_en"
                        value={districtForm.name_en}
                        onChange={(e) => setDistrictForm({ ...districtForm, name_en: e.target.value })}
                        dir="ltr"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="district_active"
                        checked={districtForm.is_active}
                        onCheckedChange={(checked) => setDistrictForm({ ...districtForm, is_active: checked })}
                      />
                      <Label htmlFor="district_active">حي نشط</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={resetDistrictForm}>
                        إلغاء
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createDistrictMutation.isPending || updateDistrictMutation.isPending || !districtForm.city_id}
                      >
                        {editingDistrict ? 'تحديث' : 'إضافة'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الحي</TableHead>
                    <TableHead className="text-right">الاسم بالإنجليزية</TableHead>
                    <TableHead className="text-right">المدينة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {districtsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">جاري التحميل...</TableCell>
                    </TableRow>
                  ) : filteredDistricts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">لا توجد أحياء</TableCell>
                    </TableRow>
                  ) : (
                    filteredDistricts.map((district) => (
                      <TableRow key={district.id} className={!district.is_active ? 'opacity-50' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-accent" />
                            </div>
                            <span className="font-medium">{district.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground" dir="ltr">
                          {district.name_en || '-'}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {district.city?.name || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            district.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {district.is_active ? 'نشط' : 'غير نشط'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditDistrict(district)}>
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
                                    هل أنت متأكد من حذف حي "{district.name}"؟ سيتم إلغاء تفعيله.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteDistrictMutation.mutate(district.id)}
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
          </TabsContent>
        </Tabs>
      </AdminLayout>
    </>
  );
};

export default AdminLocations;
