import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const cities = [
  { name: "Riyadh", slug: "riyadh" },
  { name: "Jeddah", slug: "jeddah" },
  { name: "Dammam", slug: "dammam" },
  { name: "Al Khobar", slug: "al-khobar" },
  { name: "Al Ahsa", slug: "al-ahsa" },
  { name: "Abha", slug: "abha" },
  { name: "Buraydah", slug: "buraydah" },
];

interface CityFilterTabsProps {
  selectedCity?: string;
}

export function CityFilterTabs({ selectedCity }: CityFilterTabsProps) {
  return (
    <section className="py-6 border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 flex-1">
            {cities.map((city) => (
              <Link key={city.slug} href={`/properties?city=${city.name}`}>
                <Button
                  variant={selectedCity === city.name ? "secondary" : "ghost"}
                  size="sm"
                  className="shrink-0"
                  data-testid={`button-city-${city.slug}`}
                >
                  Warehouses in {city.name}
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
