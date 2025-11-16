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
import { fetchCategoriesApi } from "@/services/network";

interface CategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingCategory: any;
  onSuccess: () => void;
  createCategoryApi: (payload: any) => Promise<any>;
  updateCategoryApi: (id: string, payload: any) => Promise<any>;
}

export default function CategoryDialog({
  open,
  setOpen,
  editingCategory,
  onSuccess,
  createCategoryApi,
  updateCategoryApi,
}: CategoryDialogProps) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    parent: "",
    description: "",
    image: "",
    status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [parentOptions, setParentOptions] = useState<any[]>([]);

  useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name || "",
        slug: editingCategory.slug || "",
        parent: editingCategory.parent?._id || "",
        description: editingCategory.description || "",
        image: editingCategory.image || "",
        status: editingCategory.status || "active",
      });
    } else {
      setForm({
        name: "",
        slug: "",
        parent: "",
        description: "",
        image: "",
        status: "active",
      });
    }
    // Fetch parent category options
    (async () => {
      try {
        const data = await fetchCategoriesApi();
        setParentOptions(data.categories || []);
      } catch {
        setParentOptions([]);
      }
    })();
  }, [editingCategory]);

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        parent: form.parent || null,
        description: form.description,
        image: form.image,
        status: form.status,
      };
      let res;
      if (editingCategory) {
        res = await updateCategoryApi(editingCategory._id, payload);
      } else {
        res = await createCategoryApi(payload);
      }
      if (res?.message && !res?.category) throw new Error(res.message);
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response.data.message || err.message || "An error occurred");
    } finally {
        setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Input
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={handleInput}
          />
          <Input
            name="slug"
            placeholder="Slug (e.g. electronics)"
            value={form.slug}
            onChange={handleInput}
          />
          <select
            name="parent"
            value={form.parent}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">No Parent</option>
            {parentOptions
              .filter(
                (cat) => !editingCategory || cat._id !== editingCategory._id
              )
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
          <Input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleInput}
          />
          {/* <Input
            name="image"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={handleInput}
          /> */}
          <select
            name="status"
            value={form.status}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
            {editingCategory ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
