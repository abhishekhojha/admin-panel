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
import { Loader2, Upload, Link as LinkIcon, Type, Layers } from "lucide-react";
import { toast } from "sonner";
import { uploadImageApi, fetchCategoriesApi } from "@/services/network";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    description: "",
    image: "",
    parent: "",
    status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name || "",
        slug: editingCategory.slug || "",
        description: editingCategory.description || "",
        image: editingCategory.image || "",
        parent: editingCategory.parent?._id || editingCategory.parent || "root",
        status: editingCategory.status || "active",
      });
    } else {
      setForm({
        name: "",
        slug: "",
        description: "",
        image: "",
        parent: "root",
        status: "active",
      });
    }

    // Fetch parent categories
    (async () => {
      try {
        const data = await fetchCategoriesApi();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      }
    })();
  }, [editingCategory, open]);

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
      formData.append("folder", "categories");
      formData.append("convertToWebp", "true");

      const result = await uploadImageApi(formData);
      setForm((prev) => ({ ...prev, image: result.data.secure_url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
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
            ...form,
            parent: form.parent === "root" ? null : form.parent, // Handle empty parent
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
          setError(err.message);
          throw err;
        }
      })(),
      {
        loading: editingCategory
          ? "Updating category..."
          : "Creating category...",
        success: editingCategory
          ? "Category updated successfully"
          : "Category created successfully",
        error: "Failed to save category",
      }
    );
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingCategory ? "Edit Category" : "Create New Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-8 mt-4">
          {/* Left Column: Image */}
          {/* <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-muted rounded-lg">
                <AvatarImage
                  src={form.image}
                  className="object-cover rounded-lg"
                />
                <AvatarFallback className="text-4xl bg-muted rounded-lg">
                  {form.name?.charAt(0).toUpperCase() || <Layers size={48} />}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="cat-image-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer"
              >
                <Upload size={24} />
              </label>
              <input
                id="cat-image-upload"
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
                {form.name || "New Category"}
              </h3>
            </div>
          </div> */}

          {/* Right Column: Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <Type className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Category Name"
                  className="pl-9"
                  value={form.name}
                  onChange={handleInput}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="relative">
                <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="slug"
                  name="slug"
                  placeholder="category-slug"
                  className="pl-9"
                  value={form.slug}
                  onChange={handleInput}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category</Label>
              <Select
                value={form.parent}
                onValueChange={(val) => handleSelectChange("parent", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (Top Level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">None (Top Level)</SelectItem>
                  {categories
                    .filter((c) => c._id !== editingCategory?._id) // Prevent self-parenting
                    .map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) => handleSelectChange("status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Short description"
                value={form.description}
                onChange={handleInput}
              />
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
            {editingCategory ? "Save Changes" : "Create Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
