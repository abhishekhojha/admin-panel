"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Upload,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { fetchRolesApi, uploadImageApi } from "@/services/network";

interface UserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingUser: any;
  onSuccess: () => void;
  createUserApi: (payload: any) => Promise<any>;
  updateUserApi: (id: string, payload: any) => Promise<any>;
  assignRoleApi: (id: string, roleId: string) => Promise<any>;
}

export default function UserDialog({
  open,
  setOpen,
  editingUser,
  onSuccess,
  createUserApi,
  updateUserApi,
  assignRoleApi,
}: UserDialogProps) {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    avatar: "",
    role: "",
    isActive: true,
    isProfileCompleted: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [roleOptions, setRoleOptions] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setForm({
        email: editingUser.email || "",
        phone: editingUser.phone || "",
        name: editingUser.name || "",
        avatar: editingUser.avatar || "",
        role: editingUser.role?._id || editingUser.role || "",
        isActive: editingUser.isActive,
        isProfileCompleted: editingUser.isProfileCompleted,
      });
    } else {
      setForm({
        email: "",
        phone: "",
        name: "",
        avatar: "",
        role: "",
        isActive: true,
        isProfileCompleted: false,
      });
    }
    // Fetch role options
    (async () => {
      try {
        const data = await fetchRolesApi();
        setRoleOptions(data.roles || []);
      } catch {
        setRoleOptions([]);
      }
    })();
  }, [editingUser, open]);

  const handleInput = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "avatars");
      formData.append("convertToWebp", "true");

      const result = await uploadImageApi(formData);
      setForm((prev) => ({ ...prev, avatar: result.data.secure_url }));
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    await toast.promise(
      (async () => {
        try {
          const payload = {
            email: form.email,
            phone: form.phone,
            name: form.name,
            avatar: form.avatar,
            role: form.role || null,
            isActive: form.isActive,
            isProfileCompleted: form.isProfileCompleted,
          };
          let res;
          if (editingUser) {
            res = await updateUserApi(editingUser._id, payload);
            // If role changed, call assignRoleApi separately if needed,
            // but usually update api handles it or we do it explicitly.
            // The original code had a separate button for assign role,
            // but for better UX we can try to do it here if the API supports it
            // or keep the logic consistent.
            // Let's stick to the original logic: Update User updates basic info.
            // But wait, the original code had a separate "Assign Role" button.
            // Ideally, saving the user should save the role too.
            // If the backend `updateUserApi` doesn't handle role, we might need to call `assignRoleApi` too.
            // Let's assume we want to do both if role changed.
            if (
              form.role &&
              form.role !== (editingUser.role?._id || editingUser.role)
            ) {
              await assignRoleApi(editingUser._id, form.role);
            }
          } else {
            res = await createUserApi(payload);
          }
          if (res?.message && !res?.user) throw new Error(res.message);
          setOpen(false);
          onSuccess();
        } catch (err: any) {
          setError(err.message);
          throw err;
        }
      })(),
      {
        loading: editingUser ? "Updating user..." : "Creating user...",
        success: editingUser
          ? "User updated successfully"
          : "User created successfully",
        error: "Failed to save user",
      }
    );
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingUser ? "Edit User Profile" : "Create New User"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mt-4">
          {/* Left Column: Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-muted">
                <AvatarImage src={form.avatar} className="object-cover" />
                <AvatarFallback className="text-4xl bg-muted">
                  {form.name?.charAt(0).toUpperCase() || <User size={48} />}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
              >
                <Upload size={24} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </div>
            {uploading && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Uploading...
              </span>
            )}
            <div className="text-center">
              <h3 className="font-medium text-sm text-foreground">
                {form.name || "New User"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {form.role
                  ? roleOptions.find((r) => r._id === form.role)?.name
                  : "No Role"}
              </p>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className="pl-9"
                    value={form.name}
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 234 567 890"
                    className="pl-9"
                    value={form.phone}
                    onChange={handleInput}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-9"
                  value={form.email}
                  onChange={handleInput}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <Shield className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                <Select
                  value={form.role}
                  onValueChange={(val) => handleSelectChange("role", val)}
                >
                  <SelectTrigger className="pl-9">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role._id} value={role._id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  form.isActive
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
                    : "bg-gray-50 dark:bg-gray-900/50"
                }`}
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
              >
                <div className="flex items-center gap-2">
                  {form.isActive ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium">Active</span>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={form.isActive}
                  readOnly
                />
              </div>

              <div
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  form.isProfileCompleted
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900"
                    : "bg-gray-50 dark:bg-gray-900/50"
                }`}
                onClick={() =>
                  setForm({
                    ...form,
                    isProfileCompleted: !form.isProfileCompleted,
                  })
                }
              >
                <div className="flex items-center gap-2">
                  {form.isProfileCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium">Profile Complete</span>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={form.isProfileCompleted}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || uploading}>
            {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {editingUser ? "Save Changes" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
