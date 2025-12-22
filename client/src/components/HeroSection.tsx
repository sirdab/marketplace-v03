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
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto">
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
            className="bg-white rounded-full p-2 flex flex-col md:flex-row items-center gap-2 shadow-xl"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-11 h-12 border-0 bg-transparent focus-visible:ring-0 text-foreground text-lg"
                data-testid="input-hero-search"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-border" />

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger
                className="w-full md:w-48 h-12 border-0 bg-transparent focus:ring-0 shadow-none text-foreground text-lg"
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
              className="h-12 px-10 rounded-full gap-2 text-lg font-semibold"
              data-testid="button-hero-search"
            >
              {t('common.search')}
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>{t('hero.verifiedListings')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span>{t('hero.instantBooking')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span>{t('hero.trustedSMEs')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
