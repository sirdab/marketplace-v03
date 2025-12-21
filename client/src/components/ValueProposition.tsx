import { useTranslation } from "react-i18next";
import { CheckCircle, Clock, Shield, CreditCard } from "lucide-react";

export function ValueProposition() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8" />,
      titleKey: "verifiedTitle",
      descKey: "verifiedDesc",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      titleKey: "instantTitle",
      descKey: "instantDesc",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      titleKey: "secureTitle",
      descKey: "secureDesc",
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      titleKey: "transparentTitle",
      descKey: "transparentDesc",
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {t("value.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("value.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center"
              data-testid={`value-prop-${index}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t(`value.${feature.titleKey}`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`value.${feature.descKey}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
