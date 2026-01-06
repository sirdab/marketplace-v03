import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth';
import { queryClient, apiRequest, fetchWithAuth } from '@/lib/queryClient';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Ad } from '@shared/schema';

const adFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  city: z.string().min(1, 'City is required'),
  district: z.string().optional(),
  address: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  paymentTerm: z.string().default('yearly'),
  type: z.string().optional(),
  areaInM2: z.string().optional(),
  availableDateFrom: z.string().optional(),
  availableDateTo: z.string().optional(),
  phoneNumber: z.string().min(9, 'Phone number is required'),
  phoneCountryCode: z.string().default('+966'),
  municipalityLicense: z.boolean().default(false),
  civilDefenseLicense: z.boolean().default(false),
});

type AdFormData = z.infer<typeof adFormSchema>;

interface AdFormProps {
  mode: 'create' | 'edit';
}

export default function AdForm({ mode }: AdFormProps) {
  const { t, i18n } = useTranslation();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const { data: existingAd, isLoading: adLoading } = useQuery<Ad>({
    queryKey: ['/api/ads', params.id],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/ads/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch ad');
      return response.json();
    },
    enabled: mode === 'edit' && !!params.id,
  });

  const form = useForm<AdFormData>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      city: '',
      district: '',
      address: '',
      price: '',
      paymentTerm: 'yearly',
      type: 'warehouse',
      areaInM2: '',
      availableDateFrom: '',
      availableDateTo: '',
      phoneNumber: '',
      phoneCountryCode: '+966',
      municipalityLicense: false,
      civilDefenseLicense: false,
    },
  });

  useEffect(() => {
    if (existingAd && mode === 'edit') {
      form.reset({
        title: existingAd.title || '',
        slug: existingAd.slug || '',
        description: existingAd.description || '',
        city: existingAd.city !== '-' ? existingAd.city : '',
        district: existingAd.district !== '-' ? existingAd.district : '',
        address: existingAd.address !== '-' ? existingAd.address : '',
        price: existingAd.price || '',
        paymentTerm: existingAd.paymentTerm || 'yearly',
        type: existingAd.type || 'warehouse',
        areaInM2: existingAd.areaInM2 || '',
        availableDateFrom: existingAd.availableDateFrom || '',
        availableDateTo: existingAd.availableDateTo || '',
        phoneNumber: existingAd.phoneNumber !== '000000000' ? existingAd.phoneNumber : '',
        phoneCountryCode: existingAd.phoneCountryCode || '+966',
        municipalityLicense: existingAd.municipalityLicense || false,
        civilDefenseLicense: existingAd.civilDefenseLicense || false,
      });
    }
  }, [existingAd, mode, form]);

  const createMutation = useMutation({
    mutationFn: async (data: AdFormData) => {
      return apiRequest('POST', '/api/ads', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-ads'] });
      toast({ title: t('adForm.createSuccess') });
      navigate('/my-ads');
    },
    onError: () => {
      toast({ variant: 'destructive', title: t('adForm.createError') });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AdFormData) => {
      return apiRequest('PATCH', `/api/ads/${params.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-ads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ads', params.id] });
      toast({ title: t('adForm.updateSuccess') });
      navigate('/my-ads');
    },
    onError: () => {
      toast({ variant: 'destructive', title: t('adForm.updateError') });
    },
  });

  const onSubmit = (data: AdFormData) => {
    if (mode === 'create') {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (mode === 'edit' && adLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/my-ads')}
              className="mb-4"
              data-testid="button-back-to-ads"
            >
              <BackIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('myAds.title')}
            </Button>
            <h1 className="text-3xl font-semibold">
              {mode === 'create' ? t('adForm.createTitle') : t('adForm.editTitle')}
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('adForm.basicInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('adForm.title')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('adForm.titlePlaceholder')}
                            data-testid="input-ad-title"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (mode === 'create') {
                                form.setValue('slug', generateSlug(e.target.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('adForm.description')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('adForm.descriptionPlaceholder')}
                            className="min-h-[120px]"
                            data-testid="input-ad-description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('adForm.type')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-ad-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="warehouse">{t('categories.warehouse')}</SelectItem>
                            <SelectItem value="workshop">{t('categories.workshop')}</SelectItem>
                            <SelectItem value="storage">{t('categories.storage')}</SelectItem>
                            <SelectItem value="storefront">{t('categories.storefrontLong')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('adForm.location')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adForm.city')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-ad-city">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Riyadh">{t('cities.riyadh')}</SelectItem>
                              <SelectItem value="Jeddah">{t('cities.jeddah')}</SelectItem>
                              <SelectItem value="Dammam">{t('cities.dammam')}</SelectItem>
                              <SelectItem value="Al Khobar">{t('cities.alKhobar')}</SelectItem>
                              <SelectItem value="Makkah">{t('cities.makkah')}</SelectItem>
                              <SelectItem value="Abha">{t('cities.abha')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adForm.district')}</FormLabel>
                          <FormControl>
                            <Input data-testid="input-ad-district" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('adForm.address')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('adForm.addressPlaceholder')}
                            data-testid="input-ad-address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('adForm.pricing')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adForm.price')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={t('adForm.pricePlaceholder')}
                              data-testid="input-ad-price"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adForm.paymentTerm')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-ad-payment-term">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yearly">{t('adForm.yearly')}</SelectItem>
                              <SelectItem value="monthly">{t('adForm.monthly')}</SelectItem>
                              <SelectItem value="daily">{t('adForm.daily')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('adForm.propertyDetails')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="areaInM2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('adForm.area')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t('adForm.areaPlaceholder')}
                            data-testid="input-ad-area"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="availableDateFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adForm.availableFrom')}</FormLabel>
                          <FormControl>
                            <Input type="date" data-testid="input-ad-available-from" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availableDateTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adForm.availableTo')}</FormLabel>
                          <FormControl>
                            <Input type="date" data-testid="input-ad-available-to" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('adForm.contact')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('adForm.phoneNumber')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('adForm.phonePlaceholder')}
                            data-testid="input-ad-phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('adForm.licenses')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="municipalityLicense"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-municipality-license"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">{t('adForm.municipalityLicense')}</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="civilDefenseLicense"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-civil-defense-license"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">{t('adForm.civilDefenseLicense')}</FormLabel>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending} data-testid="button-submit-ad">
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 ltr:mr-2 rtl:ml-2 animate-spin" />
                      {t('adForm.submitting')}
                    </>
                  ) : (
                    t('adForm.submit')
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
