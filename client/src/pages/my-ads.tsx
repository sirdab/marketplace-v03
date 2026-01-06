import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/lib/auth';
import { queryClient, apiRequest, fetchWithAuth } from '@/lib/queryClient';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, ExternalLink, Building2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import type { Ad } from '@shared/schema';

export default function MyAds() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  const dateLocale = isRTL ? ar : enUS;

  const { data: ads = [], isLoading, isError, error } = useQuery<Ad[]>({
    queryKey: ['/api/my-ads'],
    queryFn: async () => {
      const response = await fetchWithAuth('/api/my-ads');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch ads');
      }
      return response.json();
    },
    enabled: !!user?.id,
  });

  const updateAdMutation = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      return apiRequest('PATCH', `/api/ads/${id}`, { published });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-ads'] });
      toast({
        title: variables.published ? t('myAds.publishSuccess') : t('myAds.unpublishSuccess'),
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('myAds.updateError'),
      });
    },
  });

  const handleTogglePublished = (ad: Ad) => {
    updateAdMutation.mutate({ id: ad.id, published: !ad.published });
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '-';
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, 'dd MMM yyyy', { locale: dateLocale });
    } catch {
      return '-';
    }
  };

  const formatAvailability = (from: string | null, to: string | null) => {
    if (!from && !to) return '-';
    const fromDate = from ? formatDate(from) : '';
    const toDate = to ? formatDate(to) : '';
    if (fromDate && toDate) return `${fromDate} - ${toDate}`;
    if (fromDate) return fromDate;
    return toDate;
  };

  if (isLoading) {
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

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <h3 className="text-xl font-medium mb-2">{t('myAds.errorTitle')}</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  {error?.message || t('myAds.errorDesc')}
                </p>
                <Button onClick={() => window.location.reload()} data-testid="button-retry">
                  {t('myAds.retry')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-semibold mb-2">{t('myAds.title')}</h1>
              <p className="text-muted-foreground">{t('myAds.subtitle')}</p>
            </div>
            <Link href="/ads/new">
              <Button data-testid="button-create-ad">
                <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('myAds.createAd')}
              </Button>
            </Link>
          </div>

          {ads.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">{t('myAds.noAds')}</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  {t('myAds.noAdsDesc')}
                </p>
                <Link href="/ads/new">
                  <Button data-testid="button-create-first-ad">
                    <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('myAds.createAd')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-my-ads">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-start p-4 font-medium text-muted-foreground">
                        {t('myAds.columns.name')}
                      </th>
                      <th className="text-start p-4 font-medium text-muted-foreground">
                        {t('myAds.columns.address')}
                      </th>
                      <th className="text-start p-4 font-medium text-muted-foreground">
                        {t('myAds.columns.availability')}
                      </th>
                      <th className="text-start p-4 font-medium text-muted-foreground">
                        {t('myAds.columns.createdAt')}
                      </th>
                      <th className="text-start p-4 font-medium text-muted-foreground">
                        {t('myAds.columns.published')}
                      </th>
                      <th className="text-start p-4 font-medium text-muted-foreground">
                        {t('myAds.columns.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad) => (
                      <tr
                        key={ad.id}
                        className="border-b last:border-b-0 hover-elevate"
                        data-testid={`row-ad-${ad.id}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{ad.title}</span>
                            <Link href={`/property/${ad.id}`}>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                data-testid={`button-view-ad-${ad.id}`}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {ad.district !== '-' ? `${ad.district}, ` : ''}
                          {ad.city !== '-' ? ad.city : '-'}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatAvailability(ad.availableDateFrom, ad.availableDateTo)}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatDate(ad.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={ad.published}
                              onCheckedChange={() => handleTogglePublished(ad)}
                              disabled={updateAdMutation.isPending}
                              data-testid={`switch-published-${ad.id}`}
                            />
                            <Badge
                              variant={ad.published ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {ad.published ? t('myAds.active') : t('myAds.inactive')}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/ads/${ad.id}/edit`}>
                              <Button
                                size="sm"
                                variant="outline"
                                data-testid={`button-edit-ad-${ad.id}`}
                              >
                                <Pencil className="h-3 w-3 ltr:mr-1 rtl:ml-1" />
                                {t('myAds.edit')}
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
