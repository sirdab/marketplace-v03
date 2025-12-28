import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngBounds } from "leaflet";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Property } from "@shared/schema";
import "leaflet/dist/leaflet.css";

const CITY_COORDINATES: Record<string, [number, number]> = {
  "Riyadh": [24.7136, 46.6753],
  "Jeddah": [21.4858, 39.1925],
  "Dammam": [26.4207, 50.0888],
  "Al Khobar": [26.2794, 50.2083],
  "Al Ahsa": [25.3494, 49.5875],
  "Abha": [18.2164, 42.5053],
  "Buraydah": [26.3292, 43.9618],
};

const DEFAULT_CENTER: [number, number] = [24.7136, 46.6753];
const DEFAULT_ZOOM = 6;

const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

function getPropertyCoordinates(property: Property): [number, number] {
  const cityCoords = CITY_COORDINATES[property.city];
  if (cityCoords) {
    const hash = hashCode(property.id);
    const latOffset = ((hash % 1000) / 10000) - 0.05;
    const lngOffset = (((hash >> 10) % 1000) / 10000) - 0.05;
    return [cityCoords[0] + latOffset, cityCoords[1] + lngOffset];
  }
  return DEFAULT_CENTER;
}

interface MapBoundsUpdaterProps {
  coordinates: [number, number][];
}

function MapBoundsUpdater({ coordinates }: MapBoundsUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length === 0) return;

    const bounds = new LatLngBounds(coordinates);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  }, [coordinates, map]);

  return null;
}

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string;
  onPropertySelect?: (propertyId: string) => void;
}

export function PropertyMap({ properties, selectedPropertyId, onPropertySelect }: PropertyMapProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const propertyCoordinates = useMemo(() => {
    return properties.map((property) => ({
      property,
      coordinates: getPropertyCoordinates(property),
    }));
  }, [properties]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isArabic ? "ar-SA" : "en-SA", {
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (properties.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
        <p className="text-muted-foreground">{t("common.noResults")}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-md overflow-hidden border">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsUpdater coordinates={propertyCoordinates.map(pc => pc.coordinates)} />
        {propertyCoordinates.map(({ property, coordinates }) => (
          <Marker
            key={property.id}
            position={coordinates}
            icon={customIcon}
            eventHandlers={{
              click: () => onPropertySelect?.(property.id),
            }}
          >
            <Popup>
              <div className="min-w-[200px] max-w-[280px]">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-24 object-cover rounded-md mb-2"
                />
                <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                  {property.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {property.district}, {property.city}
                </p>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
                    {formatPrice(property.price)} {t("property.sar")}
                    <span className="opacity-80 font-normal ms-1">
                      {property.priceUnit === "day" 
                        ? t("common.perDay") 
                        : property.priceUnit === "month" 
                          ? t("common.perMonth") 
                          : t("common.perYear")}
                    </span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {property.size} {t("common.sqm")}
                  </span>
                </div>
                <Link href={`/property/${property.id}`}>
                  <Button size="sm" className="w-full" data-testid={`button-map-view-${property.id}`}>
                    {t("common.viewDetails")}
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
