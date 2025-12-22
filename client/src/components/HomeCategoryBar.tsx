import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Warehouse, Wrench, Package, Store, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type PropertyCategory } from "@shared/schema";

type HomeCategoryOption = "warehouse" | "workshop" | "storage" | "storefront-long" | "all";

interface HomeCategoryBarProps {
  selectedCategory: HomeCategoryOption;
  onCategoryChange: (category: HomeCategoryOption) => void;
}

const categories: { value: HomeCategoryOption; icon: typeof Warehouse; labelKey: string }[] = [
  { value: "warehouse", icon: Warehouse, labelKey: "homeCategoryBar.warehouses" },
  { value: "workshop", icon: Wrench, labelKey: "homeCategoryBar.workshops" },
  { value: "storage", icon: Package, labelKey: "homeCategoryBar.selfStorage" },
  { value: "storefront-long", icon: Store, labelKey: "homeCategoryBar.longTermStorefronts" },
];

export function HomeCategoryBar({ selectedCategory, onCategoryChange }: HomeCategoryBarProps) {
  const { t } = useTranslation();

  return (
    <div className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 py-3">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {categories.map(({ value, icon: Icon, labelKey }) => (
              <Button
                key={value}
                variant={selectedCategory === value ? "secondary" : "ghost"}
                className="gap-2 whitespace-nowrap shrink-0"
                onClick={() => onCategoryChange(value)}
                data-testid={`button-category-${value}`}
              >
                <Icon className="h-4 w-4" />
                {t(labelKey)}
              </Button>
            ))}
            <Button
              variant={selectedCategory === "all" ? "secondary" : "ghost"}
              className="gap-2 whitespace-nowrap shrink-0"
              onClick={() => onCategoryChange("all")}
              data-testid="button-category-all"
            >
              <LayoutGrid className="h-4 w-4" />
              {t("homeCategoryBar.all")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryHeading({ category, city = "riyadh" }: { category: HomeCategoryOption; city?: string }) {
  const { t } = useTranslation();

  const getCategoryLabel = () => {
    switch (category) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      <h2 className="text-2xl md:text-3xl font-semibold" data-testid="text-category-heading">
        {getCategoryLabel()} {t("homeCategoryBar.in")} {t(`cities.${city}`)}
      </h2>
    </div>
  );
}
