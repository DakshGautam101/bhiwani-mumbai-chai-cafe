"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";


const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


function FeaturedItems() {
  return (
    <div className="mb-12">
      {/* Heading */}
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="text-3xl md:text-4xl font-bold text-center mb-10 
                   text-gray-900 dark:text-white"
      >
        🌟 Featured <span className="text-orange-500">Items</span>
      </motion.h2>

      {/* Sections */}
      <div className="flex flex-col gap-12">
        {featuredData.map((section, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="space-y-6"
          >
            {/* Section Heading */}
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {section.heading}
            </h3>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {section.items.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl 
                             transition rounded-2xl overflow-hidden border 
                             border-gray-200 dark:border-gray-700 relative"
                >
                  {/* Discount Badge */}
                  <span className="absolute top-3 right-3 bg-red-500 text-white 
                                   text-xs px-2 py-1 rounded-lg shadow">
                    {item.discount} OFF
                  </span>

                  {/* Product Image */}
                  <div className="h-44 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 
                                 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex flex-col gap-2">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500 font-bold text-lg">
                        ₹{item.price}
                      </span>
                      <span className="line-through text-gray-400 text-sm">
                        ₹{item.oldPrice}
                      </span>
                    </div>
                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 
                                 text-white rounded-lg mt-2 flex items-center 
                                 justify-center gap-2"
                    >
                      <ShoppingCart size={18} /> Add to Cart
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedItems;
