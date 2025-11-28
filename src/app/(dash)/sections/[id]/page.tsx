"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchSectionByIdApi,
  updateSectionApi,
  fetchProductsApi,
  fetchCategoriesApi,
} from "@/services/network";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EditSectionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sectionData, categoriesData] = await Promise.all([
          fetchSectionByIdApi(id),
          fetchCategoriesApi(),
        ]);

        setFormData({
          title: sectionData.title,
          slug: sectionData.slug,
          displayOrder: sectionData.displayOrder,
          isActive: sectionData.isActive,
        });
        setSelectedProducts(sectionData.products || []);
        setCategories(categoriesData.categories || []);

        // Initial product load
        const productsData = await fetchProductsApi("?limit=20&page=1");
        setSearchResults(productsData.products || []);
        setTotalPages(productsData.totalPages || 1);
      } catch (err) {
        setError("Failed to load section details.");
      }
      setLoading(false);
    };

    if (id) {
      loadData();
    }
  }, [id]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const searchProducts = async () => {
      try {
        let query = `?limit=20&page=${page}`;
        if (searchQuery) query += `&search=${searchQuery}`;
        if (selectedCategory && selectedCategory !== "all")
          query += `&category=${selectedCategory}`;

        const data = await fetchProductsApi(query);
        setSearchResults(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Failed to search products", error);
      }
    };

    const timeoutId = setTimeout(() => {
      searchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, page]);

  const handleAddProduct = (product: any) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSectionApi(id, {
        ...formData,
        products: selectedProducts.map((p) => p._id),
      });
      router.push("/sections");
    } catch (err) {
      setError("Failed to update section.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Section</h1>
          <p className="text-muted-foreground">
            Update section details and manage products.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable this section on the storefront.
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Selected Products ({selectedProducts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {selectedProducts.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="grid gap-1.5 leading-none">
                          <p className="text-sm font-medium leading-none">
                            {product.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            SKU: {product.SKU} | Price: ${product.price}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleRemoveProduct(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {selectedProducts.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        No products selected.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-[300px] pr-4 border rounded-md p-2">
                  <div className="space-y-2">
                    {searchResults.map((product) => {
                      const isSelected = selectedProducts.some(
                        (p) => p._id === product._id
                      );
                      return (
                        <div
                          key={product._id}
                          className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors"
                        >
                          <div className="grid gap-1 leading-none">
                            <p className="text-sm font-medium">
                              {product.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.SKU}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={isSelected ? "secondary" : "default"}
                            disabled={isSelected}
                            type="button"
                            onClick={() => handleAddProduct(product)}
                          >
                            {isSelected ? (
                              "Added"
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                    {searchResults.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        No products found.
                      </p>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" size="lg" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
