import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import {
  Calendar,
  CreditCard,
  Heart,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { type Visit, type Booking, type Property } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode }> = {
    pending: { variant: "secondary", icon: <Clock className="h-3 w-3" /> },
    confirmed: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
    completed: { variant: "outline", icon: <CheckCircle className="h-3 w-3" /> },
    cancelled: { variant: "destructive", icon: <AlertCircle className="h-3 w-3" /> },
    active: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  };

  const config = variants[status] || variants.pending;

  return (
    <Badge variant={config.variant} className="gap-1 capitalize">
      {config.icon}
      {status}
    </Badge>
  );
}

export default function Dashboard() {
  const { data: visits = [], isLoading: visitsLoading } = useQuery<Visit[]>({
    queryKey: ["/api/visits"],
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const getProperty = (propertyId: string) =>
    properties.find((p) => p.id === propertyId);

  const upcomingVisits = visits.filter(
    (v) => v.status === "pending" || v.status === "confirmed"
  ).slice(0, 3);

  const activeBookings = bookings.filter(
    (b) => b.status === "active" || b.status === "confirmed"
  ).slice(0, 3);

  const stats = [
    {
      label: "Scheduled Visits",
      value: visits.filter((v) => v.status !== "cancelled").length,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Active Bookings",
      value: bookings.filter((b) => b.status === "active").length,
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: <Building2 className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your visits, bookings, and saved properties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-semibold mt-1">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="visits" className="space-y-6">
            <TabsList>
              <TabsTrigger value="visits" className="gap-2">
                <Calendar className="h-4 w-4" />
                Visits
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Bookings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visits">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle>Upcoming Visits</CardTitle>
                  <Link href="/visits">
                    <Button variant="ghost" size="sm" className="gap-2">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {visitsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : upcomingVisits.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No upcoming visits</p>
                      <Link href="/properties">
                        <Button>Browse Properties</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingVisits.map((visit) => {
                        const property = getProperty(visit.propertyId);
                        return (
                          <div
                            key={visit.id}
                            className="flex items-center gap-4 p-4 border rounded-md"
                            data-testid={`visit-item-${visit.id}`}
                          >
                            {property && (
                              <img
                                src={property.imageUrl}
                                alt={property.title}
                                className="w-16 h-16 rounded-md object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {property?.title || "Property"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {visit.visitDate} at {visit.visitTime}
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
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle>Active Bookings</CardTitle>
                  <Link href="/bookings">
                    <Button variant="ghost" size="sm" className="gap-2">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : activeBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No active bookings</p>
                      <Link href="/properties">
                        <Button>Browse Properties</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeBookings.map((booking) => {
                        const property = getProperty(booking.propertyId);
                        const formattedTotal = new Intl.NumberFormat("en-SA", {
                          style: "currency",
                          currency: "SAR",
                          maximumFractionDigits: 0,
                        }).format(booking.totalPrice);

                        return (
                          <div
                            key={booking.id}
                            className="flex items-center gap-4 p-4 border rounded-md"
                            data-testid={`booking-item-${booking.id}`}
                          >
                            {property && (
                              <img
                                src={property.imageUrl}
                                alt={property.title}
                                className="w-16 h-16 rounded-md object-cover"
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
                            <div className="text-right">
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
