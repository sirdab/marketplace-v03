import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Ruler,
  CheckCircle,
  ArrowLeft,
  Phone,
  Building2,
  Calendar,
  Shield,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Ad } from "@shared/schema";

export default function AdDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const isRTL = i18n.language === "ar";

  const { data: ad, isLoading, error } = useQuery<Ad>({
    queryKey: ["/api/public/ads", id],
    enabled: !!id,
  });

  const formatPrice = (price: string | null) => {
    if (!price) return t("common.contactForPrice");
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="aspect-video rounded-lg" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div>
                <Skeleton className="h-96 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">{t("common.notFound")}</h1>
            <p className="text-muted-foreground mb-6">{t("ads.notFoundMessage")}</p>
            <Link href="/properties">
              <Button data-testid="button-back-to-properties">
                <ArrowLeft className="h-4 w-4 me-2" />
                {t("common.backToProperties")}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = ad.images || [];
  const mainImage = images[0] || "/placeholder-property.jpg";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Link href="/properties">
            <Button variant="ghost" className="mb-6" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 me-2" />
              {t("common.back")}
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={mainImage}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  data-testid="img-ad-main"
                />
                {ad.verified && (
                  <Badge className="absolute top-4 end-4" variant="secondary">
                    <CheckCircle className="h-3 w-3 me-1" />
                    {t("common.verified")}
                  </Badge>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.slice(1, 5).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${ad.title} ${index + 2}`}
                      className="h-20 w-32 object-cover rounded-md flex-shrink-0"
                      data-testid={`img-ad-thumbnail-${index}`}
                    />
                  ))}
                </div>
              )}

              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-ad-title">
                  {ad.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span data-testid="text-ad-location">
                    {ad.district}, {ad.city}
                  </span>
                </div>
                <Badge variant="outline" data-testid="badge-ad-type">
                  {ad.type || t("categories.warehouse")}
                </Badge>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-semibold mb-3">{t("common.description")}</h2>
                <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-ad-description">
                  {ad.description}
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-semibold mb-4">{t("common.features")}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ad.areaInM2 && (
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span data-testid="text-ad-area">{ad.areaInM2} m²</span>
                    </div>
                  )}
                  {ad.municipalityLicense && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>{t("features.municipalityLicense")}</span>
                    </div>
                  )}
                  {ad.civilDefenseLicense && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>{t("features.civilDefenseLicense")}</span>
                    </div>
                  )}
                  {ad.availableDateFrom && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{t("common.availableFrom")}: {ad.availableDateFrom}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 flex-wrap">
                    <Building2 className="h-5 w-5" />
                    {t("common.pricing")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold" data-testid="text-ad-price">
                      {formatPrice(ad.price)}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {ad.paymentTerm === "monthly" ? t("common.perMonth") : t("common.perYear")}
                    </p>
                  </div>
                  <Separator />
                  {ad.phoneNumber && (
                    <Button className="w-full" size="lg" data-testid="button-contact">
                      <Phone className="h-4 w-4 me-2" />
                      {t("common.contact")}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {ad.lat && ad.lng && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 flex-wrap">
                      <MapPin className="h-5 w-5" />
                      {t("common.location")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        {ad.address || `${ad.district}, ${ad.city}`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
