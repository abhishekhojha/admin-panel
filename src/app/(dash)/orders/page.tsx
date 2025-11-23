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
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  fetchOrdersApi,
  updateOrderStatusApi,
  deleteOrderApi,
} from "@/services/network";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

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
      return <Clock className="text-yellow-500" size={16} />;
    case "processing":
      return <Clock className="text-orange-500" size={16} />;
    case "shipped":
      return <Truck className="text-blue-500" size={16} />;
    case "delivered":
      return <BadgeCheck className="text-green-500" size={16} />;
    case "cancelled":
      return <XCircle className="text-red-500" size={16} />;
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

  const resetFilters = () => {
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
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
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              {/* Placeholder for search if needed later, currently just title */}
              <CardTitle>Recent Orders</CardTitle>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Mobile Filter Sheet */}
              <div className="md:hidden w-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Filter orders by status
                      </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-4">
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
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
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
              <div className="hidden md:flex gap-2 items-center">
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
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
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
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
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
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
                          ₹{order.grandTotal}
                        </td>
                        <td className="p-4 align-middle">
                          <Select
                            defaultValue={order.status}
                            onValueChange={(val) =>
                              handleStatusUpdate(order._id, val)
                            }
                          >
                            <SelectTrigger className="h-8 w-[140px] border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-0 focus:ring-offset-0">
                              <div className="flex items-center gap-2">
                                {statusIcon(order.status)}
                                <span className="capitalize text-xs font-semibold">
                                  {order.status}
                                </span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">
                                Processing
                              </SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">
                                Delivered
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium capitalize">
                              {order.payment.method}
                            </span>
                            <span className="text-[10px] text-muted-foreground capitalize">
                              {order.shipping.method}
                            </span>
                          </div>
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
                              <Link href={`/orders/${order._id}`}>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </Link>
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
                          colSpan={7}
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
    </div>
  );
}
