"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Search, Filter, MoreVertical, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const orders = [
    { id: "ORD-7281", customer: "John Doe", course: "React.js Complete Guide", amount: "$129", status: "Completed", date: "May 12, 2026" },
    { id: "ORD-7282", customer: "Sarah Smith", course: "UI/UX Design Basics", amount: "$99", status: "Processing", date: "May 11, 2026" },
    { id: "ORD-7283", customer: "Mike Ross", course: "Node.js & Express", amount: "$119", status: "Completed", date: "May 10, 2026" },
    { id: "ORD-7284", customer: "Emma Watson", course: "JavaScript Essentials", amount: "$89", status: "Refunded", date: "May 09, 2026" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage student purchases</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 h-11 px-6 shadow-lg shadow-blue-600/20">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="px-6 py-5 flex items-center justify-between border-b gap-4">
            <h3 className="font-bold text-lg">Recent Orders</h3>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-xl gap-2 h-10 px-4 border-gray-100">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-none">
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold text-gray-400 tracking-wider">Order ID</TableHead>
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold text-gray-400 tracking-wider">Customer</TableHead>
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold text-gray-400 tracking-wider">Course</TableHead>
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold text-gray-400 tracking-wider">Amount</TableHead>
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold text-gray-400 tracking-wider">Status</TableHead>
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold text-gray-400 tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                    <TableCell className="px-6 py-4 font-bold text-blue-600">{order.id}</TableCell>
                    <TableCell className="px-6 py-4 font-semibold text-gray-900">{order.customer}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 font-medium">{order.course}</TableCell>
                    <TableCell className="px-6 py-4 font-bold text-gray-900">{order.amount}</TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={cn(
                        "rounded-lg px-2.5 py-0.5 border-none shadow-none text-[10px] font-bold",
                        order.status === "Completed" ? "bg-emerald-50 text-emerald-600" : 
                        order.status === "Processing" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                      )}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
