"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BarChart2, ShoppingCart, Users, Package } from "lucide-react";
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
} from "recharts";

export default function DashboardPage() {
  const orderGraphData = [
    { day: "Mon", orders: 12 },
    { day: "Tue", orders: 19 },
    { day: "Wed", orders: 8 },
    { day: "Thu", orders: 15 },
    { day: "Fri", orders: 10 },
    { day: "Sat", orders: 7 },
    { day: "Sun", orders: 14 },
  ];
  return (
    <div className="p-2 space-y-6 min-h-screen">
      <div className="flex items-center gap-4 mb-4">
        <UserImage />
        <div>
          <div className="text-2xl font-bold text-blue-700">Welcome back</div>
          <div className="text-sm text-gray-500">
            Here's a quick overview of your store performance.
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center gap-2">
            <Package className="text-blue-500" size={28} />
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-4xl font-bold text-blue-700">128</Label>
            <div className="text-xs text-gray-500 mt-1">Total products</div>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center gap-2">
            <ShoppingCart className="text-green-500" size={28} />
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-4xl font-bold text-green-700">54</Label>
            <div className="text-xs text-gray-500 mt-1">Pending orders</div>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="text-purple-500" size={28} />
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-4xl font-bold text-purple-700">1,024</Label>
            <div className="text-xs text-gray-500 mt-1">Registered users</div>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart2 className="text-orange-500" size={28} />
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-4xl font-bold text-orange-700">
              ₹2,45,000
            </Label>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-4xl font-bold text-pink-700">4.2%</Label>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-4xl font-bold text-red-700">3</Label>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <Link
                href="/products"
                className="text-blue-600 hover:underline font-medium"
              >
                Product
              </Link>
              <Link
                href="/orders"
                className="text-green-600 hover:underline font-medium"
              >
                Orders
              </Link>
              <Link
                href="/users"
                className="text-purple-600 hover:underline font-medium"
              >
                Manage Users
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Store Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700 mb-2">Recent Activity</div>
            <div className="text-sm text-gray-700 mb-2 font-semibold">
              Top Selling Products
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                Earings{" "}
                <span className="ml-2 text-xs text-gray-500">120 sold</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
                Chains{" "}
                <span className="ml-2 text-xs text-gray-500">98 sold</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Necklace{" "}
                <span className="ml-2 text-xs text-gray-500">87 sold</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Orders This Week</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderGraphData} barSize={35}>
                  <defs>
                    <linearGradient
                      id="blueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#60a5fa"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Bar
                    dataKey="orders"
                    fill="url(#blueGradient)"
                    radius={[10, 10, 4, 4]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
