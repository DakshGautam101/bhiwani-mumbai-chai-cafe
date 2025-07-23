"use client";

import React from "react";
import { FaCheckCircle, FaCameraRetro } from "react-icons/fa";

const WhyChooseUs = () => {
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">🎉 Why Choose Bhiwani Mumbai Chai Café?</h2>
        <p className="text-lg  mb-6">Highlighting what makes us special!</p>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left ">
          <div className="flex items-center gap-3 p-4 rounded-lg shadow-md border">
            <FaCheckCircle className="text-green-500 text-2xl" />
            <p className="text-lg font-medium">Authentic Mumbai flavors, made fresh daily</p>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg shadow-md border">
            <FaCheckCircle className="text-green-500 text-2xl" />
            <p className="text-lg font-medium">High-quality ingredients, no artificial flavors</p>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg shadow-md border">
            <FaCameraRetro className="text-pink-500 text-2xl" />
            <p className="text-lg font-medium">Cozy ambiance & Insta-worthy interiors 📸</p>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg shadow-md border">
            <FaCheckCircle className="text-green-500 text-2xl" />
            <p className="text-lg font-medium">Affordable pricing with generous portions</p>
          </div>
        </div>

        {/* Closing Statement */}
        <p className="mt-6 text-xl font-semibold">
          💡 Your go-to spot for chai lovers and street food enthusiasts!
        </p>
      </div>
    </section>
  );
};

export default WhyChooseUs;
