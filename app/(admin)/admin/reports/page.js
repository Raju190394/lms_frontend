"use client";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, BookOpen, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const analytics = [
    { label: "Course Completion Rate", value: "78%", change: "+5%", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Student Engagement", value: "85%", change: "+12%", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Revenue", value: "$45,200", change: "+18%", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor platform performance and growth</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl gap-2 h-11 px-6 border-gray-200">
            <Calendar className="h-4 w-4" />
            Select Range
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 h-11 px-6 shadow-lg shadow-blue-600/20">
            <Download className="h-4 w-4" />
            Generate PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analytics.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("p-3 rounded-2xl", stat.bg)}>
                    <Icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} Increase
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Reports Loading</h3>
          <p className="text-gray-500 max-w-sm mb-8">
            We are compiling the latest data from your platform. This usually takes a few seconds.
          </p>
          <div className="flex gap-4">
             <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
             <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]"></div>
             <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
