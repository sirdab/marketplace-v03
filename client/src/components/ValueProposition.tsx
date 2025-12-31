import { useTranslation } from "react-i18next";
import { CheckCircle, Clock, Shield, CreditCard } from "lucide-react";

export function ValueProposition() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      titleKey: "verifiedTitle",
      descKey: "verifiedDesc",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      titleKey: "instantTitle",
      descKey: "instantDesc",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      titleKey: "secureTitle",
      descKey: "secureDesc",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      titleKey: "transparentTitle",
      descKey: "transparentDesc",
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-transparent via-muted/30 to-transparent">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
            {t("value.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            {t("value.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group"
              data-testid={`value-prop-${index}`}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/15 text-primary mb-5 shadow-sm transition-transform duration-200 group-hover:-translate-y-1">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t(`value.${feature.titleKey}`)}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {t(`value.${feature.descKey}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
