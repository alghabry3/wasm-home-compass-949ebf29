import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, MapPin, Building, Users } from "lucide-react";

const AdminSettings = () => {
  const queryClient = useQueryClient();

  // Cities
  const { data: cities = [] } = useQuery({
    queryKey: ["admin-cities"],
    queryFn: async () => {
      const { data } = await supabase.from("cities").select("*").order("name");
      return data || [];
    },
  });

  // Districts
  const { data: districts = [] } = useQuery({
    queryKey: ["admin-districts"],
    queryFn: async () => {
      const { data } = await supabase.from("districts").select("*, city:cities(name)").order("name");
      return data || [];
    },
  });

  // Developers
  const { data: developers = [] } = useQuery({
    queryKey: ["admin-developers"],
    queryFn: async () => {
      const { data } = await supabase.from("developers").select("*").order("name");
      return data || [];
    },
  });

  // City Form
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<any>(null);
  const [cityForm, setCityForm] = useState({ name: "", name_en: "", region: "" });

  const saveCityMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingCity) {
        const { error } = await supabase.from("cities").update(data).eq("id", editingCity.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cities").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cities"] });
      toast.success(editingCity ? "تم تحديث المدينة" : "تم إضافة المدينة");
      setCityDialogOpen(false);
      setCityForm({ name: "", name_en: "", region: "" });
      setEditingCity(null);
    },
    onError: () => toast.error("حدث خطأ"),
  });

  // District Form
  const [districtDialogOpen, setDistrictDialogOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<any>(null);
  const [districtForm, setDistrictForm] = useState({ name: "", name_en: "", city_id: "" });

  const saveDistrictMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingDistrict) {
        const { error } = await supabase.from("districts").update(data).eq("id", editingDistrict.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("districts").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-districts"] });
      toast.success(editingDistrict ? "تم تحديث الحي" : "تم إضافة الحي");
      setDistrictDialogOpen(false);
      setDistrictForm({ name: "", name_en: "", city_id: "" });
      setEditingDistrict(null);
    },
    onError: () => toast.error("حدث خطأ"),
  });

  // Developer Form
  const [developerDialogOpen, setDeveloperDialogOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<any>(null);
  const [developerForm, setDeveloperForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    license_number: "",
  });

  const saveDeveloperMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingDeveloper) {
        const { error } = await supabase.from("developers").update(data).eq("id", editingDeveloper.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("developers").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-developers"] });
      toast.success(editingDeveloper ? "تم تحديث المطور" : "تم إضافة المطور");
      setDeveloperDialogOpen(false);
      setDeveloperForm({ name: "", email: "", phone: "", website: "", license_number: "" });
      setEditingDeveloper(null);
    },
    onError: () => toast.error("حدث خطأ"),
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة المدن والأحياء والمطورين</p>
        </div>

        <Tabs defaultValue="cities" className="space-y-6">
          <TabsList>
            <TabsTrigger value="cities" className="gap-2">
              <MapPin className="h-4 w-4" />
              المدن
            </TabsTrigger>
            <TabsTrigger value="districts" className="gap-2">
              <MapPin className="h-4 w-4" />
              الأحياء
            </TabsTrigger>
            <TabsTrigger value="developers" className="gap-2">
              <Building className="h-4 w-4" />
              المطورين
            </TabsTrigger>
          </TabsList>

          {/* Cities Tab */}
          <TabsContent value="cities" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={cityDialogOpen} onOpenChange={setCityDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={() => { setEditingCity(null); setCityForm({ name: "", name_en: "", region: "" }); }}>
                    <Plus className="h-4 w-4" />
                    إضافة مدينة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCity ? "تعديل المدينة" : "إضافة مدينة"}</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveCityMutation.mutate(cityForm);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label>اسم المدينة (عربي) *</Label>
                      <Input
                        value={cityForm.name}
                        onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>اسم المدينة (إنجليزي)</Label>
                      <Input
                        value={cityForm.name_en}
                        onChange={(e) => setCityForm({ ...cityForm, name_en: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>المنطقة</Label>
                      <Input
                        value={cityForm.region}
                        onChange={(e) => setCityForm({ ...cityForm, region: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setCityDialogOpen(false)}>إلغاء</Button>
                      <Button type="submit">{editingCity ? "تحديث" : "إضافة"}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-xl border shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المدينة</TableHead>
                    <TableHead className="text-right">بالإنجليزية</TableHead>
                    <TableHead className="text-right">المنطقة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city: any) => (
                    <TableRow key={city.id}>
                      <TableCell className="font-medium">{city.name}</TableCell>
                      <TableCell>{city.name_en || "-"}</TableCell>
                      <TableCell>{city.region || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCity(city);
                            setCityForm({ name: city.name, name_en: city.name_en || "", region: city.region || "" });
                            setCityDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Districts Tab */}
          <TabsContent value="districts" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={districtDialogOpen} onOpenChange={setDistrictDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={() => { setEditingDistrict(null); setDistrictForm({ name: "", name_en: "", city_id: "" }); }}>
                    <Plus className="h-4 w-4" />
                    إضافة حي
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingDistrict ? "تعديل الحي" : "إضافة حي"}</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveDistrictMutation.mutate(districtForm);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label>المدينة *</Label>
                      <select
                        className="w-full p-2 border rounded-md bg-background"
                        value={districtForm.city_id}
                        onChange={(e) => setDistrictForm({ ...districtForm, city_id: e.target.value })}
                        required
                      >
                        <option value="">اختر المدينة</option>
                        {cities.map((city: any) => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>اسم الحي (عربي) *</Label>
                      <Input
                        value={districtForm.name}
                        onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>اسم الحي (إنجليزي)</Label>
                      <Input
                        value={districtForm.name_en}
                        onChange={(e) => setDistrictForm({ ...districtForm, name_en: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setDistrictDialogOpen(false)}>إلغاء</Button>
                      <Button type="submit">{editingDistrict ? "تحديث" : "إضافة"}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-xl border shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الحي</TableHead>
                    <TableHead className="text-right">بالإنجليزية</TableHead>
                    <TableHead className="text-right">المدينة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {districts.map((district: any) => (
                    <TableRow key={district.id}>
                      <TableCell className="font-medium">{district.name}</TableCell>
                      <TableCell>{district.name_en || "-"}</TableCell>
                      <TableCell>{district.city?.name || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingDistrict(district);
                            setDistrictForm({ name: district.name, name_en: district.name_en || "", city_id: district.city_id });
                            setDistrictDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Developers Tab */}
          <TabsContent value="developers" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={developerDialogOpen} onOpenChange={setDeveloperDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={() => { setEditingDeveloper(null); setDeveloperForm({ name: "", email: "", phone: "", website: "", license_number: "" }); }}>
                    <Plus className="h-4 w-4" />
                    إضافة مطور
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingDeveloper ? "تعديل المطور" : "إضافة مطور"}</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveDeveloperMutation.mutate(developerForm);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label>اسم المطور *</Label>
                      <Input
                        value={developerForm.name}
                        onChange={(e) => setDeveloperForm({ ...developerForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>البريد الإلكتروني</Label>
                      <Input
                        type="email"
                        value={developerForm.email}
                        onChange={(e) => setDeveloperForm({ ...developerForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>رقم الجوال</Label>
                      <Input
                        value={developerForm.phone}
                        onChange={(e) => setDeveloperForm({ ...developerForm, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>الموقع الإلكتروني</Label>
                      <Input
                        value={developerForm.website}
                        onChange={(e) => setDeveloperForm({ ...developerForm, website: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>رقم الترخيص</Label>
                      <Input
                        value={developerForm.license_number}
                        onChange={(e) => setDeveloperForm({ ...developerForm, license_number: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setDeveloperDialogOpen(false)}>إلغاء</Button>
                      <Button type="submit">{editingDeveloper ? "تحديث" : "إضافة"}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-xl border shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المطور</TableHead>
                    <TableHead className="text-right">البريد</TableHead>
                    <TableHead className="text-right">الجوال</TableHead>
                    <TableHead className="text-right">رقم الترخيص</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {developers.map((dev: any) => (
                    <TableRow key={dev.id}>
                      <TableCell className="font-medium">{dev.name}</TableCell>
                      <TableCell>{dev.email || "-"}</TableCell>
                      <TableCell>{dev.phone || "-"}</TableCell>
                      <TableCell>{dev.license_number || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingDeveloper(dev);
                            setDeveloperForm({
                              name: dev.name,
                              email: dev.email || "",
                              phone: dev.phone || "",
                              website: dev.website || "",
                              license_number: dev.license_number || "",
                            });
                            setDeveloperDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
