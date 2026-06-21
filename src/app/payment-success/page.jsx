"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ShoppingBag, LayoutDashboard, ImageIcon } from "lucide-react";
import { Button } from "@heroui/react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPurchase(data.purchase);
            setStatus("success");
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center gap-4">
        <span className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Verifying your payment...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-background/60 backdrop-blur-xl border border-separator rounded-[2.5rem] p-10 md:p-12 shadow-2xl text-center"
      >
        <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-red-500 text-3xl font-bold">!</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-8">
          We couldn't verify your payment. Please contact support if you were
          charged.
        </p>
        <Link
          href="/browse"
          className="w-full bg-primary text-primary-foreground font-bold py-6 rounded-full"
        >
          Back to Browse
        </Link>
      </motion.div>
    );
  }

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
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 200,
          delay: 0.2,
        }}
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
        Purchase Successful!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-muted-foreground text-lg mb-4 leading-relaxed"
      >
        Congratulations! You now own this artwork.
      </motion.p>

      {purchase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8 space-y-2"
        >
          <div className="bg-accent/30 rounded-2xl p-4 border border-separator/50 text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">
              Artwork
            </p>
            <p className="text-foreground font-bold text-lg">
              {purchase.artworkTitle}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-separator/50">
              <span className="text-sm text-muted-foreground">Amount Paid</span>
              <span className="text-foreground font-extrabold text-xl">
                ${purchase.amount}
              </span>
            </div>
          </div>

          {sessionId && (
            <p className="text-xs text-muted-foreground font-mono bg-accent/20 py-1.5 px-3 rounded-full inline-block border border-separator/40">
              Order: {sessionId.slice(0, 16)}...
            </p>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <Link
          href="/dashboard/buyer"
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-full shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
        >
          <LayoutDashboard className="w-5 h-5" />
          Go to Dashboard
        </Link>

        <Link
          
          href="/browse"
          className="w-full bg-transparent text-foreground font-bold py-4 rounded-full border-2 border-separator hover:border-primary/50 hover:bg-accent/20 transition-all flex items-center justify-center gap-2 text-base"
        >
          <ShoppingBag className="w-5 h-5" />
          Browse More Art
        </Link>
      </motion.div>
    </motion.div>
  );
}

const PaymentSuccessPage = () => {
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

export default PaymentSuccessPage;
