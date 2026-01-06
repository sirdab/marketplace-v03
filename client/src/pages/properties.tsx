import { useState, useMemo, useEffect } from "react";
import { useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { CategoryTabs } from "@/components/CategoryTabs";
import { FilterSidebar, MobileFilterTrigger } from "@/components/FilterSidebar";
import { PropertyGrid } from "@/components/PropertyGrid";
import { PropertyMap } from "@/components/PropertyMap";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  type Property,
  type PropertyCategory,
  type PropertyFilters,
  type PropertyPurpose,
} from "@shared/schema";
import { PurposeFilter } from "@/components/PurposeFilter";

type SortOption = "newest" | "price-low" | "price-high" | "size";
const ITEMS_PER_PAGE = 12;

export default function Properties() {
  const { t } = useTranslation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  
  const initialCategory = params.get("category") as PropertyCategory | null;
  const initialQuery = params.get("q") || "";
  const initialVerified = params.get("verified") === "true";
  const initialPurpose = params.get("purpose") as PropertyPurpose | null;

  const [filters, setFilters] = useState<PropertyFilters>({
    category: initialCategory || undefined,
    searchQuery: initialQuery,
    isVerified: initialVerified || undefined,
    purpose: initialPurpose || undefined,
  });
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(properties.map((p) => p.city)));
    return uniqueCities.sort();
  }, [properties]);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.subType) {
      result = result.filter((p) => p.subType === filters.subType);
    }
    if (filters.city) {
      result = result.filter((p) => p.city === filters.city);
    }
    if (filters.minPrice) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.minSize) {
      result = result.filter((p) => p.size >= filters.minSize!);
    }
    if (filters.maxSize) {
      result = result.filter((p) => p.size <= filters.maxSize!);
    }
    if (filters.isVerified) {
      result = result.filter((p) => p.isVerified);
    }
    if (filters.purpose) {
      result = result.filter((p) => p.purpose === filters.purpose);
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.district.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "size":
        result.sort((a, b) => b.size - a.size);
        break;
      default:
        break;
    }

    return result;
  }, [properties, filters, sortBy]);

  // Reset to page 1 when filters or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== null && v !== ""
  ).length;

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleCategoryChange = (category: PropertyCategory | null) => {
    setFilters((prev) => ({
      ...prev,
      category: category || undefined,
      subType: undefined,
    }));
  };

  const clearFilter = (key: keyof PropertyFilters) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handlePurposeChange = (purpose: PropertyPurpose | undefined) => {
    setFilters((prev) => ({ ...prev, purpose }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onSearch={handleSearch} 
        searchQuery={filters.searchQuery} 
        purpose={filters.purpose}
        onPurposeChange={handlePurposeChange}
      />
      
      <div className="border-b bg-background">
        <CategoryTabs
          selectedCategory={filters.category || null}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold">
                  {filters.category
                    ? t(`categories.${filters.category}`)
                    : t("properties.title")}
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  {filteredProperties.length} {t("properties.available")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-28 md:w-40 text-xs md:text-sm" data-testid="select-sort">
                    <SelectValue placeholder={t("properties.sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t("properties.newest")}</SelectItem>
                    <SelectItem value="price-low">{t("properties.priceLowToHigh")}</SelectItem>
                    <SelectItem value="price-high">{t("properties.priceHighToLow")}</SelectItem>
                    <SelectItem value="size">{t("properties.size")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <MobileFilterTrigger
                filters={filters}
                onFiltersChange={setFilters}
                cities={cities}
              />
              <div className="hidden md:flex items-center gap-2 ms-auto">
                <Label htmlFor="show-map" className="text-sm text-muted-foreground whitespace-nowrap">
                  {t("properties.showMap")}
                </Label>
                <Switch
                  id="show-map"
                  checked={showMap}
                  onCheckedChange={setShowMap}
                  data-testid="switch-show-map"
                />
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.category && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => clearFilter("category")}
                >
                  {filters.category}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.city && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => clearFilter("city")}
                >
                  {filters.city}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.isVerified && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => clearFilter("isVerified")}
                >
                  {t("filters.verifiedOnly")}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.purpose && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => clearFilter("purpose")}
                  data-testid="badge-purpose-filter"
                >
                  {filters.purpose === "buy" ? t("purpose.buy") : filters.purpose === "rent" ? t("purpose.rent") : t("purpose.dailyRental")}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.searchQuery && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => clearFilter("searchQuery")}
                >
                  "{filters.searchQuery}"
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => {
                    clearFilter("minPrice");
                    clearFilter("maxPrice");
                  }}
                >
                  {t("property.price")}: {filters.minPrice || 0} - {filters.maxPrice || t("common.any")}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-4 md:gap-6">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              cities={cities}
            />
            
            <div className="flex-1 min-w-0">
              {showMap ? (
                <div className="h-[400px] md:h-[600px]">
                  <PropertyMap properties={filteredProperties} />
                </div>
              ) : (
                <>
                  <PropertyGrid properties={paginatedProperties} isLoading={isLoading} />
                  
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        data-testid="button-pagination-prev"
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
                                  data-testid={`button-pagination-${page}`}
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
                        data-testid="button-pagination-next"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
