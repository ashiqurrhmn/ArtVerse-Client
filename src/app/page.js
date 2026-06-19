import Banner from "@/components/Banner";
import PricingSection from "@/components/PricingSection";

export default function Home() {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden">
      <Banner />
      <PricingSection />
    </div>
  );
}
