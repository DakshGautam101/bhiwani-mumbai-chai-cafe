"use client";

import React, { useContext, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeProvider } from "./theme-provider.js";
import { Button } from "@/components/ui/button";
import { FaCartShopping } from "react-icons/fa6";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserContext } from "@/context/UserContext";
import { AdminContext } from "@/context/AdminContext.js";
import { ModeToggle } from "./theme-btn.js";
import { usePathname, useRouter } from "next/navigation";
import LoadingBar from "react-top-loading-bar";
import { FaRegUserCircle } from "react-icons/fa";
import Image from "next/image.js";
import UniversalLoader from "./UniversalLoader.js";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import UserDialog from "./UserDialog.js";
import { Circle, Settings } from "lucide-react";
import useCartStore from "@/app/store/cartStore";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const loadingBarRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useContext(UserContext);
  const { admin } = useContext(AdminContext);
  const { cart } = useCartStore();

  useEffect(() => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
      const timer = setTimeout(() => {
        loadingBarRef.current.complete();
        setLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleRouteChange = (href) => (e) => {
    e.preventDefault();
    setLoading(true);
    router.push(href);
  };

  return (
    <ThemeProvider>
      <LoadingBar color="#ff8c00" height={4} ref={loadingBarRef} />
      {loading && <UniversalLoader />}
      <nav className="p-4 bg-background/50 sticky top-0 backdrop-blur border-b z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            href="/"
            onClick={handleRouteChange("/")}
            className="hover:scale-106 text-orange-400 text-lg font-bold transition-transform duration-100"
          >
            <Image
              src="/resources/logo.png"
              alt="Logo"
              width={80}
              height={15}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            {["Home", "About", "Menu", "Help"].map((item) => {
              const link = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              return (
                <Link
                  key={item}
                  href={link}
                  onClick={handleRouteChange(link)}
                  className="hover:scale-105 hover:text-orange-400 hover:font-semibold transition-transform duration-300"
                >
                  {item}
                </Link>
              );
            })}

            <div className="flex items-center gap-4 ">

              <Button
                variant="outline"
                className="mx-1 hover:bg-orange-400 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  if (!user) setOpenDialog(true);
                  else router.push("/cart");
                }}
              >
                <div className="relative">
                  <FaCartShopping className="text-xl" />
                  {cart.length > 0 && (
                    <div className="absolute -top-2  -right-2 flex items-center justify-center">
                      <span className="absolute inline-flex h-5 w-5 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                      <span className="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs font-semibold">
                        {cart.length}
                      </span>
                    </div>
                  )}
                </div>
              </Button>

              {admin ? (
                <Button
                  variant="outline"
                  className="mx-1 p-3 flex items-center gap-2 hover:bg-orange-400"
                  onClick={handleRouteChange("/admin")}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden md:inline">Admin Dashboard</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="mx-1 p-4 w-3 rounded-full hover:scale-105"
                >
                  <Link
                    href={user ? "/auth/profile" : "/auth"}
                    onClick={handleRouteChange(user ? "/auth/profile" : "/auth")}
                  >
                    {user?.avatar ? (
                      <Avatar>
                        <AvatarImage
                          src={user.avatar}
                          alt="avatar"
                          width={100}
                          height={100}
                          className="rounded-full"
                        />
                      </Avatar>
                    ) : (
                      <FaRegUserCircle />
                    )}
                  </Link>
                </Button>
              )}

              <ModeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-bold my-4">
                    BhiwaniMumbaiChaiCafe
                  </SheetTitle>
                  <SheetDescription>
                    <div className="flex flex-col gap-6">
                      {["Home", "About", "Menu", "Help"].map((item) => {
                        const link = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                        return (
                          <Link
                            key={item}
                            href={link}
                            onClick={handleRouteChange(link)}
                            className="hover:text-orange-400"
                          >
                            {item}
                          </Link>
                        );
                      })}

                      {admin && (
                        <Link
                          href="/admin"
                          onClick={handleRouteChange("/admin")}
                          className="hover:text-orange-400"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button className="text-xs" variant="outline">
                          <Link
                            href="/cart"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!user) setOpenDialog(true);
                              else router.push("/cart");
                            }}
                          >
                            <FaCartShopping />
                          </Link>
                        </Button>

                        {!admin && (
                          <Button className="text-xs" variant="outline">
                            <Link
                              href={user ? "/auth/profile" : "/auth"}
                              onClick={handleRouteChange(user ? "/auth/profile" : "/auth")}
                            >
                              {user?.avatar ? (
                                <Avatar>
                                  <AvatarImage
                                    src={user.avatar}
                                    alt="avatar"
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                  />
                                </Avatar>
                              ) : (
                                <FaRegUserCircle />
                              )}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <UserDialog open={openDialog} setOpen={setOpenDialog} />
    </ThemeProvider>
  );
};

export default Navbar;
