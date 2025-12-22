import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const cities = [
  { key: "riyadh", slug: "Riyadh" },
  { key: "jeddah", slug: "Jeddah" },
  { key: "dammam", slug: "Dammam" },
  { key: "alKhobar", slug: "Al Khobar" },
  { key: "alAhsa", slug: "Al Ahsa" },
  { key: "abha", slug: "Abha" },
  { key: "buraydah", slug: "Buraydah" },
];

interface CityFilterTabsProps {
  selectedCity?: string;
  category?: string;
}

export function CityFilterTabs({ selectedCity, category = "warehouse" }: CityFilterTabsProps) {
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
      default:
        return t("homeCategoryBar.allProperties");
    }
  };

  const categoryLabel = getCategoryLabel();

  return (
    <section className="py-4 border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 flex-1 scrollbar-hide">
            {cities.map((city) => (
              <Link key={city.slug} href={`/properties?city=${city.slug}&category=${category}`}>
                <Button
                  variant={selectedCity === city.slug ? "secondary" : "ghost"}
                  size="sm"
                  className="shrink-0"
                  data-testid={`button-city-${city.key}`}
                >
                  {categoryLabel} {t("homeCategoryBar.in")} {t(`cities.${city.key}`)}
                </Button>
              </Link>
            ))}
          </div>
          <Link href="/properties">
            <Button variant="outline" size="icon" data-testid="button-all-filters">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
