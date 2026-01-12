import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Ruler, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Ad, City } from '@shared/schema';

function toSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function RegionAds() {
  const { t, i18n } = useTranslation();
  const { city } = useParams<{ city: string }>();
  const isRTL = i18n.language === 'ar';

  const { data: cities } = useQuery<City[]>({
    queryKey: ['/api/cities'],
  });

  const matchedCity = cities?.find((c) => toSlug(c.nameEn) === city);
  const cityName = matchedCity
    ? isRTL
      ? matchedCity.nameAr
      : matchedCity.nameEn
    : city?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '';

  const {
    data: ads,
    isLoading,
    error,
  } = useQuery<Ad[]>({
    queryKey: ['/api/public/ads/region/sa', city],
    enabled: !!city,
  });

  const formatPrice = (price: string | null) => {
    if (!price) return t('common.contactForPrice');
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
            <Skeleton className="h-10 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Link href="/properties">
            <Button variant="ghost" className="mb-6" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 me-2" />
              {t('common.back')}
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-region-title">
              {t('region.propertiesIn', { city: cityName })}
            </h1>
            <p className="text-muted-foreground">
              {ads?.length || 0} {t('common.propertiesFound')}
            </p>
          </div>

          {!ads || ads.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t('region.noProperties')}</h2>
              <p className="text-muted-foreground mb-6">{t('region.noPropertiesDesc')}</p>
              <Link href="/properties">
                <Button data-testid="button-view-all">{t('common.viewAllProperties')}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <Link key={ad.id} href={`/ads/${ad.id}`}>
                  <Card
                    className="overflow-hidden hover-elevate cursor-pointer h-full"
                    data-testid={`card-ad-${ad.id}`}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={ad.images?.[0] || '/placeholder-property.jpg'}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                      {ad.verified && (
                        <Badge className="absolute top-2 end-2" variant="secondary">
                          <CheckCircle className="h-3 w-3 me-1" />
                          {t('common.verified')}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3
                        className="font-semibold mb-2 line-clamp-2"
                        data-testid={`text-ad-title-${ad.id}`}
                      >
                        {ad.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {ad.district}, {ad.city}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-lg" data-testid={`text-ad-price-${ad.id}`}>
                          {formatPrice(ad.price)}
                        </span>
                        {ad.areaInM2 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Ruler className="h-3 w-3" />
                            <span>{ad.areaInM2} m²</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
