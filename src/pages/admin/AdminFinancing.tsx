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
import { financingService, FinancingRequestWithRelations } from "@/services/financing.service";
import { Search, CreditCard, Eye } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const requestStatuses = ["pending", "under_review", "approved", "rejected", "completed"];
const requestTypes = ["mortgage", "refinance", "housing_support", "default_solution"];

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  under_review: "قيد المراجعة",
  approved: "موافق عليه",
  rejected: "مرفوض",
  completed: "مكتمل",
};

const typeLabels: Record<string, string> = {
  mortgage: "تمويل عقاري",
  refinance: "إعادة تمويل",
  housing_support: "دعم سكني",
  default_solution: "حل تعثر",
};

const AdminFinancing = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<FinancingRequestWithRelations | null>(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-financing", statusFilter],
    queryFn: () => financingService.getAll(statusFilter !== "all" ? { status: statusFilter } : undefined),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => financingService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-financing"] });
      toast.success("تم تحديث الطلب بنجاح");
      setIsDialogOpen(false);
      setSelectedRequest(null);
    },
    onError: () => toast.error("حدث خطأ أثناء التحديث"),
  });

  const [formData, setFormData] = useState({
    status: "",
    notes: "",
  });

  const filteredRequests = requests.filter((req) =>
    req.customer?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    req.customer?.phone?.includes(search)
  );

  const handleView = (request: FinancingRequestWithRelations) => {
    setSelectedRequest(request);
    setFormData({
      status: request.status || "pending",
      notes: request.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    updateMutation.mutate({
      id: selectedRequest.id,
      data: {
        status: formData.status,
        notes: formData.notes || null,
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "under_review": return "bg-blue-500";
      case "approved": return "bg-green-500";
      case "rejected": return "bg-red-500";
      case "completed": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">طلبات التمويل</h1>
            <p className="text-muted-foreground">إدارة طلبات التمويل العقاري</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              {requestStatuses.map((status) => (
                <SelectItem key={status} value={status}>{statusLabels[status]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {requestStatuses.map((status) => {
            const count = requests.filter((r) => r.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status === statusFilter ? "all" : status)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  statusFilter === status ? "border-accent bg-accent/10" : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-sm text-muted-foreground">{statusLabels[status]}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-card rounded-xl border shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">نوع الطلب</TableHead>
                <TableHead className="text-right">الدخل الشهري</TableHead>
                <TableHead className="text-right">الدفعة المقدمة</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">جاري التحميل...</TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">لا توجد طلبات</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <p className="font-medium">{request.customer?.full_name || "-"}</p>
                      <p className="text-sm text-muted-foreground">{request.customer?.phone}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeLabels[request.request_type] || request.request_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {request.monthly_income ? `${request.monthly_income.toLocaleString()} ر.س` : "-"}
                    </TableCell>
                    <TableCell>
                      {request.down_payment_available ? `${request.down_payment_available.toLocaleString()} ر.س` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(request.status || "pending")} text-white border-0`}>
                        {statusLabels[request.status || "pending"]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(request.created_at), "d MMM yyyy", { locale: ar })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleView(request)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setSelectedRequest(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>تفاصيل طلب التمويل</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">العميل</p>
                      <p className="font-medium">{selectedRequest.customer?.full_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">الجوال</p>
                      <p className="font-medium">{selectedRequest.customer?.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">نوع الطلب</p>
                      <p className="font-medium">{typeLabels[selectedRequest.request_type]}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">الدخل الشهري</p>
                      <p className="font-medium">{selectedRequest.monthly_income?.toLocaleString() || "-"} ر.س</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">جهة العمل</p>
                      <p className="font-medium">{selectedRequest.employer_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">سنوات الخدمة</p>
                      <p className="font-medium">{selectedRequest.years_of_service || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">الدفعة المقدمة</p>
                      <p className="font-medium">{selectedRequest.down_payment_available?.toLocaleString() || "-"} ر.س</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">الالتزامات الحالية</p>
                      <p className="font-medium">{selectedRequest.existing_obligations?.toLocaleString() || "-"} ر.س</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">دعم سكني</p>
                      <p className="font-medium">{selectedRequest.has_housing_support ? "نعم" : "لا"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">البنك المفضل</p>
                      <p className="font-medium">{selectedRequest.preferred_bank || "-"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>الحالة</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {requestStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{statusLabels[status]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>ملاحظات</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminFinancing;
