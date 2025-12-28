import { useState } from "react";
import { useParams, useSearch, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  MapPin,
  Ruler,
  CheckCircle,
  Heart,
  Share2,
  ArrowLeft,
  Calendar,
  Phone,
  Building2,
  Clock,
  Shield,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisitScheduler } from "@/components/VisitScheduler";
import { BookingForm } from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  type Property,
  type PropertyCategory,
} from "@shared/schema";

export default function PropertyDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialAction = params.get("action") === "visit" ? "visit" : "details";
  
  const [activeTab, setActiveTab] = useState(initialAction);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const categoryTranslationKeys: Record<PropertyCategory, string> = {
    "warehouse": "warehouse",
    "workshop": "workshop",
    "storage": "storage",
    "storefront-long": "storefrontLong",
  };

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ["/api/properties", id],
    enabled: !!id,
  });

  const visitMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/visits", {
        ...data,
        propertyId: id,
        visitDate: format(data.visitDate, "yyyy-MM-dd"),
      });
    },
    onSuccess: () => {
      toast({
        title: t("visit.scheduled"),
        description: t("visit.scheduledDesc"),
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("visit.failedToSchedule"),
        variant: "destructive",
      });
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/bookings", {
        ...data,
        propertyId: id,
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(data.endDate, "yyyy-MM-dd"),
      });
    },
    onSuccess: () => {
      toast({
        title: t("booking.submitted"),
        description: t("booking.submittedDesc"),
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("booking.failedToSubmit"),
        variant: "destructive",
      });
    },
  });

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

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">{t("property.notFound")}</h1>
            <p className="text-muted-foreground mb-4">
              {t("property.notFoundDesc")}
            </p>
            <Link href="/properties">
              <Button>{t("nav.browseProperties")}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat(i18n.language === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(property.price);

  const priceLabel = property.priceUnit === "day" 
    ? t("common.perDay") 
    : property.priceUnit === "month" 
      ? t("common.perMonth") 
      : t("common.perYear");
  const categoryKey = categoryTranslationKeys[property.category as PropertyCategory];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6">
          <Link href="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 md:mb-6 text-sm md:text-base">
            <ArrowLeft className="h-4 w-4" />
            {t("property.backToProperties")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div className="relative aspect-[4/3] md:aspect-video rounded-lg overflow-hidden">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.isVerified && (
                  <Badge
                    variant="secondary"
                    className="absolute top-3 start-3 bg-background/90 backdrop-blur-sm gap-1"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    {t("property.verified")}
                  </Badge>
                )}
                <div className="absolute top-3 end-3 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-background/90 backdrop-blur-sm h-8 w-8 md:h-9 md:w-9"
                    onClick={() => setIsSaved(!isSaved)}
                    data-testid="button-save-property"
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
              </div>

              <div>
                <p className="font-bold text-xl md:text-2xl lg:text-3xl mb-1">
                  {formattedPrice}
                  <span className="text-muted-foreground font-normal text-sm md:text-base ms-2">{priceLabel}</span>
                </p>
                <h1 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2" data-testid="text-property-title">
                  {property.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-muted-foreground text-sm md:text-base">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span>{property.district}, {property.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span>{property.size} {t("common.sqm")}</span>
                  </div>
                  <Badge variant="outline" className="text-xs md:text-sm">
                    {t(`categories.${categoryKey}`)}
                  </Badge>
                  {property.subType && (
                    <Badge variant="outline" className="text-xs md:text-sm">{property.subType}</Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-base md:text-xl font-semibold mb-2 md:mb-3">{t("property.description")}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {property.description}
                </p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-base md:text-xl font-semibold mb-2 md:mb-3">{t("property.amenities")}</h2>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {property.amenities.map((amenity, i) => (
                        <Badge key={i} variant="secondary" className="text-xs md:text-sm">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <h2 className="text-base md:text-xl font-semibold mb-2 md:mb-3">{t("property.location")}</h2>
                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start gap-2 md:gap-3">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm md:text-base">{property.location}</p>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          {property.district}, {property.city}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:hidden space-y-6">
                <Separator />
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1">{t("tabs.details")}</TabsTrigger>
                    <TabsTrigger value="visit" className="flex-1">{t("tabs.visit")}</TabsTrigger>
                    <TabsTrigger value="book" className="flex-1">{t("tabs.book")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {t("property.details")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">{t("property.size")}</p>
                            <p className="font-medium">{property.size} {t("common.sqm")}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t("property.category")}</p>
                            <p className="font-medium">
                              {t(`categories.${categoryKey}`)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t("property.price")}</p>
                            <p className="font-medium">
                              {formattedPrice} {priceLabel}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t("property.availability")}</p>
                            <p className="font-medium">
                              {property.isAvailable ? t("property.available") : t("property.unavailable")}
                            </p>
                          </div>
                        </div>
                        {property.ownerPhone && (
                          <Button className="w-full gap-2" variant="outline">
                            <Phone className="h-4 w-4" />
                            {t("property.contactOwner")}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="visit" className="mt-4">
                    <VisitScheduler
                      property={property}
                      onSubmit={async (data) => {
                        await visitMutation.mutateAsync(data);
                      }}
                      isSubmitting={visitMutation.isPending}
                    />
                  </TabsContent>
                  <TabsContent value="book" className="mt-4">
                    <BookingForm
                      property={property}
                      onSubmit={async (data) => {
                        await bookingMutation.mutateAsync(data);
                      }}
                      isSubmitting={bookingMutation.isPending}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="hidden lg:block space-y-6">
              <div className="sticky top-20">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {formattedPrice}
                      <span className="text-base font-normal text-muted-foreground">
                        {priceLabel}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <span>{property.size} {t("common.sqm")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{property.subType || t(`categories.${categoryKey}`)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{property.isAvailable ? t("property.availableNow") : t("property.unavailable")}</span>
                      </div>
                      {property.isVerified && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">{t("property.verified")}</span>
                        </div>
                      )}
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Button
                        className="w-full gap-2"
                        onClick={() => setActiveTab("visit")}
                        data-testid="button-schedule-visit-desktop"
                      >
                        <Calendar className="h-4 w-4" />
                        {t("property.scheduleVisit")}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setActiveTab("book")}
                        data-testid="button-book-space-desktop"
                      >
                        {t("property.bookThisSpace")}
                      </Button>
                    </div>
                    {property.ownerPhone && (
                      <>
                        <Separator />
                        <Button variant="ghost" className="w-full gap-2">
                          <Phone className="h-4 w-4" />
                          {t("property.contactOwner")}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                {activeTab === "visit" && (
                  <VisitScheduler
                    property={property}
                    onSubmit={async (data) => {
                      await visitMutation.mutateAsync(data);
                    }}
                    isSubmitting={visitMutation.isPending}
                  />
                )}

                {activeTab === "book" && (
                  <BookingForm
                    property={property}
                    onSubmit={async (data) => {
                      await bookingMutation.mutateAsync(data);
                    }}
                    isSubmitting={bookingMutation.isPending}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
