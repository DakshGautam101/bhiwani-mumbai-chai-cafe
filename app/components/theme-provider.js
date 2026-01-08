"use client";
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { UserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { AdminContext } from "@/context/AdminContext";
import { cartContext } from "@/context/CartContext";
import { itemContext } from "@/context/itemContext";
import { orderContext } from "@/context/orderContext";

export function ThemeProvider({ children, ...props }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const  [cart, setCart] = useState([]);
  const [item, setItem] = useState(null);
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Verify token is still valid by making a profile request
          const response = await axiosInstance.get("/api/auth/profile");

          setUser({
            ...response.data.user,
            token,
          });
          setAdmin(response.data.user.role === 'admin' ? response.data.user : null);
          // console.log("PROFILE RESPONSE: ", response.data);

        } catch (error) {
          console.error("Error verifying token:", error);
          // Clear invalid token
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  return (
    <NextThemesProvider {...props}>
      <orderContext.Provider value={{order, setOrder}}>
      <AdminContext.Provider value={{admin, setAdmin}}>
      <UserContext.Provider value={{ user, setUser, isLoading }}>
        <cartContext.Provider value={{ cart, setCart }}>
          <itemContext.Provider value={{ item, setItem }}>
            {children}
          </itemContext.Provider>
        </cartContext.Provider>
      </UserContext.Provider>
        </AdminContext.Provider>
        </orderContext.Provider>
    </NextThemesProvider>
  );
}
