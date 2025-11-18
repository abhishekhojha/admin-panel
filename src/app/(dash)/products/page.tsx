"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, Pencil, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [category, setCategory] = useState("");
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
      if (category) params.push(`category=${category}`);
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

  // ----------------------------------------------------------------------

  return (
    <Card className="w-full border-0">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Product Management</CardTitle>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search title, SKU, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[180px]"
          />

          {/* FILTERS */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Filters</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border rounded p-2 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <Input
                  placeholder="Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />

                <Input
                  placeholder="Min Price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />

                <Input
                  placeholder="Max Price"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <Button
                variant="secondary"
                onClick={() => {
                  setCategory("");
                  setBrand("");
                  setMinPrice("");
                  setMaxPrice("");
                }}
              >
                Reset Filters
              </Button>
            </DialogContent>
          </Dialog>

          <Link href="/products/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {/* ERROR */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Brand</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-semibold">{p.title}</td>
                    <td className="p-2 text-xs font-mono">{p.SKU}</td>
                    <td className="p-2 text-xs">
                      {typeof p.category === "object"
                        ? p.category.name
                        : p.category}
                    </td>
                    <td className="p-2 text-xs">{p.brand || "-"}</td>
                    <td className="p-2 text-xs">₹{p.price}</td>
                    <td className="p-2 text-xs">{p.stock}</td>

                    <td className="p-2 flex gap-2">
                      <Link href={`/products/${p._id}`}>
                        <Button size="icon" variant="secondary">
                          <Pencil size={16} />
                        </Button>
                      </Link>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(p._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => openVariantModal(p)}
                      >
                        <Plus size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* ------------------------------------------------ */}
      {/* VARIANT MODAL  */}
      {/* ------------------------------------------------ */}
      <Dialog open={variantModalOpen} onOpenChange={setVariantModalOpen}>
        <DialogContent className="max-w-2xl">
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
              <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          ) : (
            <table className="w-full border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Attributes</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {variants.map((v) => (
                  <tr key={v._id} className="border-b">
                    <td className="p-2 text-xs font-mono">{v.SKU}</td>
                    <td className="p-2 text-xs">₹{v.price}</td>
                    <td className="p-2 text-xs">{v.stock}</td>
                    <td className="p-2 text-xs">
                      {v.attributes
                        ?.map((a) => `${a.key}: ${a.value}`)
                        .join(", ") || "-"}
                    </td>

                    <td className="p-2 flex gap-2">
                      <Link href={`/products/variant/${v._id}`}>
                        <Button size="icon" variant="secondary">
                          <Pencil size={16} />
                        </Button>
                      </Link>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteVariant(v._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}

                {variants.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-500 py-8"
                    >
                      No variants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          <div className="flex justify-end mt-4">
            {variantProduct && (
              <Link
                href={`/products/${variantProduct._id}/variant/create`}
              >
                <Button>
                  <Plus className="mr-2" /> Add Variant
                </Button>
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
