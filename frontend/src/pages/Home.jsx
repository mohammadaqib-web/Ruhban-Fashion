import { useOutletContext } from "react-router-dom";
import CategoriesSection from "../components/CategoriesSection";
import FeaturesSection from "../components/FeaturesSection";
import FreshDrops from "../components/FreshDrops";
import Hero from "../components/Hero";
import PantFeature from "../components/PantFeature";

export default function Home() {
  const { categories } = useOutletContext();
  const pantCategories = categories?.filter((cat) =>
    cat.name.toLowerCase().includes("pant"),
  );

  return (
    <>
      <Hero />
      <CategoriesSection categories={categories} />
      <PantFeature pantCat={pantCategories[0]} />
      <FreshDrops category={categories[0]} />
      <FeaturesSection />
      <FreshDrops category={categories[1]}/>
      <FreshDrops category={categories[2]}/>
    </>
  );
}
