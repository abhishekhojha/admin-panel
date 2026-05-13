"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatusApi } from "@/services/network";

interface OrderUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | null;
  currentStatus: string;
  currentPaymentStatus?: string;
  onSuccess: () => void;
}

export default function OrderUpdateDialog({
  open,
  onOpenChange,
  orderId,
  currentStatus,
  currentPaymentStatus,
  onSuccess,
}: OrderUpdateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    status: "",
    paymentStatus: "",
    trackingNumber: "",
    carrier: "",
    estimatedDelivery: "",
    note: "",
    cancellationReason: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        status: currentStatus || "pending",
        paymentStatus: currentPaymentStatus || "",
        trackingNumber: "",
        carrier: "",
        estimatedDelivery: "",
        note: "",
        cancellationReason: "",
      });
    }
  }, [open, currentStatus, currentPaymentStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setLoading(true);

    try {
      const payload: Record<string, any> = {};
      if (form.status) payload.status = form.status;
      if (form.paymentStatus) payload.paymentStatus = form.paymentStatus;
      if (form.trackingNumber) payload.trackingNumber = form.trackingNumber;
      if (form.carrier) payload.carrier = form.carrier;
      if (form.estimatedDelivery)
        payload.estimatedDelivery = new Date(form.estimatedDelivery).toISOString();
      if (form.note) payload.note = form.note;
      if (form.status === "cancelled" && form.cancellationReason)
        payload.cancellationReason = form.cancellationReason;

      await updateOrderStatusApi(orderId, payload);
      toast.success("Order updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Update Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            {/* Order Status */}
            <div className="space-y-2">
              <Label>Order Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) => setForm((f) => ({ ...f, status: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={form.paymentStatus}
                onValueChange={(val) =>
                  setForm((f) => ({ ...f, paymentStatus: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tracking Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                placeholder="e.g. DHL123456"
                value={form.trackingNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, trackingNumber: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                placeholder="e.g. DHL, FedEx"
                value={form.carrier}
                onChange={(e) =>
                  setForm((f) => ({ ...f, carrier: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="space-y-2">
            <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
            <Input
              id="estimatedDelivery"
              type="date"
              value={form.estimatedDelivery}
              onChange={(e) =>
                setForm((f) => ({ ...f, estimatedDelivery: e.target.value }))
              }
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Status Note</Label>
            <Textarea
              id="note"
              placeholder="Add a note for this status change..."
              value={form.note}
              onChange={(e) =>
                setForm((f) => ({ ...f, note: e.target.value }))
              }
              rows={2}
            />
          </div>

          {/* Cancellation Reason (only show when cancelling) */}
          {form.status === "cancelled" && (
            <div className="space-y-2">
              <Label htmlFor="cancellationReason">Cancellation Reason</Label>
              <Textarea
                id="cancellationReason"
                placeholder="Reason for cancellation..."
                value={form.cancellationReason}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cancellationReason: e.target.value }))
                }
                rows={2}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Update Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
