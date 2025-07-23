"use client";
import React, { useState, useEffect, useRef } from "react";
import Typed from "typed.js";
import SearchElement from "./SearchElement";

const HeroSection = () => {
  const typedElement = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: [
        "Chatpata Mumbai Flavors!",
        "Tandoori Tadka, Street Style!",
        "Spicy, Crispy, Full Tandoor!"
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
    });

    return () => typed.destroy();
  }, []);


  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4">
      <main className="flex flex-col-reverse lg:flex-row items-center justify-between max-w-6xl w-full">
        <div className="text-center lg:text-left lg:w-1/2">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
            Embark on a Culinary Journey
            <br />
            Where Every Bite is a Masterpiece
            <br />
            <span className="text-orange-400 text-3xl" ref={typedElement}></span>
          </h1>
          <p className="text-lg font-medium leading-relaxed mb-6">
            Where Each Plate Weaves a Story of Culinary Mastery and Passionate Craftsmanship.
          </p>
          <SearchElement/>
        </div>
        <div className="w-full max-w-xs sm:max-w-md lg:w-1/2 flex justify-center mb-8 lg:mb-0">
          <img
            className="w-full h-auto object-cover rounded-full border-4 border-white shadow-lg"
            src="https://media.geeksforgeeks.org/wp-content/uploads/20240910124734/restaurant-app-imag.jpeg"
            alt="Delicious Food"
          />
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
