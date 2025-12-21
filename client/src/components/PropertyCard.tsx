import { Link } from "wouter";
import { MapPin, Ruler, Heart, CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Property, categoryLabels, type PropertyCategory } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  isSaved?: boolean;
  onToggleSave?: (propertyId: string) => void;
}

export function PropertyCard({ property, isSaved = false, onToggleSave }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-SA", {
    maximumFractionDigits: 0,
  }).format(property.price);

  const priceUnitLabels: Record<string, string> = {
    day: "/day",
    month: "/month",
    year: "/year",
  };
  const priceLabel = priceUnitLabels[property.priceUnit] || "/month";

  return (
    <Card className="group overflow-hidden hover-elevate" data-testid={`card-property-${property.id}`}>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-primary text-primary-foreground font-semibold px-3 py-1">
            {formattedPrice} SR
            <span className="opacity-80 font-normal ml-1">{priceLabel}</span>
          </Badge>
        </div>
        {property.isVerified && (
          <div className="absolute top-3 right-12">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              Verified
            </Badge>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm ${
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
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg line-clamp-1" data-testid={`text-title-${property.id}`}>
            {property.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{property.district}, {property.city}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="gap-1">
            <Ruler className="h-3 w-3" />
            {property.size} sqm
          </Badge>
          <Badge variant="outline">
            {categoryLabels[property.category as PropertyCategory]}
          </Badge>
          {property.subType && (
            <Badge variant="outline" className="text-muted-foreground">
              {property.subType}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/property/${property.id}`} className="flex-1">
            <Button variant="outline" className="w-full" data-testid={`button-view-${property.id}`}>
              View Details
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
