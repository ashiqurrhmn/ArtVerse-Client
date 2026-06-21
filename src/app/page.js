import Banner from "@/components/Banner";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import TopArtists from "@/components/TopArtists";
import ArtCategories from "@/components/ArtCategories";
import PricingSection from "@/components/PricingSection";

const Home = () => {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden">
      <Banner />
      <FeaturedArtworks />
      <TopArtists />
      <ArtCategories />
      <PricingSection />
    </div>
  );
}

export default Home;
