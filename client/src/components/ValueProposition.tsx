import { CheckCircle, Clock, Shield, CreditCard } from "lucide-react";

const features = [
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "Verified Listings",
    description:
      "Every property is verified by our team. Real photos, accurate pricing, and confirmed availability.",
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Instant Booking",
    description:
      "Schedule visits or book short-term spaces directly. No back-and-forth calls required.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure Transactions",
    description:
      "Protected payments and clear contracts. Your deposits and payments are always secure.",
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Transparent Pricing",
    description:
      "No hidden fees. What you see is what you pay. Monthly or daily rates clearly displayed.",
  },
];

export function ValueProposition() {
  return (
    <section className="py-12 md:py-16 lg:py-20 border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Why Choose Sirdab
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're building the future of commercial real estate — transparent, accessible, and efficient.
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
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
