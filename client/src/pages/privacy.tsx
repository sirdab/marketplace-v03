import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslation } from 'react-i18next';

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{t('privacy.title')}</h1>
          <p className="text-muted-foreground mb-8">{t('privacy.lastUpdated')}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground">{t('privacy.intro')}</p>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.section1Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>{t('privacy.personalInfo')}</strong> {t('privacy.personalInfoDesc')}
                </li>
                <li>
                  <strong>{t('privacy.transactionalData')}</strong>{' '}
                  {t('privacy.transactionalDataDesc')}
                </li>
                <li>
                  <strong>{t('privacy.technicalData')}</strong> {t('privacy.technicalDataDesc')}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.section2Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('privacy.use1')}</li>
                <li>{t('privacy.use2')}</li>
                <li>{t('privacy.use3')}</li>
                <li>{t('privacy.use4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.section3Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('privacy.sharing1')}</li>
                <li>{t('privacy.sharing2')}</li>
                <li>{t('privacy.sharing3')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.section4Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('privacy.rights1')}</li>
                <li>{t('privacy.rights2')}</li>
                <li>{t('privacy.rights3')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.section5Title')}</h2>
              <p className="text-muted-foreground">{t('privacy.cookies')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.section6Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('privacy.changes1')}</li>
                <li>{t('privacy.changes2')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('privacy.section7Title')}</h2>
              <p className="text-muted-foreground">{t('privacy.contact')}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
