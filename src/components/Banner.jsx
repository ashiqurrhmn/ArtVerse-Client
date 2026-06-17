"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { ShieldCheck, ArrowRight, RefreshCw, Truck } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Banner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
    
      <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
    
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="/Assets/hero_pic.jpg"
            alt="Artverse Hero Background"
            fill
            className="object-cover object-center"
            priority
          />
         
          <div className="absolute inset-0 bg-black/40"></div>
        </motion.div>

        {/* Centered Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center text-white"
        >
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl lg:text-8xl font-bold font-serif leading-[1.1] tracking-tight mb-6 drop-shadow-xl">
            Discover & Collect <br className="hidden sm:block" />
            Extraordinary Art
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg sm:text-xl mb-10 max-w-2xl font-medium leading-relaxed">
            Buy, sell, and explore unique artworks.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5">
            <Button
              as={Link}
              href="#"
              radius="full"
              className="bg-primary text-primary-foreground px-12 py-7 font-bold text-lg w-full sm:w-auto shadow-lg hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              Shop Now
            </Button>
            <Button
              as={Link}
              href="/explore"
              radius="full"
              variant="bordered"
              className="border-2 border-white text-white px-10 py-7 font-bold text-lg w-full sm:w-auto shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm active:scale-95 group"
            >
              Explore Artworks <ArrowRight size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Bottom Feature Strip */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="bg-secondary"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-primary-foreground text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-primary-foreground/20">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start pt-4 sm:pt-0 sm:pl-8">
              <Truck size={32} strokeWidth={1.3} />
              <div>
                <h4 className="font-semibold text-base tracking-wide">
                  Free Shipping
                </h4>
                <p className="text-sm opacity-85">On all orders over $50</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start pt-4 sm:pt-0 sm:pl-8">
              <RefreshCw size={32} strokeWidth={1.3} />
              <div>
                <h4 className="font-semibold text-base tracking-wide">
                  30-Day Returns
                </h4>
                <p className="text-sm opacity-85">Love it or return it</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start pt-4 sm:pt-0 sm:pl-8">
              <ShieldCheck size={32} strokeWidth={1.3} />
              <div>
                <h4 className="font-semibold text-base tracking-wide">
                  Secure Checkout
                </h4>
                <p className="text-sm opacity-85">100% protected payments</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
