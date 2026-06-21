"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    try {
      const { data, error } = await authClient.signIn.email({
        ...user,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in");
      } else if (data?.user) {
        if (data.user.role === "buyer") {
          router.push("/");
        } else if (data.user.role === "artist" || data.user.role === "admin") {
          router.push(`/dashboard/${data.user.role}`);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
    const handleGoogleSignIn = async () => {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
      });

      if (error) {
        toast.error(error.message || "Failed to sign in with Google");
      } else if (data?.user) {
        if (data.user.role === "buyer") {
          router.push("/");
        } else if (data.user.role === "artist" || data.user.role === "admin") {
          router.push(`/dashboard/${data.user.role}`);
        } else {
          router.push("/");
        }
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A3B22]/80 backdrop-blur-sm p-4">
      {/* Floating Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex w-full max-w-[900px] h-[560px] rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Left Panel — Illustration */}
        <div className="hidden md:flex w-1/2 bg-secondary relative flex-col items-center justify-between p-10">
          {/* Illustration */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="w-full h-full">
              <Image
                src="/Assets/singin_image"
                alt="ArtVerse illustration"
                fill
                className="object-cover drop-shadow-lg"
                priority
              />
            </div>
          </div>

        </div>

        {/* Right Panel — Form */}
        <div className="w-full md:w-1/2 bg-background flex flex-col justify-center items-center px-10 py-12">
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full max-w-xs flex flex-col items-center"
          >
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
            <h2 className="text-base text-muted-foreground font-medium mb-8">
              Welcome to ArtVerse
            </h2>

            {/* Form */}
            <form onSubmit={onSubmit} className="w-full flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Email or Username
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-transparent border-b border-separator py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-separator py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                />
                
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-full shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center w-full my-6">
              <div className="flex-1 h-px bg-separator" />
              <span className="px-3 text-[10px] text-muted-foreground uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-px bg-separator" />
            </div>

            {/* Google */}
            <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 border border-separator bg-background text-foreground text-sm font-medium py-3 rounded-full hover:bg-accent/30 transition-colors shadow-sm">
              <FcGoogle className="text-lg" />
              Sign in with Google
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground mt-8">
              New to ArtVerse?{" "}
              <Link
                href="/signup"
                className="text-primary font-semibold hover:underline transition-all"
              >
                Create Account
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
