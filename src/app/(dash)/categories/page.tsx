"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Trash2,
  Pencil,
  Plus,
  MoreHorizontal,
  Layers,
  Link as LinkIcon,
} from "lucide-react";
import CategoryDialog from "./CategoryDialog";
import {
  fetchCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "@/services/network";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage product categories and hierarchy.
          </p>
        </div>
        <Button onClick={openCreateDialog} className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" /> Create Category
        </Button>
      </div>

      <CategoryDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        editingCategory={editingCategory}
        onSuccess={fetchCategories}
        createCategoryApi={createCategoryApi}
        updateCategoryApi={updateCategoryApi}
      />

      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
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
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="rounded-md border bg-background">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Slug
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Parent
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {categories.map((cat) => (
                      <tr
                        key={cat._id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 rounded-lg border">
                              <AvatarImage
                                src={cat.image}
                                className="object-cover"
                              />
                              <AvatarFallback className="rounded-lg">
                                {cat.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{cat.name}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded w-fit">
                            <LinkIcon className="mr-1 h-3 w-3" />
                            {cat.slug}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {cat.parent ? (
                            <div className="flex items-center text-sm">
                              <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                              {cat.parent.name}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Top Level
                            </span>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <div
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                              cat.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {cat.status}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => openEditDialog(cat)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(cat._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
