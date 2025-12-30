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
import { leadsService, LeadWithRelations } from "@/services/leads.service";
import { customersService } from "@/services/customers.service";
import { projectsService } from "@/services/projects.service";
import { Search, Target, Eye, Pencil } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const leadStatuses = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];
const leadPriorities = ["low", "medium", "high", "urgent"];
const leadTypes = ["inquiry", "viewing", "offer", "referral"];

const statusLabels: Record<string, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  qualified: "مؤهل",
  proposal: "عرض سعر",
  negotiation: "تفاوض",
  won: "مكتمل",
  lost: "خاسر",
};

const priorityLabels: Record<string, string> = {
  low: "منخفضة",
  medium: "متوسطة",
  high: "عالية",
  urgent: "عاجلة",
};

const typeLabels: Record<string, string> = {
  inquiry: "استفسار",
  viewing: "معاينة",
  offer: "عرض",
  referral: "إحالة",
};

const AdminLeads = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadWithRelations | null>(null);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["admin-leads", statusFilter],
    queryFn: () => leadsService.getAll(statusFilter !== "all" ? { status: statusFilter } : undefined),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers-list"],
    queryFn: () => customersService.getAll(),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects-list"],
    queryFn: () => projectsService.getAll(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => leadsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast.success("تم تحديث الفرصة بنجاح");
      setIsDialogOpen(false);
      setSelectedLead(null);
    },
    onError: () => toast.error("حدث خطأ أثناء التحديث"),
  });

  const [formData, setFormData] = useState({
    status: "",
    priority: "",
    notes: "",
    estimated_value: "",
  });

  const filteredLeads = leads.filter((lead) =>
    lead.customer?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    lead.project?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (lead: LeadWithRelations) => {
    setSelectedLead(lead);
    setFormData({
      status: lead.status || "new",
      priority: lead.priority || "medium",
      notes: lead.notes || "",
      estimated_value: lead.estimated_value?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    updateMutation.mutate({
      id: selectedLead.id,
      data: {
        status: formData.status,
        priority: formData.priority,
        notes: formData.notes || null,
        estimated_value: formData.estimated_value ? Number(formData.estimated_value) : null,
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "contacted": return "bg-yellow-500";
      case "qualified": return "bg-purple-500";
      case "proposal": return "bg-orange-500";
      case "negotiation": return "bg-cyan-500";
      case "won": return "bg-green-500";
      case "lost": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-500";
      case "high": return "text-orange-500";
      case "medium": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">الفرص العقارية</h1>
            <p className="text-muted-foreground">متابعة وإدارة الفرص</p>
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
              {leadStatuses.map((status) => (
                <SelectItem key={status} value={status}>{statusLabels[status]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {leadStatuses.map((status) => {
            const count = leads.filter((l) => l.status === status).length;
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
                <TableHead className="text-right">المشروع/العقار</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الأولوية</TableHead>
                <TableHead className="text-right">القيمة المتوقعة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">جاري التحميل...</TableCell>
                </TableRow>
              ) : filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">لا توجد فرص</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <p className="font-medium">{lead.customer?.full_name || "-"}</p>
                      <p className="text-sm text-muted-foreground">{lead.customer?.phone}</p>
                    </TableCell>
                    <TableCell>
                      {lead.project?.name || lead.property?.title || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeLabels[lead.lead_type || "inquiry"]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(lead.status || "new")} text-white border-0`}>
                        {statusLabels[lead.status || "new"]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getPriorityColor(lead.priority || "medium")}`}>
                        {priorityLabels[lead.priority || "medium"]}
                      </span>
                    </TableCell>
                    <TableCell>
                      {lead.estimated_value ? `${lead.estimated_value.toLocaleString()} ر.س` : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(lead.created_at), "d MMM yyyy", { locale: ar })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleView(lead)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setSelectedLead(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>تفاصيل الفرصة</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                  <p><strong>العميل:</strong> {selectedLead.customer?.full_name}</p>
                  <p><strong>الجوال:</strong> {selectedLead.customer?.phone}</p>
                  <p><strong>المشروع:</strong> {selectedLead.project?.name || "-"}</p>
                  {selectedLead.message && (
                    <p><strong>الرسالة:</strong> {selectedLead.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>الحالة</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => setFormData({ ...formData, status: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {leadStatuses.map((status) => (
                          <SelectItem key={status} value={status}>{statusLabels[status]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>الأولوية</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(v) => setFormData({ ...formData, priority: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {leadPriorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>{priorityLabels[priority]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>القيمة المتوقعة</Label>
                  <Input
                    type="number"
                    value={formData.estimated_value}
                    onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                  />
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

export default AdminLeads;
