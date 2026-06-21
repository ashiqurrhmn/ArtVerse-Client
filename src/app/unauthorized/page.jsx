"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="relative rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl p-8 shadow-2xl overflow-hidden text-center">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-500/10 blur-[50px] pointer-events-none" />

          {/* Icon */}
          <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping opacity-20" />
            <div className="relative bg-red-500/10 rounded-full p-4 border border-red-500/20">
              <ShieldAlert className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            You don't have permission to view this page. This area is restricted to specific roles, or your session may not have the required clearance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/profile"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:brightness-110 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Profile
            </Link> 
            
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-muted/30 text-foreground font-semibold rounded-xl hover:bg-muted/50 transition-all border border-separator/60"
            >
              <Home className="w-4 h-4" />
              Home Page
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
