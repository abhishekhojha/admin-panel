"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Upload,
  X,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

import { uploadImageApi, createVariantApi, fetchProductByIdApi } from "@/services/network";

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

  const updateAttribute = (i: number, field: "key" | "value", value: string) => {
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
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock: Number(form.stock),
        attributes: form.attributes,
        image: form.image || undefined,
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
    <Card className="mx-auto mt-4 max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Add Variant {product ? `for: ${product.title}` : ""}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <Input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <Input
            placeholder="Discount Price"
            type="number"
            value={form.discountPrice}
            onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
          />

          <Input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">Variant Image</label>

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
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddImageUrl()}
                />
                <Button variant="outline" onClick={handleAddImageUrl}>
                  Add
                </Button>
              </div>

              {form.image && (
                <div className="relative group w-32 h-32">
                  <img
                    src={form.image}
                    alt="Variant Image"
                    className="w-full h-full object-cover rounded border"
                  />

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ATTRIBUTES */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Attributes (e.g., Size: M, Color: Red)
            </label>

            {form.attributes.map((attr, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  placeholder="Key"
                  value={attr.key}
                  onChange={(e) => updateAttribute(i, "key", e.target.value)}
                />
                <Input
                  placeholder="Value"
                  value={attr.value}
                  onChange={(e) => updateAttribute(i, "value", e.target.value)}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeAttribute(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={addAttribute} className="mt-2">
              <Plus className="mr-2 h-4 w-4" /> Add Attribute
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Variant
            </Button>

            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
