"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const { confirmPassword, ...dataToSend } = user;
    let authError = null;

    try {
      const { data, error } = await authClient.signUp.email({
        ...dataToSend,
        plan: "free",
      });
      
      if (error) {
        authError = error.message || "Failed to sign up";
      }
    } catch (error) {
      authError = error?.message || "An unexpected error occurred";
      console.error(error);
    }

    if (authError) {
      toast.error(authError);
      setIsLoading(false);
      return;
    }

    redirect("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A3B22]/80 backdrop-blur-sm p-4">
      {/* Floating Card — reversed layout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-row-reverse w-full max-w-[900px] h-[580px] rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Right Panel — Illustration */}
        <div className="hidden lg:flex w-1/2 bg-secondary relative flex-col items-center justify-between p-10">
          {/* Illustration */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="w-72 h-72 ">
              <Image
                src="/Assets/singup"
                alt="ArtVerse illustration"
                fill
                className="object-cover drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Left Panel — Form */}
        <div className="w-full lg:w-1/2 bg-background flex flex-col justify-center items-center px-10 py-10 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full max-w-xs flex flex-col items-center"
          >
           <Image src="/logo.png" alt="Logo" width={150} height={150} />
            <h2 className="text-base text-muted-foreground font-medium mt-3 mb-7">
              Create your Account
            </h2>

            {/* Form */}
            <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
              {/* Name + Email row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-transparent border-b border-separator py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full bg-transparent border-b border-separator py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Password + Confirm Password row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent border-b border-separator py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent border-b border-separator py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Role row */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Join As
                </label>
                <select
                  name="role"
                  required
                  defaultValue=""
                  className="w-full bg-transparent border-b border-separator py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-muted-foreground">
                    Select role
                  </option>
                  <option value="buyer">Buyer</option>
                  <option value="artist">Artist</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-full shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center w-full my-5">
              <div className="flex-1 h-px bg-separator" />
              <span className="px-3 text-[10px] text-muted-foreground uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-px bg-separator" />
            </div>

            {/* Google */}
            <button className="w-full flex items-center justify-center gap-2 border border-separator bg-background text-foreground text-sm font-medium py-3 rounded-full hover:bg-accent/30 transition-colors shadow-sm">
              <FcGoogle className="text-lg" />
              Sign up with Google
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-primary font-semibold hover:underline transition-all"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
