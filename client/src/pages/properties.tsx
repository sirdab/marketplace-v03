import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { CategoryTabs } from "@/components/CategoryTabs";
import { FilterSidebar } from "@/components/FilterSidebar";
import { PropertyGrid } from "@/components/PropertyGrid";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, X } from "lucide-react";
import {
  type Property,
  type PropertyCategory,
  type PropertyFilters,
} from "@shared/schema";

type SortOption = "newest" | "price-low" | "price-high" | "size";

export default function Properties() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  
  const initialCategory = params.get("category") as PropertyCategory | null;
  const initialQuery = params.get("q") || "";
  const initialVerified = params.get("verified") === "true";

  const [filters, setFilters] = useState<PropertyFilters>({
    category: initialCategory || undefined,
    searchQuery: initialQuery,
    isVerified: initialVerified || undefined,
  });
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(properties.map((p) => p.city))];
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} searchQuery={filters.searchQuery} />
      
      <div className="border-b bg-background">
        <CategoryTabs
          selectedCategory={filters.category || null}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {filters.category
                  ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1).replace("-", " ")} Properties`
                  : "All Properties"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredProperties.length} properties available
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-40" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
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
                  Verified only
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
                  Price: {filters.minPrice || 0} - {filters.maxPrice || "Any"}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-6">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              cities={cities}
            />
            
            <div className="flex-1">
              <PropertyGrid properties={filteredProperties} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
