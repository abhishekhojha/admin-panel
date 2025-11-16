"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      setForm({ email: "", phone: "", name: "", avatar: "", role: "", isActive: true, isProfileCompleted: false });
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
  }, [editingUser]);

  const handleInput = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'avatars');
      formData.append('convertToWebp', 'true');
      
      const result = await uploadImageApi(formData);
      console.log({result});
      
      setForm({ ...form, avatar: result.data.secure_url });
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
      setSelectedFile(null);
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
        success: editingUser ? "User updated successfully" : "User created successfully",
        error: "Failed to save user",
      }
    );
    setSaving(false);
  };

  // Assign role handler (can be used in dialog or inline)
  const handleAssignRole = async () => {
    if (!editingUser || !form.role) return;
    setSaving(true);
    setError("");
    await toast.promise(
      (async () => {
        try {
          const res = await assignRoleApi(editingUser._id, form.role);
          if (res?.message && !res?.user) throw new Error(res.message);
          setOpen(false);
          onSuccess();
        } catch (err: any) {
          setError(err.message);
          throw err;
        }
      })(),
      {
        loading: "Assigning role...",
        success: "Role assigned successfully",
        error: "Failed to assign role",
      }
    );
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInput}
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleInput}
          />
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInput}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Avatar</label>
            <Input
              name="avatar"
              placeholder="Avatar URL (optional)"
              value={form.avatar}
              onChange={handleInput}
            />
            <div className="text-center text-sm text-gray-500">OR</div>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                disabled={!selectedFile || uploading}
                onClick={() => selectedFile && handleFileUpload(selectedFile)}
                className="flex items-center gap-1"
              >
                {uploading && <Loader2 className="h-3 w-3 animate-spin" />}
                Upload
              </Button>
            </div>
            {form.avatar && (
              <div className="flex justify-center">
                <img
                  src={form.avatar}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full object-cover border"
                />
              </div>
            )}
          </div>
          <select
            name="role"
            value={form.role}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Select Role</option>
            {roleOptions.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleInput}
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isProfileCompleted"
                checked={form.isProfileCompleted}
                onChange={handleInput}
              />
              Profile Completed
            </label>
          </div>
          {editingUser && (
            <Button
              className="w-full flex items-center justify-center"
              disabled={saving || !form.role}
              onClick={handleAssignRole}
              variant="outline"
            >
              Assign Role
            </Button>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            className="w-full flex items-center justify-center"
            disabled={saving}
            onClick={handleSave}
          >
            {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {editingUser ? "Update User" : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
