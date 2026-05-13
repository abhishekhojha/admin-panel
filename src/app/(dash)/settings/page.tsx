"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { fetchSettingsApi, updateSettingsApi } from "@/services/network";

export default function SettingsPage() {
  const [form, setForm] = useState({
    taxRate: 0.18,
    shippingThreshold: 1000,
    defaultShippingCost: 100,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchSettingsApi();
        if (res.setting) {
          setForm({
            taxRate: res.setting.taxRate,
            shippingThreshold: res.setting.shippingThreshold,
            defaultShippingCost: res.setting.defaultShippingCost,
          });
        }
      } catch (err: any) {
        toast.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      await updateSettingsApi(form);
      toast.success("Settings updated successfully");
    } catch (err: any) {
      setError(err.error || "Failed to update settings");
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Global Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax & Financials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tax Rate (Decimal, e.g. 0.18 for 18%)</label>
              <Input
                type="number"
                step="0.01"
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Free Shipping Threshold (₹)</label>
              <Input
                type="number"
                value={form.shippingThreshold}
                onChange={(e) => setForm({ ...form, shippingThreshold: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">Orders above this amount will have ₹0 shipping cost.</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Default Shipping Cost (₹)</label>
              <Input
                type="number"
                value={form.defaultShippingCost}
                onChange={(e) => setForm({ ...form, defaultShippingCost: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">Applied to orders below the threshold.</p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
