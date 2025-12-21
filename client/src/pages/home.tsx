import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CityFilterTabs } from "@/components/CityFilterTabs";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { ValueProposition } from "@/components/ValueProposition";
import { Footer } from "@/components/Footer";
import { type Property } from "@shared/schema";

export default function Home() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CityFilterTabs />
        <CategoryShowcase />
        <FeaturedProperties properties={properties} isLoading={isLoading} />
        <ValueProposition />
      </main>
      <Footer />
    </div>
  );
}
