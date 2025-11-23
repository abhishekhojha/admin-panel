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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, FileText, Check } from "lucide-react";
import { fetchPermissionsApi } from "@/services/network";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
  }, [editingRole, open]);

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

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePermission = (perm: string) => {
    setForm((prev) => {
      const exists = prev.permissions.includes(perm);
      if (exists) {
        return {
          ...prev,
          permissions: prev.permissions.filter((p) => p !== perm),
        };
      } else {
        return { ...prev, permissions: [...prev.permissions, perm] };
      }
    });
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            {editingRole ? "Edit Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Manager, Editor"
              value={form.name}
              onChange={handleInput}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Brief description of the role"
              value={form.description}
              onChange={handleInput}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Permissions</Label>
              <Badge variant="outline" className="text-xs font-normal">
                {form.permissions.length} selected
              </Badge>
            </div>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allPermissions.map((perm) => (
                  <div
                    key={perm}
                    className="flex items-start space-x-2 rounded-md border p-2 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`perm-${perm}`}
                      checked={form.permissions.includes(perm)}
                      onCheckedChange={() => togglePermission(perm)}
                    />
                    <label
                      htmlFor={`perm-${perm}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                    >
                      {perm}
                    </label>
                  </div>
                ))}
                {allPermissions.length === 0 && (
                  <div className="col-span-2 text-center text-sm text-muted-foreground py-8">
                    No permissions available
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {editingRole ? "Save Changes" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
