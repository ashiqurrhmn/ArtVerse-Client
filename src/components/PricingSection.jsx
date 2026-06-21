"use client";

import { useState, useEffect } from "react";
import { Button, Link } from "@heroui/react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function PricingSection() {
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const user = session?.user;
  const isNotBuyer = mounted ? (user && user.role !== "buyer") : false;

  // Fetch plan directly from DB to bypass JWT cookie cache
  const [userPlan, setUserPlan] = useState("free");

  useEffect(() => {
    fetch("/api/user/plan")
      .then((res) => res.json())
      .then((data) => setUserPlan(data.plan || "free"))
      .catch(() => setUserPlan("free"));
  }, [session]);

  const handleActionClick = (e) => {
    if (!user) {
      if (e) e.preventDefault();
      toast.error("Please log in to choose a plan.");
      return;
    }

    if (isNotBuyer) {
      if (e) e.preventDefault();
      toast.error(
        "Subscriptions and pricing plans are exclusively for buyers."
      );
      return;
    }
  };

  const plans = [
    {
      name: "Free",
      id: "free",
      price: "$0",
      period: "/forever",
      description: "Start exploring and purchasing artworks.",
      features: [
        "Up to 3 paintings purchases allowed",
        "Basic support",
        "Standard browsing",
      ],
      popular: false,
    },
    {
      name: "Pro",
      id: "pro",
      price: "$9.99",
      period: "/month",
      description: "Perfect for art enthusiasts wanting more.",
      features: [
        "Up to 9 paintings purchases allowed",
        "Priority support",
        "Early access to new art",
      ],
      popular: true,
    },
    {
      name: "Premium",
      id: "premium",
      price: "$19.99",
      period: "/month",
      description: "For serious collectors and buyers.",
      features: [
        "Unlimited paintings purchases",
        "24/7 dedicated support",
        "Exclusive VIP events",
      ],
      popular: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-[70%] px-4 py-16 md:py-24 text-center"
      >
        <span className="inline-flex rounded-full border border-separator bg-accent/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          Subscription Tier Overview
        </span>

        <h1 className="mt-8 text-4xl font-serif italic font-bold tracking-tight md:text-6xl text-foreground">
          Choose Your Plan
          <span className="block text-primary mt-2 not-italic">
            Unlock More Purchases
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-medium">
          Select a subscription tier that best fits your art collecting journey.
          Upgrade anytime to increase your maximum allowed purchases.
        </p>
      </motion.section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-8 lg:grid-cols-3 lg:items-center"
        >
          {plans.map((plan) => {
            const planOrder = { free: 0, pro: 1, premium: 2 };
            const safeUserPlan = mounted ? userPlan : "free";
            const userPlanLevel = planOrder[safeUserPlan.toLowerCase()] ?? 0;
            const currentPlanLevel = planOrder[plan.id.toLowerCase()] ?? 0;

            const isCurrentPlan = userPlanLevel === currentPlanLevel;
            const isDowngrade = userPlanLevel > currentPlanLevel;
            const isDisabled = isCurrentPlan || isDowngrade;

            return (
              <motion.div
                variants={itemVariants}
                key={plan.name}
                className={`relative rounded-[2rem] border bg-background/80 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 ${
                  plan.popular
                    ? "border-primary ring-2 ring-primary/30 shadow-lg lg:scale-105 bg-background z-10"
                    : "border-separator"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-serif font-bold text-foreground">
                  {plan.name}
                </h3>

                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-8 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground font-medium">
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-foreground/90 font-medium"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/50 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <form action="/api/checkout_sessions" method="POST">
                  <input type="hidden" name="planId" value={plan.id} />
                  <section>
                    <Button
                      type={isDisabled || isNotBuyer ? "button" : "submit"}
                      role="link"
                      onClick={(e) => {
                        if (isDisabled) {
                          e.preventDefault();
                          return;
                        }
                        handleActionClick(e);
                      }}
                      isDisabled={isDisabled}
                      disabled={isDisabled}
                      className={`mt-10 w-full rounded-full font-bold py-6 text-sm transition-all shadow-sm ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
                          : "bg-accent/40 text-foreground hover:bg-accent/60 border border-separator"
                      } ${
                        isNotBuyer || isDisabled
                          ? "opacity-60 cursor-not-allowed hover:-translate-y-0 hover:shadow-sm"
                          : ""
                      }`}
                    >
                      {isNotBuyer
                        ? "Only for Buyers"
                        : isCurrentPlan
                          ? "Current Plan"
                          : isDowngrade
                            ? "Included in Plan"
                            : `Upgrade to ${plan.name}`}
                    </Button>
                  </section>
                </form>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[3rem] border border-separator bg-accent/20 p-12 text-center md:p-16"
        >
          <div className="absolute inset-0 bg-secondary/5 mix-blend-multiply" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Ready to Build Your Collection?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Upgrade your account today to unlock higher purchase limits and
              exclusive benefits in our art community.
            </p>

            <Link href="/pricing"
              className={`mt-10 rounded-full  bg-primary px-10 py-3 font-bold text-primary-foreground shadow-md transition-all text-base ${isNotBuyer ? "opacity-60 cursor-not-allowed" : "hover:bg-primary/90 hover:scale-105 active:scale-95"}`}
            >
              {isNotBuyer ? "Only for Buyers" : "Get Started"}
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
