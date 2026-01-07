import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  Calendar,
  CreditCard,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Plus,
  Pencil,
  ExternalLink,
  LayoutDashboard,
  Megaphone,
  Eye,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { queryClient, apiRequest, fetchWithAuth } from "@/lib/queryClient";
import { type Visit, type Booking, type Property, type Ad } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  
  const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode }> = {
    pending: { variant: "secondary", icon: <Clock className="h-3 w-3" /> },
    confirmed: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
    completed: { variant: "outline", icon: <CheckCircle className="h-3 w-3" /> },
    cancelled: { variant: "destructive", icon: <AlertCircle className="h-3 w-3" /> },
    active: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  };

  const config = variants[status] || variants.pending;

  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {t(`status.${status}`)}
    </Badge>
  );
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isRTL = i18n.language === "ar";
  const dateLocale = isRTL ? ar : enUS;
  
  const { data: visits = [], isLoading: visitsLoading } = useQuery<Visit[]>({
    queryKey: ["/api/visits"],
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: ads = [], isLoading: adsLoading } = useQuery<Ad[]>({
    queryKey: ["/api/my-ads"],
    queryFn: async () => {
      const response = await fetchWithAuth("/api/my-ads");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch ads");
      }
      return response.json();
    },
    enabled: !!user?.id,
  });

  const updateAdMutation = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      return apiRequest("PATCH", `/api/ads/${id}`, { published });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-ads"] });
      toast({
        title: variables.published ? t("myAds.publishSuccess") : t("myAds.unpublishSuccess"),
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: t("myAds.updateError"),
      });
    },
  });

  const getProperty = (propertyId: string) =>
    properties.find((p) => p.id === propertyId);

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "-";
    try {
      const date = typeof dateString === "string" ? new Date(dateString) : dateString;
      return format(date, "dd MMM yyyy", { locale: dateLocale });
    } catch {
      return "-";
    }
  };

  const upcomingVisits = visits.filter(
    (v) => v.status === "pending" || v.status === "confirmed"
  );

  const activeBookings = bookings.filter(
    (b) => b.status === "active" || b.status === "confirmed"
  );

  const publishedAds = ads.filter((a) => a.published);

  const stats = [
    {
      labelKey: "myListings",
      value: ads.length,
      activeValue: publishedAds.length,
      icon: <Megaphone className="h-5 w-5" />,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      labelKey: "scheduledVisits",
      value: visits.length,
      activeValue: upcomingVisits.length,
      icon: <Eye className="h-5 w-5" />,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      labelKey: "totalBookings",
      value: bookings.length,
      activeValue: activeBookings.length,
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  const handleTogglePublished = (ad: Ad) => {
    updateAdMutation.mutate({ id: ad.id, published: !ad.published });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">{t("dashboard.title")}</h1>
                <p className="text-muted-foreground text-sm">{t("dashboard.subtitle")}</p>
              </div>
            </div>
            <Link href="/ads/new">
              <Button data-testid="button-create-ad">
                <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t("myAds.createAd")}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="overflow-visible">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{t(`dashboard.${stat.labelKey}`)}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{stat.value}</p>
                        {stat.activeValue > 0 && stat.activeValue !== stat.value && (
                          <span className="text-sm text-muted-foreground">
                            ({stat.activeValue} {t("dashboard.active")})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="ads" className="space-y-6">
            <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex">
              <TabsTrigger value="ads" className="gap-2" data-testid="tab-ads">
                <Megaphone className="h-4 w-4" />
                <span className="hidden sm:inline">{t("dashboard.myAds")}</span>
              </TabsTrigger>
              <TabsTrigger value="visits" className="gap-2" data-testid="tab-visits">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">{t("dashboard.visits")}</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2" data-testid="tab-bookings">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">{t("dashboard.bookings")}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ads">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                  <CardTitle className="text-lg">{t("myAds.title")}</CardTitle>
                  <Link href="/ads/new">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      {t("myAds.createAd")}
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {adsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : ads.length === 0 ? (
                    <div className="text-center py-12">
                      <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">{t("myAds.noAds")}</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        {t("myAds.noAdsDesc")}
                      </p>
                      <Link href="/ads/new">
                        <Button data-testid="button-create-first-ad">
                          <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                          {t("myAds.createAd")}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ads.map((ad) => (
                        <div
                          key={ad.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg hover-elevate"
                          data-testid={`row-ad-${ad.id}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate">{ad.title}</h4>
                              <Link href={`/property/${ad.id}`}>
                                <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </Link>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {ad.district !== "-" ? `${ad.district}, ` : ""}
                              {ad.city !== "-" ? ad.city : "-"}
                              {" - "}
                              {formatDate(ad.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={ad.published}
                                onCheckedChange={() => handleTogglePublished(ad)}
                                disabled={updateAdMutation.isPending}
                                data-testid={`switch-published-${ad.id}`}
                              />
                              <Badge
                                variant={ad.published ? "default" : "secondary"}
                                className="text-xs shrink-0"
                              >
                                {ad.published ? t("myAds.active") : t("myAds.inactive")}
                              </Badge>
                            </div>
                            <Link href={`/ads/${ad.id}/edit`}>
                              <Button size="sm" variant="outline" data-testid={`button-edit-ad-${ad.id}`}>
                                <Pencil className="h-3 w-3 ltr:mr-1 rtl:ml-1" />
                                {t("myAds.edit")}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visits">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                  <CardTitle className="text-lg">{t("dashboard.upcomingVisits")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {visitsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : visits.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">{t("dashboard.noVisitsTitle")}</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{t("dashboard.noUpcomingVisits")}</p>
                      <Link href="/properties">
                        <Button>{t("nav.browseProperties")}</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {visits.map((visit) => {
                        const property = getProperty(visit.propertyId);
                        return (
                          <div
                            key={visit.id}
                            className="flex items-center gap-4 p-4 border rounded-lg hover-elevate"
                            data-testid={`visit-item-${visit.id}`}
                          >
                            {property && (
                              <img
                                src={property.imageUrl}
                                alt={property.title}
                                className="w-16 h-16 rounded-lg object-cover shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {property?.title || "Property"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {visit.visitDate} {t("common.at")} {visit.visitTime}
                              </p>
                            </div>
                            <StatusBadge status={visit.status} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                  <CardTitle className="text-lg">{t("dashboard.activeBookings")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">{t("dashboard.noBookingsTitle")}</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{t("dashboard.noActiveBookings")}</p>
                      <Link href="/properties">
                        <Button>{t("nav.browseProperties")}</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.map((booking) => {
                        const property = getProperty(booking.propertyId);
                        const formattedTotal = new Intl.NumberFormat(i18n.language === "ar" ? "ar-SA" : "en-SA", {
                          style: "currency",
                          currency: "SAR",
                          maximumFractionDigits: 0,
                        }).format(booking.totalPrice);

                        return (
                          <div
                            key={booking.id}
                            className="flex items-center gap-4 p-4 border rounded-lg hover-elevate"
                            data-testid={`booking-item-${booking.id}`}
                          >
                            {property && (
                              <img
                                src={property.imageUrl}
                                alt={property.title}
                                className="w-16 h-16 rounded-lg object-cover shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {property?.title || "Property"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {booking.startDate} - {booking.endDate}
                              </p>
                            </div>
                            <div className="text-end shrink-0">
                              <p className="font-semibold">{formattedTotal}</p>
                              <StatusBadge status={booking.status} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
