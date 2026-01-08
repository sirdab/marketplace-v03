import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { Calendar, Clock, User, CheckCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Property } from "@shared/schema";

const createVisitSchema = (t: (key: string) => string) => z.object({
  visitorName: z.string().min(2, t("validation.nameRequired")),
  visitDate: z.date({ required_error: t("validation.dateRequired") }),
  visitTime: z.string({ required_error: t("validation.timeRequired") }),
  notes: z.string().optional(),
});

type VisitFormData = z.infer<ReturnType<typeof createVisitSchema>>;

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

interface VisitSchedulerProps {
  property: Property;
  onSubmit: (data: VisitFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function VisitScheduler({ property, onSubmit, isSubmitting }: VisitSchedulerProps) {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const visitSchema = useMemo(() => createVisitSchema(t), [t]);

  const form = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      visitorName: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: VisitFormData) => {
    await onSubmit(data);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("form.visitScheduled")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("form.visitScheduledDesc")}
            </p>
            <Button variant="outline" onClick={() => setIsSuccess(false)}>
              {t("form.scheduleAnother")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t("property.scheduleVisit")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="visitorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.fullName")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("form.yourName")}
                        className="ps-10"
                        {...field}
                        data-testid="input-visitor-name"
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
                name="visitDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.preferredDate")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-start font-normal"
                            data-testid="button-visit-date"
                          >
                            <Calendar className="me-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "PPP")
                              : t("form.selectDate")}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            isBefore(date, startOfToday()) ||
                            isBefore(addDays(new Date(), 30), date)
                          }
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
                name="visitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.preferredTime")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-visit-time">
                          <Clock className="me-2 h-4 w-4" />
                          <SelectValue placeholder={t("form.selectTime")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>{t("form.additionalNotes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("form.notesPlaceholder")}
                      className="resize-none"
                      {...field}
                      data-testid="textarea-visit-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              data-testid="button-submit-visit"
            >
              {isSubmitting ? t("form.scheduling") : t("form.scheduleVisit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
