import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PurposeFilter } from "@/components/PurposeFilter";
import { type PropertyCategory, type PropertyPurpose } from "@shared/schema";
import coverImage from "@assets/Cover_Page_for_Sirdab_1767187345722.png";

const categories: PropertyCategory[] = [
  "warehouse",
  "workshop",
  "storage",
  "storefront-long",
];

export function HeroSection() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPurpose, setSelectedPurpose] = useState<PropertyPurpose | undefined>("rent");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedPurpose) params.set("purpose", selectedPurpose);
    setLocation(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${coverImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-3 md:px-6 lg:px-8 text-center py-8">
        <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-sm md:text-lg lg:text-xl text-white/90 mb-6 md:mb-10 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>

        <div className="max-w-4xl mx-auto">
          <PurposeFilter
            value={selectedPurpose}
            onChange={setSelectedPurpose}
            variant="hero"
          />

          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl md:rounded-full p-2 flex flex-col md:flex-row items-center gap-2 shadow-xl"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute start-3 md:start-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 md:ps-11 h-10 md:h-12 border-0 bg-transparent focus-visible:ring-0 text-foreground text-sm md:text-lg"
                data-testid="input-hero-search"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-border" />

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger
                className="w-full md:w-48 h-10 md:h-12 border-0 bg-transparent focus:ring-0 shadow-none text-foreground text-sm md:text-lg"
                data-testid="select-hero-category"
              >
                <SelectValue placeholder={t('hero.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('hero.allCategories')}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(`categories.${cat === 'storefront-long' ? 'storefrontLong' : cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto h-10 md:h-12 px-6 md:px-10 rounded-full gap-2 text-sm md:text-lg font-semibold"
              data-testid="button-hero-search"
            >
              {t('common.search')}
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-6 md:mt-8 text-white/80 text-xs md:text-sm">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400" />
            <span>{t('hero.verifiedListings')}</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-400" />
            <span>{t('hero.instantBooking')}</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-400" />
            <span>{t('hero.trustedSMEs')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
