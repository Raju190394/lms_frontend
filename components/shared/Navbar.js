"use client";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name || "User"}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
          {user?.name?.charAt(0) || "U"}
        </div>
      </div>
    </header>
  );
}
