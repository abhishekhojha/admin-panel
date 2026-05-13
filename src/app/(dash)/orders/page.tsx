"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Filter,
  MoreHorizontal,
  CreditCard,
  Pencil,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { fetchOrdersApi, deleteOrderApi } from "@/services/network";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import OrderUpdateDialog from "./OrderUpdateDialog";

// Backend enum: PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED | COMPLETED
export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" | "COMPLETED";

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: <Clock size={12} />,
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: <CheckCircle size={12} />,
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    icon: <Truck size={12} />,
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    icon: <Truck size={12} />,
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: <BadgeCheck size={12} />,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: <XCircle size={12} />,
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    icon: <AlertCircle size={12} />,
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: <CheckCircle size={12} />,
  },
};

interface Order {
  _id: string;
  user: { name: string; email: string } | string;
  grandTotal: number;
  status: OrderStatus;
  paymentStatus?: string;
  payment: { method: string };
  shipping: { method: string };
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
}

function statusBadge(status: string) {
  const config = (statusConfig as any)[status] || {
    label: status,
    className: "bg-muted text-muted-foreground",
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalOrders, setTotalOrders] = useState(0);

  // Update dialog state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=10`;
      if (statusFilter !== "all") {
        query += `&status=${statusFilter}`;
      }
      const data = await fetchOrdersApi(query);
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalOrders(data.pagination?.total || 0);
    } catch (err: any) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleOpenUpdateDialog = (order: Order) => {
    setSelectedOrder(order);
    setUpdateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrderApi(id);
      toast.success("Order deleted");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Track and manage all your store orders here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            Total Orders:{" "}
            <span className="font-semibold text-foreground">{totalOrders}</span>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
            <CardTitle>Recent Orders</CardTitle>

            <div className="flex items-center flex-wrap gap-2 w-full xl:w-auto">
              {/* Mobile Filter Sheet */}
              <div className="xl:hidden w-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Filter orders by status</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-4 p-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={statusFilter}
                          onValueChange={(val) => {
                            setStatusFilter(val);
                            setPage(1);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                            <SelectItem value="PROCESSING">Processing</SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="REFUNDED">Refunded</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={resetFilters}
                        className="mt-4"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Filters */}
              <div className="hidden xl:flex flex-wrap gap-2 items-center">
                <Select
                  value={statusFilter}
                  onValueChange={(val) => {
                    setStatusFilter(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>

                {statusFilter !== "all" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetFilters}
                    title="Reset Filters"
                  >
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="rounded-md border bg-background">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Payment</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tracking</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle"><Skeleton className="h-4 w-16" /></td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </td>
                        <td className="p-4 align-middle"><Skeleton className="h-4 w-16" /></td>
                        <td className="p-4 align-middle"><Skeleton className="h-5 w-20 rounded-full" /></td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-3 w-16 rounded-full" />
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </td>
                        <td className="p-4 align-middle"><Skeleton className="h-4 w-20" /></td>
                        <td className="p-4 align-middle text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border bg-background">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Order ID
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Customer
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Total
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Payment
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Tracking
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle font-mono text-xs">
                          {order._id.substring(0, 8)}...
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {typeof order.user === "object"
                                ? order.user.name
                                : "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {typeof order.user === "object"
                                ? order.user.email
                                : ""}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle font-semibold">
                          ₹{order.grandTotal?.toFixed(2)}
                        </td>
                        <td className="p-4 align-middle">
                          {statusBadge(order.status)}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium capitalize">
                              {order.payment?.method || "—"}
                            </span>
                            {order.paymentStatus && (
                              <Badge
                                variant="outline"
                                className="text-[10px] w-fit capitalize"
                              >
                                {order.paymentStatus}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {order.trackingNumber ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-mono font-medium">
                                {order.trackingNumber}
                              </span>
                              {order.carrier && (
                                <span className="text-[10px] text-muted-foreground capitalize">
                                  {order.carrier}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-4 align-middle text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleOpenUpdateDialog(order)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Update Order
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(order._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Update Dialog */}
      <OrderUpdateDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        orderId={selectedOrder?._id || null}
        currentStatus={selectedOrder?.status || "PENDING"}
        currentPaymentStatus={selectedOrder?.paymentStatus}
        onSuccess={fetchOrders}
      />
    </div>
  );
}
