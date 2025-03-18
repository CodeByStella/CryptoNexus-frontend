// app/AuthWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { login, logout } from "@/store/slices/authSlice";
import axios from "axios";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      const token = localStorage.getItem("token");
      // if (!token) {
      //   dispatch(logout());
      //   router.push("/Login");
      //   setLoading(false);
      //   return;
      // }

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
        // router.push("/Login");
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [dispatch, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthWrapper;