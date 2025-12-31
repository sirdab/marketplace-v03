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
  const isRTL = t('dir') === 'rtl';

  return (
    <div className="border-b bg-background">
      <div className="max-w-7xl mx-auto">
        <div className={`flex items-center py-2 md:py-3 overflow-x-auto scrollbar-hide ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-1 px-3 md:px-6 lg:px-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {categories.map(({ value, icon: Icon, labelKey }) => (
              <Button
                key={value}
                variant={selectedCategory === value ? "secondary" : "ghost"}
                size="sm"
                className={`gap-1.5 md:gap-2 whitespace-nowrap shrink-0 text-xs md:text-sm h-8 md:h-9 px-2.5 md:px-4 flex ${isRTL ? 'flex-row-reverse' : ''}`}
                onClick={() => onCategoryChange(value)}
                data-testid={`button-category-${value}`}
              >
                <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                <span className="hidden sm:inline">{t(labelKey)}</span>
                <span className="sm:hidden">{t(labelKey).split(' ')[0]}</span>
              </Button>
            ))}
            <Button
              variant={selectedCategory === "all" ? "secondary" : "ghost"}
              size="sm"
              className={`gap-1.5 md:gap-2 whitespace-nowrap shrink-0 text-xs md:text-sm h-8 md:h-9 px-2.5 md:px-4 flex ${isRTL ? 'flex-row-reverse' : ''}`}
              onClick={() => onCategoryChange("all")}
              data-testid="button-category-all"
            >
              <LayoutGrid className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
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
    <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6">
      <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold" data-testid="text-category-heading">
        {getCategoryLabel()} {t("homeCategoryBar.in")} {t(`cities.${city}`)}
      </h2>
    </div>
  );
}
