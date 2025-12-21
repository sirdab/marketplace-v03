import { useState } from "react";
import { useParams, useSearch, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  categoryLabels,
  type PropertyCategory,
} from "@shared/schema";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialAction = params.get("action") === "visit" ? "visit" : "details";
  
  const [activeTab, setActiveTab] = useState(initialAction);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

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
        title: "Visit Scheduled",
        description: "You will receive a confirmation email shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule visit. Please try again.",
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
        title: "Booking Submitted",
        description: "We'll contact you to confirm the booking.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
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
            <h1 className="text-2xl font-semibold mb-2">Property Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(property.price);

  const priceLabel = property.priceUnit === "day" ? "/day" : "/month";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Link href="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to properties
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm font-semibold text-lg px-3 py-1">
                    {formattedPrice}
                    <span className="text-muted-foreground font-normal text-sm">{priceLabel}</span>
                  </Badge>
                </div>
                {property.isVerified && (
                  <Badge
                    variant="secondary"
                    className="absolute top-4 right-16 bg-background/90 backdrop-blur-sm gap-1"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    Verified
                  </Badge>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-background/90 backdrop-blur-sm"
                    onClick={() => setIsSaved(!isSaved)}
                    data-testid="button-save-property"
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-semibold mb-2" data-testid="text-property-title">
                  {property.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{property.district}, {property.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    <span>{property.size} sqm</span>
                  </div>
                  <Badge variant="outline">
                    {categoryLabels[property.category as PropertyCategory]}
                  </Badge>
                  {property.subType && (
                    <Badge variant="outline">{property.subType}</Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, i) => (
                        <Badge key={i} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-3">Location</h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{property.location}</p>
                        <p className="text-muted-foreground text-sm">
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
                    <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                    <TabsTrigger value="visit" className="flex-1">Schedule Visit</TabsTrigger>
                    <TabsTrigger value="book" className="flex-1">Book Space</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Property Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Size</p>
                            <p className="font-medium">{property.size} sqm</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Category</p>
                            <p className="font-medium">
                              {categoryLabels[property.category as PropertyCategory]}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-medium">
                              {formattedPrice} {priceLabel}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Availability</p>
                            <p className="font-medium">
                              {property.isAvailable ? "Available" : "Not Available"}
                            </p>
                          </div>
                        </div>
                        {property.ownerPhone && (
                          <Button className="w-full gap-2" variant="outline">
                            <Phone className="h-4 w-4" />
                            Contact Owner
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
                        <span>{property.size} sqm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{property.subType || categoryLabels[property.category as PropertyCategory]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{property.isAvailable ? "Available Now" : "Unavailable"}</span>
                      </div>
                      {property.isVerified && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Verified</span>
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
                        Schedule Visit
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setActiveTab("book")}
                        data-testid="button-book-space-desktop"
                      >
                        Book This Space
                      </Button>
                    </div>
                    {property.ownerPhone && (
                      <>
                        <Separator />
                        <Button variant="ghost" className="w-full gap-2">
                          <Phone className="h-4 w-4" />
                          Contact Owner
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
