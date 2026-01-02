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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Shield, ShieldCheck, ShieldX, UserCog, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

type AppRole = "super_admin" | "admin" | "content_manager" | "finance_manager" | "viewer";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  role_id?: string;
  role?: AppRole | null;
  profile?: {
    full_name?: string;
    phone?: string;
  };
}

const roleLabels: Record<AppRole, string> = {
  super_admin: "مدير النظام",
  admin: "مدير",
  content_manager: "مدير المحتوى",
  finance_manager: "مدير التمويل",
  viewer: "مشاهد",
};

const roleColors: Record<AppRole, string> = {
  super_admin: "bg-destructive text-destructive-foreground",
  admin: "bg-primary text-primary-foreground",
  content_manager: "bg-accent text-accent-foreground",
  finance_manager: "bg-secondary text-secondary-foreground",
  viewer: "bg-muted text-muted-foreground",
};

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { user: currentUser, userRole: currentUserRole } = useAuth();
  const [search, setSearch] = useState("");
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>("viewer");

  // Fetch users with roles
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Get all users from profiles (which links to auth.users)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get all roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.user_id);
        return {
          id: profile.user_id,
          email: profile.full_name || "غير معروف",
          created_at: profile.created_at,
          role_id: userRole?.id,
          role: userRole?.role as AppRole | undefined,
          profile: {
            full_name: profile.full_name,
            phone: profile.phone,
          },
        };
      });

      return usersWithRoles;
    },
  });

  // Assign or update role
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      // Check if role exists
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role })
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("تم تحديث الصلاحية بنجاح");
      setRoleDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      console.error("Error assigning role:", error);
      toast.error("حدث خطأ أثناء تحديث الصلاحية");
    },
  });

  // Remove role (make user a regular user with no admin access)
  const removeRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("تم إزالة الصلاحية بنجاح");
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      console.error("Error removing role:", error);
      toast.error("حدث خطأ أثناء إزالة الصلاحية");
    },
  });

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.profile?.phone?.includes(search);
    return matchesSearch;
  });

  const handleEditRole = (user: UserWithRole) => {
    setSelectedUser(user);
    setSelectedRole(user.role || "viewer");
    setRoleDialogOpen(true);
  };

  const handleRemoveRole = (user: UserWithRole) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const isSuperAdmin = currentUserRole === "super_admin";

  return (
    <AdminLayout title="إدارة المستخدمين">
      <Helmet>
        <title>إدارة المستخدمين | لوحة التحكم</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">إدارة المستخدمين والصلاحيات</h1>
            <p className="text-muted-foreground">
              إدارة صلاحيات المستخدمين والوصول للوحة التحكم
            </p>
          </div>
        </div>

        {/* Role Legend */}
        <div className="bg-card rounded-xl border p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            مستويات الصلاحيات
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(roleLabels).map(([role, label]) => (
              <Badge key={role} className={roleColors[role as AppRole]}>
                {label}
              </Badge>
            ))}
            <Badge variant="outline">بدون صلاحية (عميل عادي)</Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث بالاسم أو البريد أو الجوال..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">الجوال</TableHead>
                <TableHead className="text-right">الصلاحية</TableHead>
                <TableHead className="text-right">تاريخ التسجيل</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    لا يوجد مستخدمين
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.profile?.full_name || "غير معروف"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.profile?.phone || "-"}</TableCell>
                    <TableCell>
                      {user.role ? (
                        <Badge className={roleColors[user.role]}>
                          {roleLabels[user.role]}
                        </Badge>
                      ) : (
                        <Badge variant="outline">عميل عادي</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), "dd MMM yyyy", { locale: ar })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {/* Can't edit own role or super_admin if not super_admin */}
                        {user.id !== currentUser?.id && (isSuperAdmin || user.role !== "super_admin") && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditRole(user)}
                              title="تعديل الصلاحية"
                            >
                              <UserCog className="h-4 w-4" />
                            </Button>
                            {user.role && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveRole(user)}
                                className="text-destructive hover:text-destructive"
                                title="إزالة الصلاحية"
                              >
                                <ShieldX className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                        {user.id === currentUser?.id && (
                          <span className="text-xs text-muted-foreground">أنت</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Role Dialog */}
        <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل صلاحية المستخدم</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">المستخدم</Label>
                <p className="font-medium">{selectedUser?.profile?.full_name || selectedUser?.email}</p>
              </div>
              <div className="space-y-2">
                <Label>الصلاحية</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as AppRole)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {isSuperAdmin && (
                      <SelectItem value="super_admin">مدير النظام</SelectItem>
                    )}
                    <SelectItem value="admin">مدير</SelectItem>
                    <SelectItem value="content_manager">مدير المحتوى</SelectItem>
                    <SelectItem value="finance_manager">مدير التمويل</SelectItem>
                    <SelectItem value="viewer">مشاهد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (selectedUser) {
                      assignRoleMutation.mutate({
                        userId: selectedUser.id,
                        role: selectedRole,
                      });
                    }
                  }}
                  disabled={assignRoleMutation.isPending}
                >
                  {assignRoleMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>إزالة صلاحية المستخدم</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من إزالة صلاحية "{selectedUser?.profile?.full_name || selectedUser?.email}"؟
                <br />
                سيتم تحويل المستخدم إلى عميل عادي بدون وصول للوحة التحكم.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => {
                  if (selectedUser) {
                    removeRoleMutation.mutate(selectedUser.id);
                  }
                }}
              >
                إزالة الصلاحية
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
