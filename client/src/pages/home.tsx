import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HomeCategoryBar } from "@/components/HomeCategoryBar";
import { CityFilterTabs, cities } from "@/components/CityFilterTabs";
import { PropertyGrid } from "@/components/PropertyGrid";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { ValueProposition } from "@/components/ValueProposition";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { type Property, type PropertyCategory } from "@shared/schema";

type HomeCategoryOption = "warehouse" | "workshop" | "storage" | "storefront-long" | "all";
const ITEMS_PER_PAGE = 6;

export default function Home() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<HomeCategoryOption>("warehouse");
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const filteredProperties = useMemo(() => {
    let result = properties;
    
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    
    if (selectedCity) {
      result = result.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase());
    }
    
    return result;
  }, [properties, selectedCategory, selectedCity]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCity]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const getCategoryLabel = () => {
    switch (selectedCategory) {
      case "warehouse":
        return t("homeCategoryBar.warehousesPlural");
      case "workshop":
        return t("homeCategoryBar.workshopsPlural");
      case "storage":
        return t("homeCategoryBar.selfStoragePlural");
      case "storefront-long":
        return t("homeCategoryBar.longTermStorefrontsPlural");
      case "all":
        return t("homeCategoryBar.allProperties");
    }
  };

  const getCityLabel = () => {
    if (!selectedCity) return null;
    const city = cities.find((c) => c.slug === selectedCity);
    return city ? t(`cities.${city.key}`) : selectedCity;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HomeCategoryBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <CityFilterTabs 
          category={selectedCategory} 
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
        />
        
        <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6">
          <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold" data-testid="text-category-heading">
            {getCategoryLabel()}
            {selectedCity && (
              <> {t("homeCategoryBar.in")} {getCityLabel()}</>
            )}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            {filteredProperties.length} {t("properties.available")}
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 pb-8 md:pb-12">
          <PropertyGrid properties={paginatedProperties} isLoading={isLoading} />
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                data-testid="button-home-pagination-prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, index, arr) => {
                    const showEllipsis = index > 0 && page - arr[index - 1] > 1;
                    return (
                      <span key={page} className="flex items-center gap-1">
                        {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[2rem]"
                          data-testid={`button-home-pagination-${page}`}
                        >
                          {page}
                        </Button>
                      </span>
                    );
                  })}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                data-testid="button-home-pagination-next"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <CategoryShowcase />
        <FeaturedProperties properties={properties} isLoading={isLoading} />
        <ValueProposition />
      </main>
      <Footer />
    </div>
  );
}
