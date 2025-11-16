
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";

export default function DashboardPage() {
	return (
		<div className="p-6 space-y-6">
			<Breadcrumb>
				<BreadcrumbItem>Dashboard</BreadcrumbItem>
			</Breadcrumb>
			<div className="flex items-center gap-4">
				<Avatar>
					<img src="/avatars/shadcn.jpg" alt="User" className="w-12 h-12 rounded-full object-cover" />
				</Avatar>
				<div>
					<div className="text-xl font-bold">Welcome back, Admin!</div>
					<div className="text-sm text-gray-500">Here's a quick overview of your store.</div>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Products</CardTitle>
					</CardHeader>
					<CardContent>
						<Label className="text-3xl font-bold">128</Label>
						<div className="text-xs text-gray-500 mt-1">Total products</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<Label className="text-3xl font-bold">54</Label>
						<div className="text-xs text-gray-500 mt-1">Pending orders</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Users</CardTitle>
					</CardHeader>
					<CardContent>
						<Label className="text-3xl font-bold">1,024</Label>
						<div className="text-xs text-gray-500 mt-1">Registered users</div>
					</CardContent>
				</Card>
			</div>
			<div className="mt-8">
				<Card>
					<CardHeader>
						<CardTitle>Quick Links</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex gap-4">
							<a href="#" className="text-blue-600 hover:underline">Add Product</a>
							<a href="#" className="text-blue-600 hover:underline">View Orders</a>
							<a href="#" className="text-blue-600 hover:underline">Manage Users</a>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
