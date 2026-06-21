import Banner from "@/components/Banner";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import PricingSection from "@/components/PricingSection";

const Home = () => {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden">
      <Banner />
      <FeaturedArtworks />
      <PricingSection />
    </div>
  );
}

export default Home;
