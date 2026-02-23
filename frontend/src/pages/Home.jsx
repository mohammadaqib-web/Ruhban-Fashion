// import HeroSection from "../components/Hero";
import CategoriesSection from "../components/CategoriesSection";
import FeaturesSection from "../components/FeaturesSection";
import FreshDrops from "../components/FreshDrops";
import Hero from "../components/Hero";
import MerchShowcase from "../components/MerchShowcase";
import PantFeature from "../components/PantFeature";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <PantFeature />
      <FreshDrops />
      <FeaturesSection />
      <FreshDrops />
    </>
  );
}
