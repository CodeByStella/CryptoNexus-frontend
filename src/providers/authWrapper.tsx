// app/AuthWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { login, logout } from "@/store/slices/authSlice";
import axios from "axios";

// Add public routes that don't require authentication
const PUBLIC_ROUTES = ['/Login', '/Register', '/About'];

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      const token = localStorage.getItem("token");
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      
      if (!token) {
        dispatch(logout());
        // Only redirect to login if not on a public route
        if (!isPublicRoute) {
          router.push("/Login");
        }
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userProfile = response.data;
        dispatch(login(userProfile));
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        dispatch(logout());
        localStorage.removeItem("token");
        // Only redirect to login if not on a public route
        if (!isPublicRoute) {
          router.push("/Login");
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [dispatch, router, pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthWrapper;