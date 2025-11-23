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
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
  Tag,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  fetchProductsApi,
  deleteProductApi,
  fetchVariantsApi,
  deleteVariantApi,
  fetchCategoriesApi,
} from "@/services/network";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  excerpt?: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  category: { _id: string; name: string } | string;
  brand?: string;
  SKU: string;
  variants?: Variant[];
}

interface Variant {
  _id: string;
  SKU: string;
  price: number;
  discountPrice?: number;
  stock: number;
  attributes?: { key: string; value: string }[];
  image?: string;
}

export default function ProductsPage() {
  // STATE
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Variant Modal
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantLoading, setVariantLoading] = useState(false);
  const [variantError, setVariantError] = useState("");

  // ----------------------------------------------------------------------
  // FETCH CATEGORIES
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCategoriesApi();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  // ----------------------------------------------------------------------
  // FETCH PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const params = [];
      if (search) params.push(`search=${search}`);
      if (category && category !== "all") params.push(`category=${category}`);
      if (brand) params.push(`brand=${brand}`);
      if (minPrice) params.push(`minPrice=${minPrice}`);
      if (maxPrice) params.push(`maxPrice=${maxPrice}`);

      const query = params.length ? `?${params.join("&")}` : "";

      const data = await fetchProductsApi(query);
      setProducts(data.products || []);
    } catch {
      setError("Failed to fetch products.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, brand, minPrice, maxPrice]);

  // ----------------------------------------------------------------------
  // DELETE PRODUCT
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProductApi(id);
      fetchProducts();
    } catch {
      setError("Failed to delete product.");
    }
  };

  // ----------------------------------------------------------------------
  // OPEN VARIANT MODAL
  const openVariantModal = async (product: Product) => {
    setVariantModalOpen(true);
    setVariantProduct(product);
    setVariantLoading(true);
    setVariantError("");

    try {
      const res = await fetchVariantsApi(product._id);
      setVariants(res.variants || []);
    } catch {
      setVariantError("Failed to load variants.");
    }

    setVariantLoading(false);
  };

  // DELETE VARIANT
  const handleDeleteVariant = async (variantId: string) => {
    if (!variantProduct) return;
    if (!confirm("Delete this variant?")) return;

    try {
      await deleteVariantApi(variantId, variantProduct._id);
      openVariantModal(variantProduct);
    } catch {
      setVariantError("Failed to delete variant.");
    }
  };

  const resetFilters = () => {
    setCategory("all");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog, inventory, and variants.
          </p>
        </div>
        <Link href="/products/create">
          <Button className="shadow-lg">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search title, SKU, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Mobile Filter Sheet */}
              <div className="md:hidden w-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Refine product list</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select
                          value={category}
                          onValueChange={(val) => setCategory(val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((c) => (
                              <SelectItem key={c._id} value={c._id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Brand</label>
                        <Input
                          placeholder="Brand"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Min Price
                          </label>
                          <Input
                            placeholder="0"
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Max Price
                          </label>
                          <Input
                            placeholder="1000"
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={resetFilters}
                        className="mt-4"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:flex gap-2 items-center">
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val)}
                >
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-[120px] bg-background"
                />

                {(category !== "all" || brand || minPrice || maxPrice) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetFilters}
                    title="Reset Filters"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
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
                        Product
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Category
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Brand
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Stock
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {products.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 rounded-lg border">
                              <AvatarImage
                                src={p.images?.[0]}
                                className="object-cover"
                              />
                              <AvatarFallback className="rounded-lg">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium line-clamp-1">
                                {p.title}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {p.SKU}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            <Layers className="mr-1 h-3 w-3" />
                            {typeof p.category === "object"
                              ? p.category.name
                              : p.category}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Tag className="mr-1 h-3 w-3" />
                            {p.brand || "-"}
                          </div>
                        </td>
                        <td className="p-4 align-middle font-semibold">
                          ₹{p.price}
                        </td>
                        <td className="p-4 align-middle">
                          <div
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                              p.stock > 10
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : p.stock > 0
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {p.stock} in stock
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
                              <Link href={`/products/${p._id}`}>
                                <DropdownMenuItem>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Product
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => openVariantModal(p)}
                              >
                                <Layers className="mr-2 h-4 w-4" />
                                Manage Variants
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(p._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>

        {/* ------------------------------------------------ */}
        {/* VARIANT MODAL  */}
        {/* ------------------------------------------------ */}
        <Dialog open={variantModalOpen} onOpenChange={setVariantModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Variants for {variantProduct?.title || ""}
              </DialogTitle>
            </DialogHeader>

            {variantError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{variantError}</AlertDescription>
              </Alert>
            )}

            {variantLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left font-medium">SKU</th>
                      <th className="p-3 text-left font-medium">Price</th>
                      <th className="p-3 text-left font-medium">Stock</th>
                      <th className="p-3 text-left font-medium">Attributes</th>
                      <th className="p-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {variants.map((v) => (
                      <tr key={v._id} className="border-t">
                        <td className="p-3 font-mono text-xs">{v.SKU}</td>
                        <td className="p-3">₹{v.price}</td>
                        <td className="p-3">{v.stock}</td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {v.attributes
                            ?.map((a) => `${a.key}: ${a.value}`)
                            .join(", ") || "-"}
                        </td>

                        <td className="p-3 text-right flex justify-end gap-2">
                          <Link href={`/products/variant/${v._id}`}>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <Pencil size={14} />
                            </Button>
                          </Link>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteVariant(v._id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {variants.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          No variants found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end mt-4">
              {variantProduct && (
                <Link href={`/products/${variantProduct._id}/variant/create`}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Variant
                  </Button>
                </Link>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
