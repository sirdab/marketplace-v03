import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  type PropertyCategory,
  type PropertyFilters,
  categoryLabels,
  propertySubTypes,
} from "@shared/schema";

interface FilterSidebarProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  cities?: string[];
  districts?: string[];
}

const categories: PropertyCategory[] = [
  "warehouse",
  "workshop",
  "storage",
  "storefront-long",
  "storefront-short",
];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full py-3 text-sm font-medium hover-elevate rounded-md px-2 -mx-2">
          {title}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function FilterContent({
  filters,
  onFiltersChange,
  cities = [],
  districts = [],
}: FilterSidebarProps) {
  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== null && v !== ""
  ).length;

  const clearFilters = () => {
    onFiltersChange({});
  };

  const updateFilter = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
            data-testid="button-clear-filters"
          >
            Clear all
          </Button>
        )}
      </div>

      <FilterSection title="Property Type">
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.category === category}
                onCheckedChange={(checked) =>
                  updateFilter("category", checked ? category : undefined)
                }
                data-testid={`checkbox-category-${category}`}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer"
              >
                {categoryLabels[category]}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {filters.category && propertySubTypes[filters.category] && (
        <FilterSection title="Sub-Type">
          <div className="space-y-2">
            {propertySubTypes[filters.category].map((subType) => (
              <div key={subType} className="flex items-center gap-2">
                <Checkbox
                  id={`subtype-${subType}`}
                  checked={filters.subType === subType}
                  onCheckedChange={(checked) =>
                    updateFilter("subType", checked ? subType : undefined)
                  }
                />
                <Label
                  htmlFor={`subtype-${subType}`}
                  className="text-sm cursor-pointer"
                >
                  {subType}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Price Range (SAR)">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Min</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  updateFilter(
                    "minPrice",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                data-testid="input-min-price"
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Max</Label>
              <Input
                type="number"
                placeholder="Any"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  updateFilter(
                    "maxPrice",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                data-testid="input-max-price"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Size (sqm)">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Min</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minSize || ""}
                onChange={(e) =>
                  updateFilter(
                    "minSize",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                data-testid="input-min-size"
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Max</Label>
              <Input
                type="number"
                placeholder="Any"
                value={filters.maxSize || ""}
                onChange={(e) =>
                  updateFilter(
                    "maxSize",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                data-testid="input-max-size"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {cities.length > 0 && (
        <FilterSection title="City" defaultOpen={false}>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {cities.map((city) => (
              <div key={city} className="flex items-center gap-2">
                <Checkbox
                  id={`city-${city}`}
                  checked={filters.city === city}
                  onCheckedChange={(checked) =>
                    updateFilter("city", checked ? city : undefined)
                  }
                />
                <Label htmlFor={`city-${city}`} className="text-sm cursor-pointer">
                  {city}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Verification">
        <div className="flex items-center gap-2">
          <Checkbox
            id="verified-only"
            checked={filters.isVerified === true}
            onCheckedChange={(checked) =>
              updateFilter("isVerified", checked ? true : undefined)
            }
            data-testid="checkbox-verified-only"
          />
          <Label htmlFor="verified-only" className="text-sm cursor-pointer">
            Verified listings only
          </Label>
        </div>
      </FilterSection>
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  const [open, setOpen] = useState(false);
  const activeFilterCount = Object.values(props.filters).filter(
    (v) => v !== undefined && v !== null && v !== ""
  ).length;

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 p-4 border rounded-md bg-card">
          <FilterContent {...props} />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2" data-testid="button-open-filters">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
              <FilterContent {...props} />
            </div>
            <SheetFooter>
              <Button onClick={() => setOpen(false)} className="w-full">
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
