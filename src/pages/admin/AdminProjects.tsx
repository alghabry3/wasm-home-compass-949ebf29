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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { projectsService, ProjectWithRelations } from "@/services/projects.service";
import { useCities, useDistricts } from "@/hooks/useCities";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Search, Eye, Building2 } from "lucide-react";

const projectStatuses = ["قيد الإنشاء", "مكتمل", "جاهز للتسليم", "متاح للبيع"];
const projectTypes = ["سكني", "تجاري", "مختلط", "استثماري"];

const AdminProjects = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithRelations | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  const { data: cities = [] } = useCities();
  const { data: districts = [] } = useDistricts(selectedCityId);
  const { data: developers = [] } = useQuery({
    queryKey: ["developers"],
    queryFn: async () => {
      const { data } = await supabase.from("developers").select("*").eq("is_active", true);
      return data || [];
    },
  });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects", search],
    queryFn: () => projectsService.getAll(search ? { search } : undefined),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => projectsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("تم إضافة المشروع بنجاح");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("حدث خطأ أثناء الإضافة"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => projectsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("تم تحديث المشروع بنجاح");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("حدث خطأ أثناء التحديث"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("تم حذف المشروع بنجاح");
    },
    onError: () => toast.error("حدث خطأ أثناء الحذف"),
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city_id: "",
    district_id: "",
    developer_id: "",
    status: "قيد الإنشاء",
    project_type: "سكني",
    price_from: "",
    price_to: "",
    area_from: "",
    area_to: "",
    total_units: "",
    available_units: "",
    completion_percentage: "",
    is_featured: false,
    is_investment: false,
    address: "",
    expected_delivery_date: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      city_id: "",
      district_id: "",
      developer_id: "",
      status: "قيد الإنشاء",
      project_type: "سكني",
      price_from: "",
      price_to: "",
      area_from: "",
      area_to: "",
      total_units: "",
      available_units: "",
      completion_percentage: "",
      is_featured: false,
      is_investment: false,
      address: "",
      expected_delivery_date: "",
    });
    setEditingProject(null);
    setSelectedCityId("");
  };

  const handleEdit = (project: ProjectWithRelations) => {
    setEditingProject(project);
    setSelectedCityId(project.city_id || "");
    setFormData({
      name: project.name,
      description: project.description || "",
      city_id: project.city_id || "",
      district_id: project.district_id || "",
      developer_id: project.developer_id || "",
      status: project.status || "قيد الإنشاء",
      project_type: project.project_type || "سكني",
      price_from: project.price_from?.toString() || "",
      price_to: project.price_to?.toString() || "",
      area_from: project.area_from?.toString() || "",
      area_to: project.area_to?.toString() || "",
      total_units: project.total_units?.toString() || "",
      available_units: project.available_units?.toString() || "",
      completion_percentage: project.completion_percentage?.toString() || "",
      is_featured: project.is_featured || false,
      is_investment: project.is_investment || false,
      address: project.address || "",
      expected_delivery_date: project.expected_delivery_date || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      description: formData.description || null,
      city_id: formData.city_id || null,
      district_id: formData.district_id || null,
      developer_id: formData.developer_id || null,
      status: formData.status,
      project_type: formData.project_type,
      price_from: formData.price_from ? Number(formData.price_from) : null,
      price_to: formData.price_to ? Number(formData.price_to) : null,
      area_from: formData.area_from ? Number(formData.area_from) : null,
      area_to: formData.area_to ? Number(formData.area_to) : null,
      total_units: formData.total_units ? Number(formData.total_units) : null,
      available_units: formData.available_units ? Number(formData.available_units) : null,
      completion_percentage: formData.completion_percentage ? Number(formData.completion_percentage) : null,
      is_featured: formData.is_featured,
      is_investment: formData.is_investment,
      address: formData.address || null,
      expected_delivery_date: formData.expected_delivery_date || null,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">المشاريع العقارية</h1>
            <p className="text-muted-foreground">إدارة المشاريع والوحدات</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة مشروع
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? "تعديل المشروع" : "إضافة مشروع جديد"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>اسم المشروع *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>الوصف</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>المدينة</Label>
                    <Select
                      value={formData.city_id}
                      onValueChange={(v) => { 
                        setFormData({ ...formData, city_id: v, district_id: "" }); 
                        setSelectedCityId(v);
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>الحي</Label>
                    <Select
                      value={formData.district_id}
                      onValueChange={(v) => setFormData({ ...formData, district_id: v })}
                      disabled={!selectedCityId}
                    >
                      <SelectTrigger><SelectValue placeholder="اختر الحي" /></SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>{district.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>المطور</Label>
                    <Select
                      value={formData.developer_id}
                      onValueChange={(v) => setFormData({ ...formData, developer_id: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="اختر المطور" /></SelectTrigger>
                      <SelectContent>
                        {developers.map((dev: any) => (
                          <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>نوع المشروع</Label>
                    <Select
                      value={formData.project_type}
                      onValueChange={(v) => setFormData({ ...formData, project_type: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>الحالة</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => setFormData({ ...formData, status: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {projectStatuses.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>السعر من</Label>
                    <Input
                      type="number"
                      value={formData.price_from}
                      onChange={(e) => setFormData({ ...formData, price_from: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>السعر إلى</Label>
                    <Input
                      type="number"
                      value={formData.price_to}
                      onChange={(e) => setFormData({ ...formData, price_to: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>المساحة من (م²)</Label>
                    <Input
                      type="number"
                      value={formData.area_from}
                      onChange={(e) => setFormData({ ...formData, area_from: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>المساحة إلى (م²)</Label>
                    <Input
                      type="number"
                      value={formData.area_to}
                      onChange={(e) => setFormData({ ...formData, area_to: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>إجمالي الوحدات</Label>
                    <Input
                      type="number"
                      value={formData.total_units}
                      onChange={(e) => setFormData({ ...formData, total_units: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>الوحدات المتاحة</Label>
                    <Input
                      type="number"
                      value={formData.available_units}
                      onChange={(e) => setFormData({ ...formData, available_units: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>نسبة الإنجاز (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.completion_percentage}
                      onChange={(e) => setFormData({ ...formData, completion_percentage: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>تاريخ التسليم المتوقع</Label>
                    <Input
                      type="date"
                      value={formData.expected_delivery_date}
                      onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>العنوان</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_featured}
                        onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                      />
                      <Label>مميز</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_investment}
                        onCheckedChange={(v) => setFormData({ ...formData, is_investment: v })}
                      />
                      <Label>استثماري</Label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingProject ? "تحديث" : "إضافة"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المشروع</TableHead>
                <TableHead className="text-right">الموقع</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">الوحدات</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">جاري التحميل...</TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">لا توجد مشاريع</p>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        {project.is_featured && <Badge variant="secondary" className="mt-1">مميز</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {project.city?.name || "-"}
                      {project.district?.name && ` - ${project.district.name}`}
                    </TableCell>
                    <TableCell>{project.project_type || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={project.status === "مكتمل" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project.price_from ? `${project.price_from.toLocaleString()} ر.س` : "-"}
                    </TableCell>
                    <TableCell>
                      {project.available_units || 0} / {project.total_units || 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("هل أنت متأكد من الحذف؟")) {
                              deleteMutation.mutate(project.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
