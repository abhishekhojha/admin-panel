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
import { fetchPermissionsApi } from "@/services/network";
import { toast } from "sonner";
// Removed Select import, using custom multi-select below

interface RoleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingRole: any;
  onSuccess: () => void;
  createRoleApi: (payload: any) => Promise<Response>;
  updateRoleApi: (id: string, payload: any) => Promise<Response>;
}
export default function RoleDialog({
  open,
  setOpen,
  editingRole,
  onSuccess,
  createRoleApi,
  updateRoleApi,
}: RoleDialogProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingRole) {
      setForm({
        name: editingRole.name,
        description: editingRole.description || "",
        permissions: editingRole.permissions || [],
      });
    } else {
      setForm({ name: "", description: "", permissions: [] });
    }
  }, [editingRole]);

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePermissionsChange = (values: string[]) => {
    setForm({ ...form, permissions: values });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        permissions: form.permissions,
      };

      let res;

      if (editingRole) {
        res = await updateRoleApi(editingRole._id, payload);
      } else {
        res = await createRoleApi(payload);
      }
      toast.success(`Role ${editingRole ? "updated" : "created"} successfully`);
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      toast.error("Failed to save role");
    }

    setSaving(false);
  };
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await fetchPermissionsApi();

        setAllPermissions(data.permissions || []);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };

    fetchPermissions();
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <Input
            name="name"
            placeholder="Role Name"
            value={form.name}
            onChange={handleInput}
          />

          <Input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleInput}
          />

          <div>
            <div className="mb-1 text-sm font-medium text-gray-700">
              Permissions
            </div>
            <div className="grid grid-cols-2 gap-2">
              {allPermissions.map((perm) => (
                <label key={perm} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={perm}
                    checked={form.permissions.includes(perm)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handlePermissionsChange([...form.permissions, perm]);
                      } else {
                        handlePermissionsChange(
                          form.permissions.filter((p) => p !== perm)
                        );
                      }
                    }}
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>

          <Button
            className="w-full flex items-center justify-center"
            disabled={saving}
            onClick={handleSave}
          >
            {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {editingRole ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
