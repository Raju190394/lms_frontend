"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export default function AuthProvider({ children }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/users/me");
        if (data.success) {
          setUser(data.data);
        } else {
          localStorage.removeItem("accessToken");
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        localStorage.removeItem("accessToken");
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
