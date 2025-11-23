"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  ChevronLeft,
  Trash2,
  Plus,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import {
  fetchVariantByIdApi,
  updateVariantApi,
  uploadImageApi,
} from "@/services/network";
import { toast } from "sonner";

export default function EditVariantPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchVariantByIdApi(id as string);
        const variant = data.variant;
        setForm({
          SKU: variant.SKU || "",
          price: variant.price,
          discountPrice: variant.discountPrice || "",
          stock: variant.stock,
          image: variant.image || "",
          attributes: variant.attributes || [],
        });
      } catch (err: any) {
        setError("Failed to fetch variant");
      }
      setLoading(false);
    })();
  }, [id]);

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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

  const handleAttributeChange = (index: number, key: string, value: string) => {
    const updatedAttributes = form.attributes.map((attr: any, i: number) =>
      i === index ? { ...attr, [key]: value } : attr
    );
    setForm({ ...form, attributes: updatedAttributes });
  };

  const handleAddAttribute = () => {
    setForm({
      ...form,
      attributes: [...form.attributes, { key: "", value: "" }],
    });
  };

  const handleRemoveAttribute = (index: number) => {
    setForm({
      ...form,
      attributes: form.attributes.filter((_: any, i: number) => i !== index),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice)
          : undefined,
        stock: Number(form.stock),
      };
      await updateVariantApi(id as string, payload);
      toast.success("Variant updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update variant");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto mt-8">
        <AlertDescription>{error || "Variant not found"}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1000px] mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Variant</h1>
          <p className="text-muted-foreground">Update variant details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Image Upload */}
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
                <Label htmlFor="SKU">SKU</Label>
                <Input
                  id="SKU"
                  name="SKU"
                  placeholder="SKU"
                  value={form.SKU}
                  onChange={handleInput}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
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

          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {form.attributes.map((attr: any, index: number) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Key"
                        value={attr.key}
                        onChange={(e) =>
                          handleAttributeChange(index, "key", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Value"
                        value={attr.value}
                        onChange={(e) =>
                          handleAttributeChange(index, "value", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveAttribute(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddAttribute}
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
              {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}{" "}
              Update Variant
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
