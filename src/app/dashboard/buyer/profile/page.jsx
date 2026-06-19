"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Lock, User, Mail } from "lucide-react";
import Image from "next/image";

export default function ProfileManagementPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update your personal details and account security settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Basic Info */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Avatar Card */}
            <div className="bg-background border border-separator rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
              <div className="relative group cursor-pointer mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-background shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
                    alt="Profile Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Hover overlay for changing picture */}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-foreground">Jane Doe</h2>
              <p className="text-sm text-muted-foreground mb-4">Buyer</p>
              
              <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-full">
                Upload New Picture
              </button>
            </div>
          </motion.div>

          {/* Right Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information Form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-background border border-separator rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-separator pb-4 mb-6">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Jane Doe"
                      className="w-full bg-transparent border-b border-separator py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="jane@example.com"
                      disabled
                      className="w-full bg-muted/10 border-b border-separator py-2 text-sm text-muted-foreground cursor-not-allowed outline-none"
                    />
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      Contact support to change your email.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Bio (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell artists a bit about what kind of art you love..."
                    className="w-full bg-transparent border border-separator rounded-lg p-3 text-sm text-foreground outline-none focus:border-primary transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-primary text-primary-foreground font-medium text-sm px-6 py-2.5 rounded-full hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Security / Password Form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-background border border-separator rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-separator pb-4 mb-6">
                <Lock className="w-5 h-5 text-primary" />
                Security
              </h3>
              
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full md:w-2/3 bg-transparent border-b border-separator py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full bg-transparent border-b border-separator py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full bg-transparent border-b border-separator py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground font-medium text-sm px-6 py-2.5 rounded-full hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 shadow-sm"
                  >
                    <Lock className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}
