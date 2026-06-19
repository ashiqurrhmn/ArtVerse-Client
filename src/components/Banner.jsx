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
    <div className="relative w-[100vw] left-1/2 -translate-x-1/2">
    
      <section className="relative h-[75vh] min-h-[450px] sm:h-[90vh] sm:min-h-[600px] w-full overflow-hidden">
    
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
         
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--app-banner-overlay)' }}></div>
        </motion.div>

        {/* Centered Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
          style={{ color: '#FCF7EE' }}
        >
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-8xl font-bold font-serif leading-[1.1] tracking-tight mb-6 drop-shadow-xl">
            Discover & Buy <br className="hidden sm:block" />
            <span className="text-primary">Original Artworks</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg sm:text-xl mb-10 max-w-2xl font-medium leading-relaxed">
            Buy, sell, and explore extraordinary artworks.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5">
            <Button
              as={Link}
              href="#"
              radius="full"
              className="bg-primary text-primary-foreground px-8 py-5 sm:px-12 sm:py-7 font-bold text-base sm:text-lg w-full sm:w-auto shadow-lg hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              Shop Now
            </Button>
            <Button
              as={Link}
              href="/explore"
              radius="full"
              variant="bordered"
              className="border-2 border-[#FCF7EE] text-[#FCF7EE] px-8 py-5 sm:px-10 sm:py-7 font-bold text-base sm:text-lg w-full sm:w-auto shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:bg-[#FCF7EE] hover:text-primary transition-all duration-300 backdrop-blur-sm active:scale-95 group"
            >
              Browse Artworks <ArrowRight size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Bottom Feature Strip */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="transition-colors duration-300"
        style={{ backgroundColor: 'var(--app-banner-strip)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-[#FCF7EE]/60 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-[#FCF7EE]/40">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center sm:justify-start py-3 sm:py-0 sm:pl-8">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.3} />
              <div>
                <h4 className="font-semibold text-sm sm:text-base tracking-wide">
                  Free Shipping
                </h4>
                <p className="text-xs sm:text-sm opacity-85">On all orders over $50</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center sm:justify-start py-3 sm:py-0 sm:pl-8">
              <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.3} />
              <div>
                <h4 className="font-semibold text-sm sm:text-base tracking-wide">
                  30-Day Returns
                </h4>
                <p className="text-xs sm:text-sm opacity-85">Love it or return it</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center sm:justify-start py-3 sm:py-0 sm:pl-8">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.3} />
              <div>
                <h4 className="font-semibold text-sm sm:text-base tracking-wide">
                  Secure Checkout
                </h4>
                <p className="text-xs sm:text-sm opacity-85">100% protected payments</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
