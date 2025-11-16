"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, Pencil, Plus } from "lucide-react";
import CategoryDialog from "./CategoryDialog";
import { fetchCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from "@/services/network";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: { _id: string; name: string; slug: string } | null;
  description?: string;
  image?: string;
  status: "active" | "inactive";
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCategoriesApi();
      setCategories(data.categories || []);
    } catch (err) {
      setError("Failed to fetch categories.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const openEditDialog = (category: any) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategoryApi(id);
      fetchCategories();
    } catch {
      setError("Failed to delete category.");
    }
  };

  return (
    <>
      {/* DIALOG */}
      <CategoryDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        editingCategory={editingCategory}
        onSuccess={fetchCategories}
        createCategoryApi={createCategoryApi}
        updateCategoryApi={updateCategoryApi}
      />

      <Card className="w-full border-0 h-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Category Management</CardTitle>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Create Category
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Name</th>
                    <th className="p-2">Slug</th>
                    <th className="p-2">Parent</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-2 font-mono">{cat.name}</td>
                      <td className="p-2">{cat.slug}</td>
                      <td className="p-2 text-xs text-gray-700">{cat.parent?.name || "-"}</td>
                      <td className="p-2 text-xs font-semibold">
                        <span className={cat.status === "active" ? "text-green-600" : "text-red-600"}>{cat.status}</span>
                      </td>
                      <td className="p-2 flex gap-3">
                        <Button size="icon" variant="secondary" onClick={() => openEditDialog(cat)}>
                          <Pencil size={16} />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => handleDelete(cat._id)}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-10">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
