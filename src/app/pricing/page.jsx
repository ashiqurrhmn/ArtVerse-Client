import { Button } from "@heroui/react";
import { Check } from "lucide-react";

export default function SellerPricingPage() {
  const plans = [
    {
      name: "Starter Seller",
      price: "$4",
      period: "/month",
      description: "Perfect for new sellers starting their journey.",
      features: [
        "Up to 50 products",
        "Basic analytics",
        "Order management",
        "Seller profile",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Professional Seller",
      price: "$14",
      period: "/month",
      description: "For growing businesses that need more visibility.",
      features: [
        "Unlimited products",
        "Advanced analytics",
        "Priority product listing",
        "Promotional campaigns",
        "Inventory management",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise Seller",
      price: "Custom",
      period: "",
      description: "For brands and large-scale businesses.",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "Featured homepage placement",
        "API access",
        "24/7 support",
      ],
      popular: false,
    },
  ];

  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24 text-center">
        <span className="inline-flex rounded-full border border-separator bg-accent/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          Become a Seller
        </span>

        <h1 className="mt-8 text-4xl font-serif italic font-bold tracking-tight md:text-6xl text-foreground">
          Grow Your Business
          <span className="block text-primary mt-2 not-italic">
            Sell to Thousands of Customers
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-medium">
          Start selling on our marketplace and reach more customers with
          powerful tools, secure payments, and dedicated seller support.
        </p>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="grid gap-8 lg:grid-cols-3 lg:items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[2rem] border bg-background/80 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 ${
                plan.popular 
                  ? "border-primary ring-2 ring-primary/30 shadow-lg lg:scale-105 bg-white z-10" 
                  : "border-separator"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-serif font-bold text-foreground">{plan.name}</h3>

              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{plan.description}</p>

              <div className="mt-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground font-medium">{plan.period}</span>}
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/50 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-10 w-full rounded-full font-bold py-6 text-sm transition-all shadow-sm ${
                  plan.popular 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md" 
                    : "bg-accent/40 text-foreground hover:bg-accent/60 border border-separator"
                }`}
              >
                {plan.name === "Enterprise Seller" ? "Contact Sales" : "Become Seller"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-24">
        <div className="relative overflow-hidden rounded-[3rem] border border-separator bg-accent/20 p-12 text-center md:p-16">
          <div className="absolute inset-0 bg-secondary/5 mix-blend-multiply" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Ready to Start Selling?</h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Join our marketplace today and start growing your online business in a community that values art.
            </p>

            <Button className="mt-10 rounded-full bg-primary hover:bg-primary/90 px-10 py-6 font-bold text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95 text-base">
              Apply as Seller
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
