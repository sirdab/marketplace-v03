import { Link } from "wouter";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="h-7 w-7 text-primary" />
              <span className="font-semibold text-xl">Sirdab</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The unified online catalogue for commercial real estate in Saudi Arabia.
              Find warehouses, workshops, storage, and storefronts.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="mailto:hello@sirdab.co" className="flex items-center gap-2 hover:text-foreground">
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
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/properties?category=warehouse" className="hover:text-foreground">
                  Warehouses
                </Link>
              </li>
              <li>
                <Link href="/properties?category=workshop" className="hover:text-foreground">
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/properties?category=storage" className="hover:text-foreground">
                  Self-Storage
                </Link>
              </li>
              <li>
                <Link href="/properties?category=storefront-long" className="hover:text-foreground">
                  Long-Term Storefronts
                </Link>
              </li>
              <li>
                <Link href="/properties?category=storefront-short" className="hover:text-foreground">
                  Short-Term Storefronts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="hover:text-foreground">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Locations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Riyadh</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Jeddah</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Dammam</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Makkah</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>2024 Sirdab. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
