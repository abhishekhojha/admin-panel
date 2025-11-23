"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Heading4,
  Type,
  Upload,
  X,
  Image as ImageIcon,
  ChevronLeft,
  Plus,
} from "lucide-react";
import {
  createProductApi,
  uploadImageApi,
  fetchCategoriesApi,
} from "@/services/network";
import { toast } from "sonner";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function CreateProductPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    price: "",
    discountPrice: "",
    stock: "",
    images: [] as { url: string; isPrimary: boolean }[],
    category: "",
    brand: "",
    variants: [],
    attributes: [],
  });
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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
    const updatedImages = form.images.filter((_, i) => i !== index);
    if (form.images[index].isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    setForm({ ...form, images: updatedImages });
  };

  const handleSetPrimaryImage = (index: number) => {
    const updatedImages = form.images.map((img, i) => ({
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
      await createProductApi(payload);
      toast.success("Product created successfully");
      window.location.href = "/products";
    } catch (err: any) {
      setError(err.message || "Failed to create product");
      toast.error(err.message || "Failed to create product");
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
          <p className="text-muted-foreground">
            Add a new product to your catalog.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Product Title"
                  value={form.title}
                  onChange={handleInput}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    placeholder="Brand Name"
                    value={form.brand}
                    onChange={handleInput}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm({ ...form, category: value })
                    }
                  >
                    <SelectTrigger>
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
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Short summary of the product"
                  value={form.excerpt}
                  onChange={handleInput}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <div className="border rounded-md overflow-hidden">
                  <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
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
                      variant="ghost"
                      className="h-8 w-8 p-0"
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
                      variant="ghost"
                      className="h-8 w-8 p-0"
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
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        toggleFormat("strikethrough");
                      }}
                    >
                      <Strikethrough className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
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
                      variant="ghost"
                      className="h-8 w-8 p-0"
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
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        toggleFormat("formatBlock", "h3");
                      }}
                    >
                      <Heading3 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div
                    ref={editorRef}
                    contentEditable
                    className="p-4 min-h-[200px] text-sm focus:outline-none prose prose-sm max-w-none dark:prose-invert"
                    suppressContentEditableWarning
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddImageUrl()
                        }
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleAddImageUrl}
                      >
                        Add URL
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground px-2">
                      OR
                    </span>
                  </div>
                  <div className="flex-1">
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
                      className="w-full border-dashed"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload from Device
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {form.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {form.images.map((img, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border bg-background aspect-square"
                      >
                        <img
                          src={img.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!img.isPrimary && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-7 text-xs"
                              onClick={() => handleSetPrimaryImage(index)}
                            >
                              Set Primary
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {img.isPrimary && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg bg-muted/30">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No images added yet
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pricing & Inventory */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Base Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={form.price}
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="discountPrice"
                    name="discountPrice"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={form.discountPrice}
                    onChange={handleInput}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={handleInput}
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={saving}
              className="w-full"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Product
            </Button>
            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
