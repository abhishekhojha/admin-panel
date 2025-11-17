import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Truck, BadgeCheck, XCircle, Clock } from "lucide-react";
import Link from "next/link";

const dummyOrders = [
	{
		id: "ORD-1001",
		user: "John Doe",
		total: "₹2,500",
		status: "pending",
		payment: "COD",
		shipping: "Express",
		date: "2025-11-17",
	},
	{
		id: "ORD-1002",
		user: "Priya Singh",
		total: "₹1,200",
		status: "shipped",
		payment: "Card",
		shipping: "Standard",
		date: "2025-11-16",
	},
	{
		id: "ORD-1003",
		user: "Alex Kim",
		total: "₹3,800",
		status: "delivered",
		payment: "UPI",
		shipping: "Express",
		date: "2025-11-15",
	},
	{
		id: "ORD-1004",
		user: "Sara Lee",
		total: "₹950",
		status: "cancelled",
		payment: "Card",
		shipping: "Standard",
		date: "2025-11-14",
	},
];

function statusIcon(status: string) {
	switch (status) {
		case "pending": return <Clock className="text-yellow-500" size={18} />;
		case "shipped": return <Truck className="text-blue-500" size={18} />;
		case "delivered": return <BadgeCheck className="text-green-500" size={18} />;
		case "cancelled": return <XCircle className="text-red-500" size={18} />;
		default: return null;
	}
}

export default function OrderPage() {
	return (
		<div className="p-4 space-y-6 min-h-screen">
			<div className="flex items-center gap-4 mb-4">
				<ShoppingCart className="text-green-600" size={32} />
				<div>
					<div className="text-2xl font-bold text-blue-700">Orders Overview</div>
					<div className="text-sm text-gray-500">Track and manage all your store orders here.</div>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="shadow-md hover:shadow-lg transition-all">
					<CardHeader>
						<CardTitle>Total Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<Label className="text-4xl font-bold text-blue-700">{dummyOrders.length}</Label>
						<div className="text-xs text-gray-500 mt-1">This week</div>
					</CardContent>
				</Card>
				<Card className="shadow-md hover:shadow-lg transition-all">
					<CardHeader>
						<CardTitle>Pending</CardTitle>
					</CardHeader>
					<CardContent>
						<Label className="text-4xl font-bold text-yellow-600">1</Label>
						<div className="text-xs text-gray-500 mt-1">Awaiting processing</div>
					</CardContent>
				</Card>
				<Card className="shadow-md hover:shadow-lg transition-all">
					<CardHeader>
						<CardTitle>Shipped</CardTitle>
					</CardHeader>
					<CardContent>
						<Label className="text-4xl font-bold text-blue-600">1</Label>
						<div className="text-xs text-gray-500 mt-1">On the way</div>
					</CardContent>
				</Card>
				<Card className="shadow-md hover:shadow-lg transition-all">
					<CardHeader>
						<CardTitle>Delivered</CardTitle>
					</CardHeader>
					<CardContent>
						<Label className="text-4xl font-bold text-green-600">1</Label>
						<div className="text-xs text-gray-500 mt-1">Completed</div>
					</CardContent>
				</Card>
			</div>
			<Card className="mt-8 shadow-md">
				<CardHeader>
					<CardTitle>Recent Orders</CardTitle>
				</CardHeader>
				<CardContent>
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
								{dummyOrders.map((order) => (
									<tr key={order.id} className="border-b hover:bg-gray-50 transition">
										<td className="p-2 font-mono text-xs">{order.id}</td>
										<td className="p-2">{order.user}</td>
										<td className="p-2">{order.total}</td>
										<td className="p-2 flex items-center gap-2">
											{statusIcon(order.status)}
											<span className="capitalize text-xs font-semibold">{order.status}</span>
										</td>
										<td className="p-2 text-xs">{order.payment}</td>
										<td className="p-2 text-xs">{order.shipping}</td>
										<td className="p-2 text-xs">{order.date}</td>
										<td className="p-2">
											<Link href={`/order/${order.id}`} className="text-blue-600 hover:underline text-xs font-medium">View</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
