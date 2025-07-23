'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Counter } from '@/components/ui/counter';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    } 
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { 
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};



const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

const AnimatedStat = ({ value, label }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
   
    <motion.div
      ref={ref}
      className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition-shadow"
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      whileHover={{ y: -5 }}
    >
      <div className="text-4xl font-bold text-orange-500 mb-2">
        <Counter from={0} to={value} duration={1.5} /><span>+</span>
      </div>
      <p className="text-gray-700">{label}</p>
    </motion.div>
  );
};

export default function AboutUsPage() {
  return (
     <>
    <Navbar/>
    <div className="bg-white text-gray-800 overflow-hidden">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-100 to-yellow-50 py-24 px-6 text-center overflow-hidden">
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div 
          className="absolute -bottom-10 -left-10 w-56 h-56 bg-amber-200 rounded-full filter blur-3xl opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
        />
        
        <div className="relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Our Story, Brewed to Perfection <span className="inline-block animate-bounce">☕</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-700"
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            variants={fadeInUp}
          >
            From a humble beginning to a beloved neighborhood cafe — serving smiles, one cup at a time.
          </motion.p>
          <motion.div 
            initial="hidden" 
            animate="visible" 
            transition={{ delay: 0.4 }} 
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 px-8 py-3 rounded-full shadow-lg">
              Visit Us
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedStat value={10} label="Years Brewing Chai" />
          <AnimatedStat value={100} label="Thousand Happy Sips" />
          <AnimatedStat value={25} label="Unique Menu Items" />
        </div>
      </section>

      {/* Popular Food Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center text-orange-600 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Our <span className="underline decoration-wavy decoration-amber-400">Signature</span> Items
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Special Chai', 
                img: '/resources/assets/ukala.jpg',
                desc: 'Aromatic blend of spices brewed to perfection'
              },
              { 
                name: 'Vada Pav', 
                img: '/resources/pavVada.jpg',
                desc: 'Mumbai\'s favorite street food with our twist'
              },
              { 
                name: 'Pav Bhaji', 
                img: '/resources/pav-bhaji.jpeg',
                desc: 'Buttery pav with rich, flavorful bhaji'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group relative bg-white rounded-2xl shadow-xl overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={cardVariants}
                transition={{ delay: i * 0.1 }}
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={500}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-orange-500 font-medium mb-3">{item.desc}</p>
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    Customer Favorite
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Sold Item Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold text-orange-600 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            The <span className="text-amber-500">People's</span> Choice
          </motion.h2>
          <motion.div
            className="bg-gradient-to-br from-orange-50 to-amber-50 p-1 rounded-3xl shadow-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleUp}
          >
            <div className="bg-white p-8 rounded-2xl">
              <motion.div 
                className="relative h-72 w-full mb-8 rounded-xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                src = '/resources/bun.jpeg'                  
                  alt="Special Chai"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <h3 className="text-3xl font-bold text-orange-700 mb-3">Special Chai</h3>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                "Our aromatic, soothing Special Chai is the undisputed champion, loved by all ages. 
                Brewed with a secret blend of spices and served with warmth."
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                  #1 Best Seller
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 w-full h-[200%] bg-gradient-radial from-orange-500/10 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 z-10">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Our <span className="text-amber-400">Artisanal</span> Process
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Sourcing', 
                desc: 'Fresh and premium ingredients from local farms and trusted suppliers.',
                icon: '🌱'
              },
              { 
                title: 'Brewing', 
                desc: 'Crafted with love using both traditional techniques and modern precision.',
                icon: '🔥'
              },
              { 
                title: 'Serving', 
                desc: 'Hot, fresh, and always presented with genuine warmth and care.',
                icon: '🤲'
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-amber-400/30 transition-all"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={cardVariants}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, borderColor: "rgba(251, 191, 36, 0.5)" }}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-amber-400 mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold text-gray-800 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Voices of <span className="text-orange-500">Delight</span>
          </motion.h2>
          <motion.div
            className="bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-3xl shadow-lg border border-orange-100"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleUp}
          >
           <TestimonialsCarousel/>
            
          </motion.div>
        </div>
        
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white animate-pulse"></div>
            <div className="absolute top-2/3 left-2/3 w-48 h-48 rounded-full bg-white animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-white animate-pulse animation-delay-4000"></div>
          </div>
        </div>
        <div className="relative max-w-5xl mx-auto text-center px-4 z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Ready for a <span className="underline decoration-wavy">Chai Experience</span>?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            variants={fadeInUp}
          >
            Visit us today or book a table to experience the magic firsthand.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4 }}
            variants={fadeInUp}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-lg transform transition-all hover:-translate-y-1"
                size="lg"
              >
                Book a Table
              </Button>
              <Button 
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full shadow-lg transform transition-all hover:-translate-y-1"
                size="lg"
                variant="outline"
              >
                <Link href='/menu'>
                View Menu
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
}