'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Counter } from '@/components/ui/counter';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Link from 'next/link';
import {
    Award,
    Users,
    Heart,
    Clock,
    MapPin,
    Star,
    Sparkles,
    Coffee,
    ChevronRight,
    Calendar,
} from 'lucide-react';

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
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
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

const AnimatedStat = ({ value, label, icon: Icon }) => {
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
            className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all group overflow-hidden"
            initial="hidden"
            animate={controls}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Sparkles className="w-5 h-5 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 mb-2">
                    <Counter from={0} to={value} duration={2} />
                    <span>+</span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 font-medium">{label}</p>
            </div>

            {/* Decorative corner */}
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-tl-full" />
        </motion.div>
    );
};

export default function AboutUsPage() {
    const stats = [
        { value: 10, label: "Years Brewing Chai", icon: Clock },
        { value: 100, label: "Thousand Happy Customers", icon: Users },
        { value: 25, label: "Unique Menu Items", icon: Coffee },
    ];

    const signatureItems = [
        {
            name: 'Special Chai',
            img: '/resources/assets/ukala.jpg',
            desc: 'Aromatic blend of spices brewed to perfection',
            price: '₹30',
            rating: 4.9,
        },
        {
            name: 'Vada Pav',
            img: '/resources/pavVada.jpg',
            desc: 'Mumbai favorite street food with our twist',
            price: '₹40',
            rating: 4.8,
        },
        {
            name: 'Pav Bhaji',
            img: '/resources/pav-bhaji.jpeg',
            desc: 'Buttery pav with rich, flavorful bhaji',
            price: '₹80',
            rating: 4.9,
        },
    ];

    const processSteps = [
        {
            title: 'Sourcing',
            desc: 'Fresh and premium ingredients from local farms and trusted suppliers.',
            icon: '🌱',
            color: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Brewing',
            desc: 'Crafted with love using both traditional techniques and modern precision.',
            icon: '🔥',
            color: 'from-orange-500 to-red-500'
        },
        {
            title: 'Serving',
            desc: 'Hot, fresh, and always presented with genuine warmth and care.',
            icon: '🤲',
            color: 'from-amber-500 to-orange-500'
        },
    ];

    return (
        <>
            <Navbar />
            <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">

                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-orange-950/20 dark:to-gray-800 py-32 px-6 overflow-hidden">
                    {/* Animated Background Elements */}
                    <motion.div
                        className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-orange-300/30 to-amber-300/30 dark:from-orange-600/20 dark:to-amber-600/20 rounded-full filter blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-yellow-300/30 to-orange-300/30 dark:from-yellow-600/20 dark:to-orange-600/20 rounded-full filter blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -90, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <div className="relative z-10 max-w-5xl mx-auto text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-orange-200 dark:border-orange-800 mb-8 shadow-lg"
                        >
                            <Heart className="w-5 h-5 text-orange-600 dark:text-orange-400 fill-current" />
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                Since 2014
                            </span>
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                        >
                            <span className="block text-gray-900 dark:text-white">
                                Our Story,
                            </span>
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-400 dark:via-amber-400 dark:to-orange-400">
                                Brewed to Perfection
                            </span>
                            <motion.span
                                className="inline-block text-6xl"
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                ☕
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-700 dark:text-gray-300 leading-relaxed"
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                            variants={fadeInUp}
                        >
                            From a humble beginning to a beloved neighborhood cafe —
                            <span className="font-semibold text-orange-600 dark:text-orange-400"> serving smiles, one cup at a time</span>.
                        </motion.p>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Button
                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 rounded-full shadow-xl text-lg font-bold group"
                                size="lg"
                            >
                                <MapPin className="w-5 h-5 mr-2" />
                                Visit Us Today
                                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <Link href="/menu">
                                <Button
                                    variant="outline"
                                    className="border-2 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-8 py-6 rounded-full text-lg font-bold"
                                    size="lg"
                                >
                                    Explore Menu
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                                Our Journey in <span className="text-orange-600 dark:text-orange-400">Numbers</span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                A decade of dedication and delicious memories
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {stats.map((stat, index) => (
                                <AnimatedStat key={index} {...stat} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Signature Items Section */}
                <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-center mb-16"
                        >
                            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-0 px-4 py-2 text-sm font-semibold mb-4">
                                BESTSELLERS
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                                Our <span className="relative inline-block">
                                    <span className="relative z-10">Signature</span>
                                    <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-300/50 dark:bg-amber-600/30 -rotate-1"></span>
                                </span> Items
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Taste the traditions that have made us a neighborhood favorite
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {signatureItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={cardVariants}
                                    transition={{ delay: i * 0.15 }}
                                    whileHover={{ y: -12 }}
                                >
                                    {/* Image */}
                                    <div className="relative h-72 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                        <Image
                                            src={item.img}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                        {/* Rating Badge */}
                                        <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{item.rating}</span>
                                        </div>

                                        {/* Customer Favorite Badge */}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg">
                                                <Award className="w-3 h-3 mr-1" />
                                                Customer Favorite
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {item.name}
                                            </h3>
                                            <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                                                {item.price}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                            {item.desc}
                                        </p>

                                        <Link href="/menu">
                                            <Button
                                                variant="outline"
                                                className="w-full group/btn border-2 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white transition-all"
                                            >
                                                Order Now
                                                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Decorative element */}
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Best Seller Spotlight */}
                <section className="py-24 bg-white dark:bg-gray-900">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.h2
                            className="text-4xl md:text-5xl font-black text-center mb-4"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <span className="text-gray-900 dark:text-white">The </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
                                People's Choice
                            </span>
                        </motion.h2>

                        <motion.p
                            className="text-center text-xl text-gray-600 dark:text-gray-400 mb-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            variants={fadeInUp}
                        >
                            Our most-loved beverage that keeps customers coming back
                        </motion.p>

                        <motion.div
                            className="relative bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 dark:from-gray-800 dark:via-orange-950/30 dark:to-gray-800 p-2 rounded-[2rem] shadow-2xl"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={scaleUp}
                        >
                            <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl">
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    {/* Image */}
                                    <motion.div
                                        className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl"
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Image
                                            src='/resources/bun.jpeg'
                                            alt="Special Chai - Best Seller"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    </motion.div>

                                    {/* Content */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 border-0 shadow-lg flex items-center gap-2 px-4 py-2">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="font-bold">#1 Best Seller</span>
                                            </Badge>

                                            <div className="flex items-center gap-1">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                                </span>
                                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium ml-1">
                                                    Selling Fast
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                                            Special Chai
                                        </h3>

                                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                            Our aromatic, soothing Special Chai is the undisputed champion, loved by all ages.
                                            Brewed with a <span className="font-semibold text-orange-600 dark:text-orange-400">secret blend of spices</span> and
                                            served with genuine warmth in every cup.
                                        </p>

                                        <div className="space-y-3 mb-8">
                                            {[
                                                'Premium Assam tea leaves',
                                                'Hand-ground fresh spices',
                                                'Traditional brewing method',
                                                'Perfect milk-to-tea ratio'
                                            ].map((feature, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Coffee className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl font-black text-orange-600 dark:text-orange-400">₹30</span>
                                            <Link href="/menu">
                                                <Button
                                                    size="lg"
                                                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full shadow-lg group"
                                                >
                                                    Try It Now
                                                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,146,60,0.1),transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(245,158,11,0.1),transparent_50%)]" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6 z-10">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-black mb-4">
                                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Artisanal</span> Process
                            </h2>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                Every cup tells a story of dedication and craftsmanship
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {processSteps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-700 hover:border-amber-500/50 transition-all group"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={cardVariants}
                                    transition={{ delay: i * 0.15 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                >
                                    {/* Step number */}
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-xl flex items-center justify-center font-black text-white text-xl">
                                        {i + 1}
                                    </div>

                                    {/* Icon */}
                                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-amber-400 mb-4">{step.title}</h3>
                                    <p className="text-gray-300 leading-relaxed">{step.desc}</p>

                                    {/* Decorative line */}
                                    <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${step.color}`} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-24 bg-white dark:bg-gray-900">
                    <div className="max-w-5xl mx-auto px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-center mb-12"
                        >
                            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-0 px-4 py-2 text-sm font-semibold mb-4">
                                TESTIMONIALS
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                                Voices of <span className="text-orange-600 dark:text-orange-400">Delight</span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                What our amazing customers have to say about us
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl shadow-xl border-2 border-orange-100 dark:border-gray-600"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={scaleUp}
                        >
                            <TestimonialsCarousel />
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white py-24 overflow-hidden">
                    {/* Animated background circles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-white/10"
                                style={{
                                    width: `${200 + i * 100}px`,
                                    height: `${200 + i * 100}px`,
                                    top: `${25 + i * 20}%`,
                                    left: `${20 + i * 25}%`,
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.2, 0.1],
                                }}
                                transition={{
                                    duration: 4 + i,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative max-w-5xl mx-auto text-center px-6 z-10">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2 text-sm font-semibold mb-6">
                                <Calendar className="w-4 h-4 mr-2 inline" />
                                Book Your Experience
                            </Badge>

                            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                                Ready for a <br />
                                <span className="relative inline-block">
                                    <span className="relative z-10">Chai Experience</span>
                                    <span className="absolute bottom-2 left-0 w-full h-4 bg-white/30 -rotate-1"></span>
                                </span>?
                            </h2>

                            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-90">
                                Visit us today or book a table to experience the magic firsthand.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-10 py-7 rounded-full shadow-2xl text-lg group"
                                >
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Book a Table
                                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>

                                <Link href='/menu'>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="bg-transparent border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm font-bold px-10 py-7 rounded-full shadow-2xl text-lg"
                                    >
                                        View Menu
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}