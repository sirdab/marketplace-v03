import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyGrid } from "./PropertyGrid";
import { type Property } from "@shared/schema";

interface FeaturedPropertiesProps {
  properties: Property[];
  isLoading?: boolean;
}

export function FeaturedProperties({ properties, isLoading }: FeaturedPropertiesProps) {
  const { t } = useTranslation();
  const featured = properties.filter((p) => p.isVerified).slice(0, 6);

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-2">
              {t("featured.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("featured.subtitle")}
            </p>
          </div>
          <Link href="/properties?verified=true" className="hidden sm:block">
            <Button variant="ghost" className="gap-2">
              {t("common.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <PropertyGrid
          properties={featured}
          isLoading={isLoading}
        />

        <div className="text-center mt-8 sm:hidden">
          <Link href="/properties?verified=true">
            <Button variant="outline" className="gap-2">
              {t("featured.viewAllFeatured")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
