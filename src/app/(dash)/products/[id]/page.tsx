"use client";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Type,
  Heading4,
  Upload,
  X,
} from "lucide-react";
import {
  fetchProductByIdApi,
  updateProductApi,
  fetchCategoriesApi,
  uploadImageApi,
} from "@/services/network";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";

export default function EditProductPage() {
  const { id } = useParams();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<any>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProductByIdApi(id as string);
        const product = data.product;
        setForm({ 
            title: product.title,
            brand: product.brand || "",
            category: product.category._id,
            price: product.price,
            discountPrice: product.discountPrice || "",
            stock: product.stock,
            excerpt: product.excerpt || "",
            images: product.images || [],
            description: product.description || "",
         });
        // Set editor content for rich text
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = product.description || "";
          }
        }, 0);
      } catch (err: any) {
        setError("Failed to fetch product");
      }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetchCategoriesApi();
        setCategories(res.categories || []);
      } catch (err) {
        toast.error("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("convertToWebp", "true");
      formData.append("folder", "products");
      const response = await uploadImageApi(formData);
      const imageUrl = response.data.secure_url;
      setForm({
        ...form,
        images: [
          ...form.images,
          { url: imageUrl, isPrimary: form.images.length === 0 },
        ],
      });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.error || "Failed to upload image");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    setForm({
      ...form,
      images: [
        ...form.images,
        { url: imageUrl, isPrimary: form.images.length === 0 },
      ],
    });
    setImageUrl("");
    toast.success("Image URL added");
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = form.images.filter(
      (_: any, i: number) => i !== index
    );
    if (form.images[index].isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    setForm({ ...form, images: updatedImages });
  };

  const handleSetPrimaryImage = (index: number) => {
    const updatedImages = form.images.map((img: any, i: number) => ({
      ...img,
      isPrimary: i === index,
    }));
    setForm({ ...form, images: updatedImages });
  };

  const toggleFormat = (command: string, value?: string) => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;
    if (command === "formatBlock" && value) {
      let node = selection.anchorNode;
      if (node?.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
      }
      const blockElements = ["H2", "H3", "H4", "H5", "H6", "P", "DIV"];
      let currentBlock = (node as Element)?.closest(blockElements.join(","));
      if (currentBlock?.tagName === value.toUpperCase()) {
        document.execCommand("formatBlock", false, "p");
        return;
      }
    }
    if (value) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const description = editorRef.current?.innerHTML || "";
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice)
          : undefined,
        stock: Number(form.stock),
        description,
      };
      await updateProductApi(id as string, payload);
      toast.success("Product updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
    }
    setSaving(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (!form) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto mt-8">
        <AlertDescription>{error || "Product not found"}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mx-auto mt-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
        <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleInput}
          />
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleInput}
          />
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(value) => setForm({ ...form, category: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleInput}
          />
          <Label htmlFor="discountPrice">Discount Price</Label>
          <Input
            id="discountPrice"
            name="discountPrice"
            type="number"
            placeholder="Discount Price"
            value={form.discountPrice}
            onChange={handleInput}
          />
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleInput}
          />
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={handleInput}
            rows={3}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Or paste image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddImageUrl()}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImageUrl}
                >
                  Add
                </Button>
              </div>
              {form.images?.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {form.images.map((img: any, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-[230px] object-cover rounded border"
                      />
                      {img.isPrimary && (
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(index)}
                          className="absolute top-1 left-1 bg-gray-500 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <div className="border rounded">
              <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggleFormat("bold");
                  }}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggleFormat("italic");
                  }}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggleFormat("underline");
                  }}
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggleFormat("strikethrough");
                  }}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>
                <div className="w-px h-8 bg-gray-300 mx-1" />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggleFormat("formatBlock", "p");
                  }}
                >
                  <Type className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggleFormat("formatBlock", "h2");
                  }}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggleFormat("formatBlock", "h3");
                  }}
                >
                  <Heading3 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggleFormat("formatBlock", "h4");
                  }}
                >
                  <Heading4 className="h-4 w-4" />
                </Button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                className="px-3 py-2 min-h-[200px] text-sm bg-white focus:outline-none editor max-h-70 overflow-y-auto"
                suppressContentEditableWarning
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button className="w-full" disabled={saving} onClick={handleSave}>
            {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Update
            Product
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
