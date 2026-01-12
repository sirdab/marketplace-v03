import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslation } from 'react-i18next';

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{t('terms.title')}</h1>
          <p className="text-muted-foreground mb-8">{t('terms.lastUpdated')}</p>

          <p className="text-muted-foreground mb-8">{t('terms.intro')}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.section1Title')}</h2>
              <p className="text-muted-foreground">{t('terms.section1Content')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.section2Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('terms.use1')}</li>
                <li>{t('terms.use2')}</li>
                <li>{t('terms.use3')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.section3Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('terms.account1')}</li>
                <li>{t('terms.account2')}</li>
                <li>{t('terms.account3')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.section4Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('terms.pricing1')}</li>
                <li>{t('terms.pricing2')}</li>
                <li>{t('terms.pricing3')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.section5Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('terms.ip1')}</li>
                <li>{t('terms.ip2')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.section6Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('terms.liability1')}</li>
                <li>{t('terms.liability2')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.section7Title')}</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{t('terms.termination1')}</li>
                <li>{t('terms.termination2')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.section8Title')}</h2>
              <p className="text-muted-foreground">{t('terms.amendments')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.section9Title')}</h2>
              <p className="text-muted-foreground">{t('terms.governingLaw')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('terms.section10Title')}</h2>
              <p className="text-muted-foreground">{t('terms.contactInfo')}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
