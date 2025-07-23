import React from "react";
import Navbar from './components/navbar';
import menu from "./menu/page";
import about from "./about/page";
import HeroSection from './components/hero-section';
import CafeItemsSection from "./components/cafe-items";
import Footer from "./components/footer";
import VisitUs from "./components/VisitUs";
import WhyChooseUs from "./components/whyChooseUs";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import { Toaster } from "react-hot-toast";
import CategoryCarousel from "./components/category-carousel";


export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel/>
      <WhyChooseUs />
      <VisitUs />
      <CafeItemsSection />
      <TestimonialsCarousel/>
      <Footer />
      <Toaster />
    </div>
  );
}
