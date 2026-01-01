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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { unitsService, UnitWithRelations } from "@/services/units.service";
import { projectsService } from "@/services/projects.service";
import { Plus, Pencil, Trash2, Search, Home } from "lucide-react";

const unitStatuses = ["متاح", "محجوز", "مباع"];
const unitTypes = ["شقة", "فيلا", "دوبلكس", "استوديو", "بنتهاوس"];
const saleTypes = ["للبيع", "للإيجار", "للاستثمار"];

const AdminUnits = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitWithRelations | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects-list"],
    queryFn: () => projectsService.getAll(),
  });

  const { data: units = [], isLoading } = useQuery({
    queryKey: ["admin-units"],
    queryFn: () => unitsService.getAll(),
  });

  const filteredUnits = units.filter(
    (unit) =>
      unit.unit_number.toLowerCase().includes(search.toLowerCase()) ||
      unit.project?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: (data: any) => unitsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-units"] });
      toast.success("تم إضافة الوحدة بنجاح");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("حدث خطأ أثناء الإضافة"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => unitsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-units"] });
      toast.success("تم تحديث الوحدة بنجاح");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("حدث خطأ أثناء التحديث"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => unitsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-units"] });
      toast.success("تم حذف الوحدة بنجاح");
    },
    onError: () => toast.error("حدث خطأ أثناء الحذف"),
  });

  const [formData, setFormData] = useState({
    project_id: "",
    unit_number: "",
    unit_type: "شقة",
    status: "متاح",
    sale_type: "للبيع",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    living_rooms: "",
    floor_number: "",
    booking_amount: "",
    expected_delivery_date: "",
    is_featured: false,
  });

  const resetForm = () => {
    setFormData({
      project_id: "",
      unit_number: "",
      unit_type: "شقة",
      status: "متاح",
      sale_type: "للبيع",
      price: "",
      area: "",
      bedrooms: "",
      bathrooms: "",
      living_rooms: "",
      floor_number: "",
      booking_amount: "",
      expected_delivery_date: "",
      is_featured: false,
    });
    setEditingUnit(null);
  };

  const handleEdit = (unit: UnitWithRelations) => {
    setEditingUnit(unit);
    setFormData({
      project_id: unit.project_id,
      unit_number: unit.unit_number,
      unit_type: unit.unit_type || "شقة",
      status: unit.status || "متاح",
      sale_type: unit.sale_type || "للبيع",
      price: unit.price.toString(),
      area: unit.area.toString(),
      bedrooms: unit.bedrooms?.toString() || "",
      bathrooms: unit.bathrooms?.toString() || "",
      living_rooms: unit.living_rooms?.toString() || "",
      floor_number: unit.floor_number?.toString() || "",
      booking_amount: unit.booking_amount?.toString() || "",
      expected_delivery_date: unit.expected_delivery_date || "",
      is_featured: unit.is_featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      project_id: formData.project_id,
      unit_number: formData.unit_number,
      unit_type: formData.unit_type,
      status: formData.status,
      sale_type: formData.sale_type,
      price: Number(formData.price),
      area: Number(formData.area),
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
      living_rooms: formData.living_rooms ? Number(formData.living_rooms) : null,
      floor_number: formData.floor_number ? Number(formData.floor_number) : null,
      booking_amount: formData.booking_amount ? Number(formData.booking_amount) : null,
      expected_delivery_date: formData.expected_delivery_date || null,
      is_featured: formData.is_featured,
      price_per_sqm: formData.price && formData.area ? Number(formData.price) / Number(formData.area) : null,
    };

    if (editingUnit) {
      updateMutation.mutate({ id: editingUnit.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">الوحدات العقارية</h1>
            <p className="text-muted-foreground">إدارة وحدات المشاريع</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة وحدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingUnit ? "تعديل الوحدة" : "إضافة وحدة جديدة"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>المشروع *</Label>
                    <Select
                      value={formData.project_id}
                      onValueChange={(v) => setFormData({ ...formData, project_id: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="اختر المشروع" /></SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>رقم الوحدة *</Label>
                    <Input
                      value={formData.unit_number}
                      onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>نوع الوحدة</Label>
                    <Select
                      value={formData.unit_type}
                      onValueChange={(v) => setFormData({ ...formData, unit_type: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {unitTypes.map((type) => (
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
                        {unitStatuses.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>نوع البيع</Label>
                    <Select
                      value={formData.sale_type}
                      onValueChange={(v) => setFormData({ ...formData, sale_type: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {saleTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>السعر (ر.س) *</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>المساحة (م²) *</Label>
                    <Input
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>غرف النوم</Label>
                    <Input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>دورات المياه</Label>
                    <Input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>غرف المعيشة</Label>
                    <Input
                      type="number"
                      value={formData.living_rooms}
                      onChange={(e) => setFormData({ ...formData, living_rooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>رقم الطابق</Label>
                    <Input
                      type="number"
                      value={formData.floor_number}
                      onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>مبلغ الحجز</Label>
                    <Input
                      type="number"
                      value={formData.booking_amount}
                      onChange={(e) => setFormData({ ...formData, booking_amount: e.target.value })}
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
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_featured}
                      onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                    />
                    <Label>وحدة مميزة</Label>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingUnit ? "تحديث" : "إضافة"}
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
                <TableHead className="text-right">الوحدة</TableHead>
                <TableHead className="text-right">المشروع</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">المساحة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">جاري التحميل...</TableCell>
                </TableRow>
              ) : filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Home className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">لا توجد وحدات</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{unit.unit_number}</p>
                        {unit.is_featured && <Badge variant="secondary" className="mt-1">مميز</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{unit.project?.name || "-"}</TableCell>
                    <TableCell>{unit.unit_type || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          unit.status === "متاح" ? "default" :
                          unit.status === "محجوز" ? "secondary" : "outline"
                        }
                      >
                        {unit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{unit.price.toLocaleString()} ر.س</TableCell>
                    <TableCell>{unit.area} م²</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(unit)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("هل أنت متأكد من الحذف؟")) {
                              deleteMutation.mutate(unit.id);
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

export default AdminUnits;
