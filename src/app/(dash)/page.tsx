"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  BarChart2,
  ShoppingCart,
  Users,
  Package,
  CreditCard,
  Percent,
  TrendingUp,
  Activity,
  DollarSign,
  FileText,
} from "lucide-react";
import UserImage from "@/components/user/userImage";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardPage() {
  // Dummy Data for Charts
  const revenueData = [
    { month: "Jan", revenue: 45000, loanValue: 32000 },
    { month: "Feb", revenue: 52000, loanValue: 38000 },
    { month: "Mar", revenue: 48000, loanValue: 35000 },
    { month: "Apr", revenue: 61000, loanValue: 45000 },
    { month: "May", revenue: 55000, loanValue: 41000 },
    { month: "Jun", revenue: 67000, loanValue: 52000 },
  ];

  const loanStatusData = [
    { name: "Approved", value: 65, color: "#22c55e" },
    { name: "Pending", value: 25, color: "#f59e0b" },
    { name: "Rejected", value: 10, color: "#ef4444" },
  ];

  const recentLoans = [
    {
      id: "LN-2024-001",
      user: "Alice Johnson",
      amount: "₹12,500",
      product: "Gold Necklace",
      status: "Approved",
      date: "2024-06-15",
    },
    {
      id: "LN-2024-002",
      user: "Bob Smith",
      amount: "₹45,000",
      product: "Diamond Ring",
      status: "Pending",
      date: "2024-06-14",
    },
    {
      id: "LN-2024-003",
      user: "Charlie Brown",
      amount: "₹8,200",
      product: "Silver Bracelet",
      status: "Rejected",
      date: "2024-06-13",
    },
    {
      id: "LN-2024-004",
      user: "Diana Prince",
      amount: "₹22,000",
      product: "Gold Earrings",
      status: "Approved",
      date: "2024-06-12",
    },
  ];

  return (
    <div className="p-4 space-y-6 min-h-screen max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <UserImage />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Overview of your store and loan performance.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/products/create">
            <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Add Product
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3,28,000</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">Total value: ₹12.5L</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Loan Approval Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+4% from last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-1 lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue vs Loan Disbursal</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="month"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Total Revenue"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="loanValue"
                    name="Loan Value"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Loan Status Chart */}
        <Card className="col-span-1 lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Loan Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={loanStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {loanStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Loan Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.user}</TableCell>
                    <TableCell>{loan.product}</TableCell>
                    <TableCell>{loan.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          loan.status === "Approved"
                            ? "default" // Using default (usually primary color) for approved, or could use custom class
                            : loan.status === "Pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          loan.status === "Approved"
                            ? "bg-green-500 hover:bg-green-600"
                            : loan.status === "Pending"
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : ""
                        }
                      >
                        {loan.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/orders" className="block">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <ShoppingCart className="h-8 w-8 mb-2 text-blue-500" />
                  <span className="font-medium">View Orders</span>
                </div>
              </Link>
              <Link href="/products" className="block">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <Package className="h-8 w-8 mb-2 text-orange-500" />
                  <span className="font-medium">Manage Products</span>
                </div>
              </Link>
              <Link href="/users" className="block">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <Users className="h-8 w-8 mb-2 text-purple-500" />
                  <span className="font-medium">Manage Users</span>
                </div>
              </Link>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <FileText className="h-8 w-8 mb-2 text-green-500" />
                <span className="font-medium">Loan Reports</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
