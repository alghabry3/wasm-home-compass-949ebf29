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
import { toast } from "sonner";
import { customersService, CustomerWithRelations } from "@/services/customers.service";
import { useCities, useDistricts } from "@/hooks/useCities";
import { Plus, Pencil, Trash2, Search, Users, Phone, Mail } from "lucide-react";

const customerTypes = ["buyer", "seller", "investor", "renter"];
const customerSources = ["website", "whatsapp", "phone", "referral", "social_media", "walk_in"];
const contactMethods = ["whatsapp", "phone", "email"];

const customerTypeLabels: Record<string, string> = {
  buyer: "مشتري",
  seller: "بائع",
  investor: "مستثمر",
  renter: "مستأجر",
};

const sourceLabels: Record<string, string> = {
  website: "الموقع",
  whatsapp: "واتساب",
  phone: "هاتف",
  referral: "إحالة",
  social_media: "وسائل التواصل",
  walk_in: "زيارة مباشرة",
};

const AdminCustomers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerWithRelations | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  const { data: cities = [] } = useCities();
  const { data: districts = [] } = useDistricts(selectedCityId);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin-customers", search],
    queryFn: () => customersService.getAll(search ? { search } : undefined),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => customersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("تم إضافة العميل بنجاح");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("حدث خطأ أثناء الإضافة"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => customersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("تم تحديث العميل بنجاح");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error("حدث خطأ أثناء التحديث"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("تم حذف العميل بنجاح");
    },
    onError: () => toast.error("حدث خطأ أثناء الحذف"),
  });

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    customer_type: "buyer",
    source: "website",
    preferred_contact: "whatsapp",
    preferred_city_id: "",
    preferred_district_id: "",
    preferred_property_type: "",
    budget_from: "",
    budget_to: "",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      full_name: "",
      phone: "",
      email: "",
      customer_type: "buyer",
      source: "website",
      preferred_contact: "whatsapp",
      preferred_city_id: "",
      preferred_district_id: "",
      preferred_property_type: "",
      budget_from: "",
      budget_to: "",
      notes: "",
    });
    setEditingCustomer(null);
    setSelectedCityId("");
  };

  const handleEdit = (customer: CustomerWithRelations) => {
    setEditingCustomer(customer);
    setSelectedCityId(customer.preferred_city_id || "");
    setFormData({
      full_name: customer.full_name,
      phone: customer.phone,
      email: customer.email || "",
      customer_type: customer.customer_type || "buyer",
      source: customer.source || "website",
      preferred_contact: customer.preferred_contact || "whatsapp",
      preferred_city_id: customer.preferred_city_id || "",
      preferred_district_id: customer.preferred_district_id || "",
      preferred_property_type: customer.preferred_property_type || "",
      budget_from: customer.budget_from?.toString() || "",
      budget_to: customer.budget_to?.toString() || "",
      notes: customer.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      full_name: formData.full_name,
      phone: formData.phone,
      email: formData.email || null,
      customer_type: formData.customer_type,
      source: formData.source,
      preferred_contact: formData.preferred_contact,
      preferred_city_id: formData.preferred_city_id || null,
      preferred_district_id: formData.preferred_district_id || null,
      preferred_property_type: formData.preferred_property_type || null,
      budget_from: formData.budget_from ? Number(formData.budget_from) : null,
      budget_to: formData.budget_to ? Number(formData.budget_to) : null,
      notes: formData.notes || null,
    };

    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">العملاء</h1>
            <p className="text-muted-foreground">إدارة بيانات العملاء</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة عميل
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCustomer ? "تعديل العميل" : "إضافة عميل جديد"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>الاسم الكامل *</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>رقم الجوال *</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label>نوع العميل</Label>
                    <Select
                      value={formData.customer_type}
                      onValueChange={(v) => setFormData({ ...formData, customer_type: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {customerTypes.map((type) => (
                          <SelectItem key={type} value={type}>{customerTypeLabels[type]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>مصدر العميل</Label>
                    <Select
                      value={formData.source}
                      onValueChange={(v) => setFormData({ ...formData, source: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {customerSources.map((source) => (
                          <SelectItem key={source} value={source}>{sourceLabels[source]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>طريقة التواصل المفضلة</Label>
                    <Select
                      value={formData.preferred_contact}
                      onValueChange={(v) => setFormData({ ...formData, preferred_contact: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {contactMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method === "whatsapp" ? "واتساب" : method === "phone" ? "هاتف" : "بريد إلكتروني"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>المدينة المفضلة</Label>
                    <Select
                      value={formData.preferred_city_id}
                      onValueChange={(v) => {
                        setFormData({ ...formData, preferred_city_id: v, preferred_district_id: "" });
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
                    <Label>الحي المفضل</Label>
                    <Select
                      value={formData.preferred_district_id}
                      onValueChange={(v) => setFormData({ ...formData, preferred_district_id: v })}
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
                    <Label>الميزانية من</Label>
                    <Input
                      type="number"
                      value={formData.budget_from}
                      onChange={(e) => setFormData({ ...formData, budget_from: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>الميزانية إلى</Label>
                    <Input
                      type="number"
                      value={formData.budget_to}
                      onChange={(e) => setFormData({ ...formData, budget_to: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>ملاحظات</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingCustomer ? "تحديث" : "إضافة"}
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
              placeholder="بحث بالاسم أو الجوال..."
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
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">التواصل</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">المصدر</TableHead>
                <TableHead className="text-right">الميزانية</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">جاري التحميل...</TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">لا يوجد عملاء</p>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <p className="font-medium">{customer.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.preferred_city?.name}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {customerTypeLabels[customer.customer_type || "buyer"]}
                      </Badge>
                    </TableCell>
                    <TableCell>{sourceLabels[customer.source || "website"]}</TableCell>
                    <TableCell>
                      {customer.budget_from || customer.budget_to ? (
                        <span className="text-sm">
                          {customer.budget_from?.toLocaleString() || 0} - {customer.budget_to?.toLocaleString() || "∞"} ر.س
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("هل أنت متأكد من الحذف؟")) {
                              deleteMutation.mutate(customer.id);
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

export default AdminCustomers;
