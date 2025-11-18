"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { fetchVariantByIdApi, updateVariantApi } from "@/services/network";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";

export default function EditVariantPage() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
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
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
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
    <Card className="mx-auto mt-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Variant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Label htmlFor="SKU">SKU</Label>
          <Input
            id="SKU"
            name="SKU"
            placeholder="SKU"
            value={form.SKU}
            onChange={handleInput}
          />
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
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleInput}
          />
          <div>
            <Label>Attributes</Label>
            <div className="space-y-2">
              {form.attributes.map((attr: any, index: number) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Key"
                    value={attr.key}
                    onChange={e => handleAttributeChange(index, "key", e.target.value)}
                  />
                  <Input
                    placeholder="Value"
                    value={attr.value}
                    onChange={e => handleAttributeChange(index, "value", e.target.value)}
                  />
                  <Button type="button" variant="destructive" onClick={() => handleRemoveAttribute(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddAttribute}>
                Add Attribute
              </Button>
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button className="w-full" disabled={saving} onClick={handleSave}>
            {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Update Variant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
