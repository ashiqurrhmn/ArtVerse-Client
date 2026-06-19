"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ShoppingBag, LayoutDashboard } from "lucide-react";
import { Button } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { refetch } = authClient.useSession();

  useEffect(() => {
    if (sessionId) {
      fetch("/api/checkout_sessions/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("Plan updated successfully to:", data.plan);
            // Refresh the session so the pricing cards pick up the new plan
            refetch();
          }
        })
        .catch((err) => console.error("Verification Error:", err));
    }
  }, [sessionId, refetch]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-lg w-full bg-background/60 backdrop-blur-xl border border-separator rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative z-10 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
        className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative"
      >
        {/* Pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border-2 border-primary/30"
        />

        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
          <Check className="w-8 h-8" strokeWidth={3} />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4"
      >
        Payment Successful!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-muted-foreground text-lg mb-8 leading-relaxed"
      >
        Thank you for your purchase. Your subscription has been activated and
        your account is now upgraded.
      </motion.p>

      {sessionId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8 text-xs text-muted-foreground bg-accent/30 py-2 px-4 rounded-full inline-block font-mono border border-separator/50"
        >
          Order ID: {sessionId.slice(0, 12)}...
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <Button
          as={Link}
          href="/dashboard"
          className="w-full bg-primary text-primary-foreground font-bold py-7 rounded-full shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
        >
          <LayoutDashboard className="w-5 h-5" />
          Go to Dashboard
        </Button>

        <Button
          as={Link}
          href="/"
          className="w-full bg-transparent text-foreground font-bold py-7 rounded-full border-2 border-separator hover:border-primary/50 hover:bg-accent/20 transition-all flex items-center justify-center gap-2 text-base"
        >
          <ShoppingBag className="w-5 h-5" />
          Browse More Art
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="text-muted-foreground font-medium animate-pulse">
            Loading...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
