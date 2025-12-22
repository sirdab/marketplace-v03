import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { MapPin, Ruler, Heart, CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Property, type PropertyCategory } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  isSaved?: boolean;
  onToggleSave?: (propertyId: string) => void;
}

export function PropertyCard({ property, isSaved = false, onToggleSave }: PropertyCardProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const formattedPrice = new Intl.NumberFormat(isArabic ? "ar-SA" : "en-SA", {
    maximumFractionDigits: 0,
  }).format(property.price);

  const priceLabel = property.priceUnit === 'day' ? t('common.perDay') : t('common.perMonth');

  return (
    <Card className="group overflow-hidden hover-elevate" data-testid={`card-property-${property.id}`}>
      <div className="relative aspect-[4/3] md:aspect-video overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {property.isVerified && (
          <Badge variant="secondary" className="absolute top-3 start-3 bg-background/90 backdrop-blur-sm gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            {t('property.verified')}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 end-2 bg-background/80 backdrop-blur-sm ${
            isSaved ? "text-red-500" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave?.(property.id);
          }}
          data-testid={`button-save-${property.id}`}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </Button>
      </div>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="font-bold text-lg md:text-xl text-foreground" data-testid={`text-price-${property.id}`}>
            {formattedPrice} {t('property.sar')}
            <span className="text-muted-foreground font-normal text-sm ms-1">{priceLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground text-sm mb-2">
          <span className="flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5" />
            {property.size} {t('common.sqm')}
          </span>
          <span className="text-xs px-2 py-0.5 bg-muted rounded">
            {t(`categories.${property.category === 'storefront-long' ? 'storefrontLong' : property.category === 'storefront-short' ? 'storefrontShort' : property.category}`)}
          </span>
        </div>
        <h3 className="font-medium text-sm md:text-base line-clamp-1 mb-1" data-testid={`text-title-${property.id}`}>
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-xs md:text-sm mb-3">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{property.district}, {property.city}</span>
        </div>
        <div className="flex gap-2">
          <Link href={`/property/${property.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs md:text-sm" data-testid={`button-view-${property.id}`}>
              {t('common.viewDetails')}
            </Button>
          </Link>
          <Link href={`/property/${property.id}?action=visit`}>
            <Button size="icon" variant="secondary" data-testid={`button-visit-${property.id}`}>
              <Calendar className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
