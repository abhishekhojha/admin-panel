"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Upload,
  X,
  Plus,
  Trash2,
  ChevronLeft,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  uploadImageApi,
  createVariantApi,
  fetchProductByIdApi,
} from "@/services/network";
import Link from "next/link";

export default function CreateVariantPage() {
  const { id } = useParams() as { id: string };
  const productId = id;
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<any>(null);

  const [form, setForm] = useState({
    price: "",
    discountPrice: "",
    stock: "",
    image: "",
    attributes: [] as { key: string; value: string }[],
    SKU: "",
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");

  // ------------------ FETCH PRODUCT ---------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchProductByIdApi(productId);
        setProduct(res.product);
      } catch {
        toast.error("Failed to fetch product");
      }
    })();
  }, [productId]);

  // ------------------ IMAGE UPLOAD ----------------------
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("convertToWebp", "true");
      fd.append("folder", "variants");

      const res = await uploadImageApi(fd);
      const imageUrl = res.data.secure_url;

      setForm({ ...form, image: imageUrl });

      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.error || "Failed to upload image");
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setForm({ ...form, image: imageUrlInput });
    toast.success("Image URL added");
    setImageUrlInput("");
  };

  // ------------------ ATTRIBUTE HANDLERS ----------------------
  const addAttribute = () => {
    setForm({
      ...form,
      attributes: [...form.attributes, { key: "", value: "" }],
    });
  };

  const updateAttribute = (
    i: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...form.attributes];
    updated[i][field] = value;
    setForm({ ...form, attributes: updated });
  };

  const removeAttribute = (i: number) => {
    const updated = form.attributes.filter((_, idx) => idx !== i);
    setForm({ ...form, attributes: updated });
  };

  // ------------------ SAVE VARIANT ----------------------
  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const payload = {
        price: Number(form.price),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice)
          : undefined,
        stock: Number(form.stock),
        attributes: form.attributes,
        image: form.image || undefined,
        SKU: form.SKU,
      };

      await createVariantApi(productId, payload);

      toast.success("Variant created");
      router.push(`/products/${productId}`);
    } catch (err: any) {
      setError(err.error || "Failed to create variant");
    }

    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1000px] mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Variant</h1>
          <p className="text-muted-foreground">
            Adding variant for{" "}
            <span className="font-semibold text-foreground">
              {product?.title}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Image */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Variant Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {form.image ? (
                  <div className="relative group rounded-lg overflow-hidden border bg-background aspect-square">
                    <img
                      src={form.image}
                      alt="Variant Image"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setForm({ ...form, image: "" })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg bg-muted/30 aspect-square">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No image</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste image URL"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddImageUrl()
                      }
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddImageUrl}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">OR</span>
                  </div>
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
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Variant Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="SKU">SKU (Optional)</Label>
                <Input
                  id="SKU"
                  placeholder="SKU"
                  value={form.SKU}
                  onChange={(e) => setForm({ ...form, SKU: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
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
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      value={form.discountPrice}
                      onChange={(e) =>
                        setForm({ ...form, discountPrice: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Define attributes like Size, Color, Material, etc.
                </p>

                {form.attributes.map((attr, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Key (e.g. Size)"
                        value={attr.key}
                        onChange={(e) =>
                          updateAttribute(i, "key", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Value (e.g. Medium)"
                        value={attr.value}
                        onChange={(e) =>
                          updateAttribute(i, "value", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeAttribute(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addAttribute}
                  className="w-full border-dashed"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Attribute
                </Button>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Variant
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
