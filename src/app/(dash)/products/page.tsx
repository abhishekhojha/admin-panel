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
import { fetchProductsApi, deleteProductApi } from "@/services/network";
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
  variants?: any[];
  attributes?: any[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [role, setRole] = useState("");

  // Fetch categories for dropdown
  useEffect(() => {
    (async () => {
      try {
        const data = await import("@/services/network").then(m => m.fetchCategoriesApi());
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (category) params.push(`category=${encodeURIComponent(category)}`);
      if (brand) params.push(`brand=${encodeURIComponent(brand)}`);
      if (minPrice) params.push(`minPrice=${encodeURIComponent(minPrice)}`);
      if (maxPrice) params.push(`maxPrice=${encodeURIComponent(maxPrice)}`);
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
    // eslint-disable-next-line
  }, [search, category, brand, minPrice, maxPrice]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProductApi(id);
      fetchProducts();
    } catch {
      setError("Failed to delete product.");
    }
  };

  return (
    <Card className="w-full border-0 h-full">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <CardTitle className="text-2xl font-bold">Product Management</CardTitle>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search by title, SKU, brand"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            style={{ minWidth: 180 }}
          />
          {/* Combined Filter Dialog for Products */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Filters</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Product Filters</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-6 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="border rounded px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Brand</label>
                    <Input
                      type="text"
                      placeholder="Brand"
                      value={brand}
                      onChange={e => setBrand(e.target.value)}
                      className="border rounded px-2 py-2 text-sm w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Min Price</label>
                    <Input
                      type="number"
                      placeholder="Min Price"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="border rounded px-2 py-2 text-sm w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Max Price</label>
                    <Input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="border rounded px-2 py-2 text-sm w-full"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setCategory("");
                      setBrand("");
                      setMinPrice("");
                      setMaxPrice("");
                      setRole("");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Link href="/products/create">
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" /> Create Product
            </Button>
          </Link>
        </div>
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
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
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
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-2 font-semibold">{product.title}</td>
                    <td className="p-2 font-mono text-xs">{product.SKU}</td>
                    <td className="p-2 text-xs">
                      {typeof product.category === "object"
                        ? product.category.name
                        : product.category}
                    </td>
                    <td className="p-2 text-xs">{product.brand || "-"}</td>
                    <td className="p-2 text-xs">₹{product.price}</td>
                    <td className="p-2 text-xs">{product.stock}</td>
                    <td className="p-2 flex gap-2">
                        <Link href={`/products/${product._id}`}>
                      <Button size="icon" variant="secondary">
                        <Pencil size={16} />
                      </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-10">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
