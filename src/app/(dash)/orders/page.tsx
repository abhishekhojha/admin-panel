"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Truck,
  BadgeCheck,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchOrdersApi,
  updateOrderStatusApi,
  deleteOrderApi,
} from "@/services/network";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Order {
  _id: string;
  user: { name: string; email: string } | string;
  grandTotal: number;
  status: string;
  payment: { method: string };
  shipping: { method: string };
  createdAt: string;
}

function statusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="text-yellow-500" size={18} />;
    case "processing":
      return <Clock className="text-orange-500" size={18} />;
    case "shipped":
      return <Truck className="text-blue-500" size={18} />;
    case "delivered":
      return <BadgeCheck className="text-green-500" size={18} />;
    case "cancelled":
      return <XCircle className="text-red-500" size={18} />;
    default:
      return null;
  }
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=10`;
      if (statusFilter !== "all") {
        query += `&status=${statusFilter}`;
      }
      const data = await fetchOrdersApi(query);
      setOrders(data.orders);
      setTotalPages(data.pagination.pages);
      setTotalOrders(data.pagination.total);
    } catch (err: any) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatusApi(id, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrderApi(id);
      fetchOrders();
    } catch (err) {
      alert("Failed to delete order");
    }
  };

  return (
    <div className="p-4 space-y-6 min-h-screen">
      <div className="flex items-center gap-4 mb-4">
        <ShoppingCart className="text-green-600" size={32} />
        <div>
          <div className="text-2xl font-bold text-blue-700">
            Orders Overview
          </div>
          <div className="text-sm text-gray-500">
            Track and manage all your store orders here.
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">Total Orders: {totalOrders}</div>
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="mt-4 shadow-md">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Order ID</th>
                    <th className="p-2">Customer</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Payment</th>
                    <th className="p-2">Shipping</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-2 font-mono text-xs">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="p-2 text-sm">
                        {typeof order.user === "object"
                          ? order.user.name
                          : "Unknown"}
                      </td>
                      <td className="p-2 text-sm font-semibold">
                        ₹{order.grandTotal}
                      </td>
                      <td className="p-2">
                        <Select
                          defaultValue={order.status}
                          onValueChange={(val) =>
                            handleStatusUpdate(order._id, val)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs w-[130px]">
                            <div className="flex items-center gap-2">
                              {statusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2 text-xs">{order.payment.method}</td>
                      <td className="p-2 text-xs">{order.shipping.method}</td>
                      <td className="p-2 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2 flex gap-2">
                        <Link href={`/orders/${order._id}`}>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                          >
                            <Eye size={14} />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => handleDelete(order._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft size={16} /> Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
