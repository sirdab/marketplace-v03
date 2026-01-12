import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

export const cities = [
  { key: 'riyadh', slug: 'Riyadh' },
  { key: 'jeddah', slug: 'Jeddah' },
  { key: 'dammam', slug: 'Dammam' },
  { key: 'alKhobar', slug: 'Al Khobar' },
  { key: 'alAhsa', slug: 'Al Ahsa' },
  { key: 'abha', slug: 'Abha' },
  { key: 'buraydah', slug: 'Buraydah' },
];

interface CityFilterTabsProps {
  selectedCity?: string;
  category?: string;
  onCityChange?: (city: string | undefined) => void;
}

export function CityFilterTabs({
  selectedCity,
  category = 'warehouse',
  onCityChange,
}: CityFilterTabsProps) {
  const { t } = useTranslation();

  const handleCityClick = (citySlug: string) => {
    if (onCityChange) {
      onCityChange(selectedCity === citySlug ? undefined : citySlug);
    }
  };

  return (
    <section className="py-2 md:py-4 border-b bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto pb-1 -mb-1 flex-1 scrollbar-hide px-3 md:px-6 lg:px-8">
            {cities.map((city) =>
              onCityChange ? (
                <Button
                  key={city.slug}
                  variant={selectedCity === city.slug ? 'secondary' : 'outline'}
                  size="sm"
                  className="shrink-0 text-xs md:text-sm h-7 md:h-8 px-2 md:px-3 rounded-full"
                  onClick={() => handleCityClick(city.slug)}
                  data-testid={`button-city-${city.key}`}
                >
                  {t(`cities.${city.key}`)}
                </Button>
              ) : (
                <Link key={city.slug} href={`/properties?city=${city.slug}&category=${category}`}>
                  <Button
                    variant={selectedCity === city.slug ? 'secondary' : 'outline'}
                    size="sm"
                    className="shrink-0 text-xs md:text-sm h-7 md:h-8 px-2 md:px-3 rounded-full"
                    data-testid={`button-city-${city.key}`}
                  >
                    {t(`cities.${city.key}`)}
                  </Button>
                </Link>
              )
            )}
          </div>
          <div className="pe-3 md:pe-6 lg:pe-8 shrink-0">
            <Link href="/properties">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 md:h-9 md:w-9"
                data-testid="button-all-filters"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
