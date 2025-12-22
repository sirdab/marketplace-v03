import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HomeCategoryBar, CategoryHeading } from "@/components/HomeCategoryBar";
import { CityFilterTabs } from "@/components/CityFilterTabs";
import { PropertyGrid } from "@/components/PropertyGrid";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { ValueProposition } from "@/components/ValueProposition";
import { Footer } from "@/components/Footer";
import { type Property, type PropertyCategory } from "@shared/schema";

type HomeCategoryOption = "warehouse" | "workshop" | "storage" | "storefront-long" | "all";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<HomeCategoryOption>("warehouse");
  
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const filteredProperties = useMemo(() => {
    if (selectedCategory === "all") {
      return properties;
    }
    return properties.filter((p) => p.category === selectedCategory);
  }, [properties, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HomeCategoryBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <CityFilterTabs category={selectedCategory} />
        <CategoryHeading category={selectedCategory} city="riyadh" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
          <PropertyGrid properties={filteredProperties} isLoading={isLoading} />
        </div>
        <CategoryShowcase />
        <FeaturedProperties properties={properties} isLoading={isLoading} />
        <ValueProposition />
      </main>
      <Footer />
    </div>
  );
}
