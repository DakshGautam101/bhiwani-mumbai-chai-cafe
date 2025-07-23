"use client";

import React from "react";
import { FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { SiSwiggy, SiZomato, SiUber } from "react-icons/si";

const VisitUs = () => {
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">📍 Visit Us or Order Online</h2>
        <p className="text-lg text-gray-700 mb-6">Find us easily or order your favorite dishes online!</p>

        {/* Google Maps Embed */}
        <div className="w-full h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg mb-6">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3496.524594050694!2d76.12840477529537!3d28.793436975577176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391267e5cb1552d1%3A0x43c3eeed36410858!2z4KSu4KWB4KSC4KSs4KSIIOCkmuCkvuCkryDgpJXgpYjgpKvgpYc!5e0!3m2!1shi!2sin!4v1742731397441!5m2!1shi!2sin"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* Order Online Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.zomato.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600 transition-all text-lg font-semibold min-w-[180px]"
          >
            <SiZomato className="text-2xl" /> Order on Zomato
          </a>

          <a
            href="https://www.swiggy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-orange-600 transition-all text-lg font-semibold min-w-[180px]"
          >
            <SiSwiggy className="text-2xl" /> Order on Swiggy
          </a>

          <a
            href="https://www.ubereats.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-full shadow-md hover:bg-gray-800 transition-all text-lg font-semibold min-w-[180px]"
          >
            <SiUber className="text-2xl" /> Order on Uber Eats
          </a>

          <a
            href="https://wa.me/+919910620099"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-all text-lg font-semibold min-w-[180px]"
          >
            <FaWhatsapp className="text-2xl" /> Order on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default VisitUs;
