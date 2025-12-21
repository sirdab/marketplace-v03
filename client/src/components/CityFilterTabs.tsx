import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const cities = [
  { key: "riyadh", slug: "riyadh" },
  { key: "jeddah", slug: "jeddah" },
  { key: "dammam", slug: "dammam" },
  { key: "alKhobar", slug: "al-khobar" },
  { key: "alAhsa", slug: "al-ahsa" },
  { key: "abha", slug: "abha" },
  { key: "buraydah", slug: "buraydah" },
];

interface CityFilterTabsProps {
  selectedCity?: string;
}

export function CityFilterTabs({ selectedCity }: CityFilterTabsProps) {
  const { t } = useTranslation();
  
  return (
    <section className="py-6 border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 flex-1">
            {cities.map((city) => (
              <Link key={city.slug} href={`/properties?city=${t(`cities.${city.key}`)}`}>
                <Button
                  variant={selectedCity === t(`cities.${city.key}`) ? "secondary" : "ghost"}
                  size="sm"
                  className="shrink-0"
                  data-testid={`button-city-${city.slug}`}
                >
                  {t('cities.warehousesIn')} {t(`cities.${city.key}`)}
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
