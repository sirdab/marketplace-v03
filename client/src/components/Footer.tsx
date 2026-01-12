import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="h-7 w-7 text-primary" />
              <span className="font-semibold text-xl">Sirdab</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">{t('footer.description')}</p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href="mailto:hello@sirdab.co"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                hello@sirdab.co
              </a>
              <a href="tel:+966123456789" className="flex items-center gap-2 hover:text-foreground">
                <Phone className="h-4 w-4" />
                +966 12 345 6789
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.categories')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/properties?category=warehouse" className="hover:text-foreground">
                  {t('footer.warehouses')}
                </Link>
              </li>
              <li>
                <Link href="/properties?category=workshop" className="hover:text-foreground">
                  {t('footer.workshops')}
                </Link>
              </li>
              <li>
                <Link href="/properties?category=storage" className="hover:text-foreground">
                  {t('footer.selfStorage')}
                </Link>
              </li>
              <li>
                <Link href="/properties?category=storefront" className="hover:text-foreground">
                  {t('footer.storefronts')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="hover:text-foreground">
                  {t('footer.listYourProperty')}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground">
                  {t('footer.careers')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.locations')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{t('cities.riyadh')}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{t('cities.jeddah')}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{t('cities.dammam')}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{t('cities.makkah')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>2024 Sirdab. {t('footer.rights')}</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link href="/privacy" className="hover:text-foreground">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
