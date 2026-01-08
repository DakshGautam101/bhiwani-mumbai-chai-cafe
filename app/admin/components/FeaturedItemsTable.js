"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FeaturedItems() {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch("/api/featured-items");
                const data = await res.json();
                if (data.success) setFeaturedItems(data.data);
            } catch (err) {
                console.error("Failed to fetch featured items", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    if (loading) return <p className="text-center">Loading Featured Items...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Featured Items</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredItems.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border rounded-lg shadow-md hover:shadow-xl bg-white p-4 cursor-pointer"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-md"
                        />
                        <h2 className="text-lg font-semibold mt-3">{item.name}</h2>
                        <p className="text-gray-600 line-through text-sm">
                            ₹{item.price}
                        </p>
                        <p className="text-green-600 font-bold text-xl">
                            ₹{item.price - (item.price * item.featured[0]?.discount) / 100}
                        </p>
                        <p className="text-xs text-gray-500">
                            {item.featured[0]?.heading || "Best Offer"}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
