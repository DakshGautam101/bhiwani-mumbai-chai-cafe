"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    ArrowRight,
    Star,
    Flame,
    TrendingUp,
    Eye,
} from "lucide-react";
import { useState } from "react";
import UniversalLoader from "./UniversalLoader";
import { Router } from "next/router";
const CafeItemsClient = ({ items }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };
    const [loading, setLoading] = useState(false)
    const handleRouteChange = (href) => (e) => {
        e.preventDefault();
        setLoading(true);
        router.push(href);
    };
    return (

        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
            {/* Background Decorations */}
            {loading &&
                <UniversalLoader />
            }
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/20 dark:bg-orange-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-200/20 dark:bg-yellow-600/10 rounded-full blur-3xl" />

                {/* Floating Elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-20 right-10 text-6xl opacity-10"
                >
                    ☕
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-20 left-10 text-6xl opacity-10"
                >
                    🍰
                </motion.div>
            </div>

            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-800 mb-4"
                    >
                        <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-semibold text-orange-900 dark:text-orange-200">
                            Popular Picks
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
                        <span className="text-gray-900 dark:text-white">Our Top </span>
                        <span className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                            Cafe Items
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover our handpicked selection of bestsellers and customer favorites
                    </p>
                </motion.div>

                {/* Items Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            className="group relative"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-red-500/0 to-orange-500/0 group-hover:from-orange-500/20 group-hover:via-red-500/20 group-hover:to-orange-500/20 rounded-2xl blur-xl transition-all duration-300 -z-10" />

                            <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 dark:border-gray-700 group-hover:border-orange-300 dark:group-hover:border-orange-700">
                                {/* Image Container */}
                                <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <motion.img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                    />

                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        {index < 3 && (
                                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                <span className="text-xs font-bold">Trending</span>
                                            </Badge>
                                        )}
                                        {index === 0 && (
                                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 border-0 shadow-lg flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="text-xs font-bold">Best Seller</span>
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Quick View Button */}
                                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <Link
                                            href={`/cafe/${item.slug}`}
                                            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-semibold"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Quick View
                                        </Link>
                                    </div>

                                    {/* Rating (if available) */}
                                    {item.rating && (
                                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {item.rating}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                                        {item.description}
                                    </p>

                                    {/* Price (if available) */}
                                    {item.price && (
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                                                    ₹{item.price}
                                                </span>
                                                {item.originalPrice && item.originalPrice > item.price && (
                                                    <span className="text-sm text-gray-500 line-through">
                                                        ₹{item.originalPrice}
                                                    </span>
                                                )}
                                            </div>
                                            {item.discount && (
                                                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">
                                                    {item.discount}% OFF
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {/* Tags (if available) */}
                                    {item.tags && item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href={`/cafe/${item.slug}`}
                                            className={`${buttonVariants({ variant: "outline" })} w-full group/btn relative overflow-hidden border-2 border-orange-500 text-orange-600 dark:text-orange-400 hover:text-white font-semibold transition-all duration-300`}
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                                            <span onClick={(e)=>{
                                                e.preventDefault();
                                                setLoading(true);
                                                Router.push(`/cafe/${item.slug}`);
                                            }} className="relative flex items-center justify-center gap-2">
                                                Read More
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </span>
                                        </Link>

                                        <Link href="/menu" className="w-full">
                                            <Button onClick={(e)=>{
                                                e.preventDefault();
                                                setLoading(true);
                                                Router.push(`/menu`);
                                            }} 
                                                variant="default"
                                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Add to Cart
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Decorative Corner */}
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-tl-full" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <Link href="/menu">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
                        >
                            <span className="flex items-center gap-2">
                                View Full Menu
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>

    );
};

export default CafeItemsClient;