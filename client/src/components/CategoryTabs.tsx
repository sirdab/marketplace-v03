import { Warehouse, Wrench, Package, Store } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { type PropertyCategory } from "@shared/schema";

const categoryIcons: Record<PropertyCategory, React.ReactNode> = {
  "warehouse": <Warehouse className="h-4 w-4" />,
  "workshop": <Wrench className="h-4 w-4" />,
  "storage": <Package className="h-4 w-4" />,
  "storefront": <Store className="h-4 w-4" />,
};

const categories: PropertyCategory[] = [
  "warehouse",
  "workshop", 
  "storage",
  "storefront",
];

const categoryTranslationKeys: Record<PropertyCategory, string> = {
  "warehouse": "homeCategoryBar.warehouses",
  "workshop": "homeCategoryBar.workshops",
  "storage": "homeCategoryBar.selfStorage",
  "storefront": "homeCategoryBar.storefronts",
};

interface CategoryTabsProps {
  selectedCategory: PropertyCategory | null;
  onCategoryChange: (category: PropertyCategory | null) => void;
}

export function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="w-full overflow-x-auto scrollbar-hide -mx-1 px-1">
      <div className="flex items-center gap-1 md:gap-2 py-2 md:py-4 px-3 md:px-6 lg:px-8 min-w-max">
        <Button
          variant={selectedCategory === null ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="shrink-0 text-xs md:text-sm h-8 md:h-9 px-3 md:px-4"
          data-testid="button-category-all"
        >
          {t("homeCategoryBar.all")}
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="shrink-0 gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-9 px-2 md:px-4"
            data-testid={`button-category-${category}`}
          >
            {categoryIcons[category]}
            <span>{t(categoryTranslationKeys[category])}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
