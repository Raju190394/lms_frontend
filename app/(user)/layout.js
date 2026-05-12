"use client";
import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserLayout({ children }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "USER")) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router, isLoading]);

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated || user?.role !== "USER") return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="USER" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
