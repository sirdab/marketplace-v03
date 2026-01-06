import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, Warehouse, Wrench, Package, Store, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type PropertyCategory } from "@shared/schema";

const categoryData: {
  category: PropertyCategory;
  key: string;
  icon: React.ReactNode;
  image: string;
  count: number;
}[] = [
  {
    category: "warehouse",
    key: "warehouse",
    icon: <Warehouse className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80",
    count: 124,
  },
  {
    category: "workshop",
    key: "workshop",
    icon: <Wrench className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80",
    count: 89,
  },
  {
    category: "storage",
    key: "storage",
    icon: <Package className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80",
    count: 156,
  },
  {
    category: "storefront",
    key: "storefront",
    icon: <Store className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    count: 67,
  },
];

export function CategoryShowcase() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {t("categories.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("categories.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.map(({ category, key, icon, image, count }) => (
            <Link
              key={category}
              href={`/properties?category=${category}`}
              className="block"
            >
              <Card
                className="group overflow-hidden hover-elevate h-full"
                data-testid={`card-category-${category}`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={image}
                    alt={t(`categories.${key}`)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 start-3 flex items-center gap-2 text-white">
                    {icon}
                    <span className="font-semibold">
                      {t(`categories.${key}`)}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    {t(`categoryDescriptions.${key}`)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {count} {t("common.properties")}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/properties">
            <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-all">
              {t("categories.viewAllProperties")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
