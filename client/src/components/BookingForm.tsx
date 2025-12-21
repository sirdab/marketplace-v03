import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays, addDays, isBefore, startOfToday } from "date-fns";
import {
  Calendar,
  User,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { type Property } from "@shared/schema";

const bookingSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(9, "Valid phone number is required"),
  startDate: z.date({ required_error: "Please select a start date" }),
  endDate: z.date({ required_error: "Please select an end date" }),
  notes: z.string().optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  property: Property;
  onSubmit: (data: BookingFormData & { totalPrice: number; platformFee: number }) => Promise<void>;
  isSubmitting?: boolean;
}

export function BookingForm({ property, onSubmit, isSubmitting }: BookingFormProps) {
  const [step, setStep] = useState<"dates" | "details" | "confirm" | "success">("dates");

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
    },
  });

  const watchStartDate = form.watch("startDate");
  const watchEndDate = form.watch("endDate");

  const calculatePricing = () => {
    if (!watchStartDate || !watchEndDate) return null;
    
    const days = differenceInDays(watchEndDate, watchStartDate);
    if (days <= 0) return null;

    const isDaily = property.priceUnit === "day";
    const basePrice = isDaily
      ? property.price * days
      : Math.ceil(days / 30) * property.price;
    
    const platformFee = Math.round(basePrice * 0.05);
    const totalPrice = basePrice + platformFee;

    return { days, basePrice, platformFee, totalPrice };
  };

  const pricing = calculatePricing();

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleSubmit = async (data: BookingFormData) => {
    if (!pricing) return;
    await onSubmit({
      ...data,
      totalPrice: pricing.basePrice,
      platformFee: pricing.platformFee,
    });
    setStep("success");
  };

  if (step === "success") {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Booking Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              Your booking request for {property.title} has been submitted.
              We'll contact you shortly to confirm the details.
            </p>
            <Badge variant="secondary" className="mb-4">
              Booking Reference: SRD-{Date.now().toString(36).toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Book This Space
        </CardTitle>
        <div className="flex gap-2 mt-2">
          {["dates", "details", "confirm"].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                ["dates", "details", "confirm"].indexOf(step) >= i
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {step === "dates" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                                data-testid="button-start-date"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Select start date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => isBefore(date, startOfToday())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                                data-testid="button-end-date"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Select end date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                isBefore(date, watchStartDate || startOfToday())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {pricing && (
                  <div className="bg-muted/50 rounded-md p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Duration</span>
                      <span className="font-medium">{pricing.days} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Base Price</span>
                      <span>{formattedPrice(pricing.basePrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Platform Fee (5%)</span>
                      <span>{formattedPrice(pricing.platformFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formattedPrice(pricing.totalPrice)}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === "details" && (
              <>
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Your name"
                            className="pl-10"
                            {...field}
                            data-testid="input-customer-name"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="pl-10"
                              {...field}
                              data-testid="input-customer-email"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="tel"
                              placeholder="+966 5XX XXX XXXX"
                              className="pl-10"
                              {...field}
                              data-testid="input-customer-phone"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requirements..."
                          className="resize-none"
                          {...field}
                          data-testid="textarea-booking-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === "confirm" && pricing && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-md p-4">
                  <h4 className="font-medium mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property</span>
                      <span className="font-medium">{property.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Period</span>
                      <span>
                        {format(watchStartDate, "MMM d")} -{" "}
                        {format(watchEndDate, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{pricing.days} days</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Price</span>
                      <span>{formattedPrice(pricing.basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span>{formattedPrice(pricing.platformFee)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>{formattedPrice(pricing.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-md p-4">
                  <h4 className="font-medium mb-3">Contact Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>{form.getValues("customerName")}</p>
                    <p className="text-muted-foreground">
                      {form.getValues("customerEmail")}
                    </p>
                    <p className="text-muted-foreground">
                      {form.getValues("customerPhone")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex gap-2">
        {step !== "dates" && (
          <Button
            variant="outline"
            onClick={() =>
              setStep(step === "confirm" ? "details" : "dates")
            }
            className="flex-1"
          >
            Back
          </Button>
        )}
        {step === "dates" && (
          <Button
            onClick={() => {
              if (pricing) setStep("details");
            }}
            disabled={!pricing}
            className="flex-1 gap-2"
            data-testid="button-next-dates"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {step === "details" && (
          <Button
            onClick={async () => {
              const valid = await form.trigger([
                "customerName",
                "customerEmail",
                "customerPhone",
              ]);
              if (valid) setStep("confirm");
            }}
            className="flex-1 gap-2"
            data-testid="button-next-details"
          >
            Review Booking
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {step === "confirm" && (
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
            className="flex-1"
            data-testid="button-confirm-booking"
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
