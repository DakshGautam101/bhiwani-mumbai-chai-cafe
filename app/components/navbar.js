"use client";

import React, { useContext, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeProvider } from "./theme-provider.js";
import { Button } from "@/components/ui/button";
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
import Image from "next/image.js";
import UniversalLoader from "./UniversalLoader.js";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import UserDialog from "./UserDialog.js";
import {
  Settings,
  ShoppingCart,
  User,
  Menu as MenuIcon,
  X,
  Home,
  Info,
  UtensilsCrossed,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import useCartStore from "@/app/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const loadingBarRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useContext(UserContext);
  const { admin } = useContext(AdminContext);
  const { cart } = useCartStore();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setMobileMenuOpen(false);
    router.push(href);
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Menu", href: "/menu", icon: UtensilsCrossed },
    { name: "Help", href: "/help", icon: HelpCircle },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <ThemeProvider>
      <LoadingBar color="#ff8c00" height={3} ref={loadingBarRef} />
      {loading && <UniversalLoader />}

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800"
            : "bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-b border-gray-100 dark:border-gray-800"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              onClick={handleRouteChange("/")}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                  <Image
                    src="/resources/logo.png"
                    alt="Bhiwani Mumbai Chai Cafe Logo"
                    fill
                    sizes="(max-width: 767px) 64px, 80px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    Bhiwani Mumbai
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                    Chai Cafe
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              {/* Nav Links */}
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleRouteChange(item.href)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 group ${
                          active
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{item.name}</span>
                        {active && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-400 rounded-full"
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Cart Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-orange-100 dark:hover:bg-orange-900/30"
                    onClick={(e) => {
                      e.preventDefault();
                      setLoading(true);
                      if (!user) setOpenDialog(true);
                      else router.push("/cart");
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <AnimatePresence>
                      {cart.length > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <span className="flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg">
                            {cart.length}
                          </span>
                          <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                {/* Admin or User Button */}
                {admin ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-md"
                      onClick={handleRouteChange("/admin")}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden lg:inline">Admin</span>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/30"
                      onClick={handleRouteChange(user ? "/auth/profile" : "/auth")}
                    >
                      {user?.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar}
                            alt={user.name || "User avatar"}
                            className="object-cover"
                          />
                        </Avatar>
                      ) : (
                        <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Theme Toggle */}
                <ModeToggle />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ModeToggle />
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {/* Nav Items */}
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={handleRouteChange(item.href)}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          active
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Admin Link */}
                {admin && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                  >
                    <Link
                      href="/admin"
                      onClick={handleRouteChange("/admin")}
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Admin Dashboard</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                )}

                {/* Divider */}
                <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!user) setOpenDialog(true);
                      else router.push("/cart");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart</span>
                    {cart.length > 0 && (
                      <span className="ml-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs font-bold">
                        {cart.length}
                      </span>
                    )}
                  </Button>

                  {!admin && (
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleRouteChange(user ? "/auth/profile" : "/auth")}
                    >
                      {user?.avatar ? (
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user.avatar} alt="User avatar" />
                        </Avatar>
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span>{user ? "Profile" : "Login"}</span>
                    </Button>
                  )}
                </div>

                {/* User Info (if logged in) */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">
                          {user.name || "User"}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-20" />

      <UserDialog open={openDialog} setOpen={setOpenDialog} />
    </ThemeProvider>
  );
};

export default Navbar;