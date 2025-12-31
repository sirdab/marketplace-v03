import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useTranslation } from "react-i18next";
import { Search, Menu, X, Heart, User, LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PurposeFilter } from "./PurposeFilter";
import { type PropertyPurpose } from "@shared/schema";
import logoPath from "@assets/Sirdab_Logo-01_(1)_Cropped_-_Edited_1767185859899.png";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  purpose?: PropertyPurpose;
  onPurposeChange?: (purpose: PropertyPurpose | undefined) => void;
}

export function Header({ onSearch, searchQuery = "", purpose, onPurposeChange }: HeaderProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localPurpose, setLocalPurpose] = useState<PropertyPurpose | undefined>(purpose);
  const { user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: t('auth.logoutSuccess') });
    setLocation('/');
  };

  useEffect(() => {
    setLocalPurpose(purpose);
  }, [purpose]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearch);
    } else {
      const params = new URLSearchParams();
      if (localSearch) params.set("q", localSearch);
      if (localPurpose) params.set("purpose", localPurpose);
      setLocation(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
    }
  };

  const handlePurposeChange = (newPurpose: PropertyPurpose | undefined) => {
    setLocalPurpose(newPurpose);
    if (onPurposeChange) {
      onPurposeChange(newPurpose);
    }
  };

  const isHome = location === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 dark:border-white/10 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 md:h-[4.5rem] items-center justify-between gap-3 md:gap-6">
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          <Link href="/" className="flex items-center gap-2 shrink-0 md:ms-0">
            <img src={logoPath} alt="Sirdab" className="h-9 md:h-11 w-auto" />
          </Link>

          <div className="md:hidden flex items-center gap-1.5 bg-muted/50 dark:bg-white/5 backdrop-blur-sm rounded-full px-1 py-0.5">
            <Link href="/list-property">
              <Button
                size="sm"
                className="bg-[#089c9f] text-white hover:bg-[#067e81] text-xs px-3 rounded-full shadow-sm"
                data-testid="button-list-property-mobile"
              >
                <Building2 className="h-3.5 w-3.5 me-1" />
                {t("homeCategoryBar.listYourSpace")}
              </Button>
            </Link>
            <Link href="/saved">
              <Button variant="ghost" size="icon" className="rounded-full" data-testid="link-saved-mobile">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {!isHome && (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-xl mx-4 gap-2"
            >
              <PurposeFilter
                value={localPurpose}
                onChange={handlePurposeChange}
                variant="header"
              />
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('hero.searchPlaceholder')}
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="ps-10 pe-4"
                  data-testid="input-header-search"
                />
              </div>
            </form>
          )}

          <nav className="hidden md:flex items-center gap-3">
            <Link href="/list-property">
              <Button
                className="bg-[#089c9f] text-white hover:bg-[#067e81] font-medium shadow-md hover:shadow-lg"
                data-testid="button-list-your-space-nav"
              >
                <Building2 className="h-4 w-4 me-2" />
                {t("homeCategoryBar.listYourSpace")}
              </Button>
            </Link>
            <div className="w-px h-6 bg-border/40 mx-1" />
            <Link href="/properties">
              <Button
                variant={location.startsWith("/properties") ? "secondary" : "ghost"}
                data-testid="link-browse"
              >
                {t('nav.browse')}
              </Button>
            </Link>
            <Link href="/saved">
              <Button variant="ghost" size="icon" data-testid="link-saved">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-user-menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full cursor-pointer">
                      {t('nav.dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="w-full cursor-pointer">
                      {t('nav.myBookings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/visits" className="w-full cursor-pointer">
                      {t('nav.scheduledVisits')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/saved" className="w-full cursor-pointer">
                      {t('nav.savedProperties')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                    data-testid="button-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" data-testid="button-login">
                  {t('nav.login')}
                </Button>
              </Link>
            )}
            <div className="w-px h-6 bg-border/40 mx-1" />
            <LanguageSwitcher />
            <ThemeToggle />
          </nav>
        </div>

        {!isHome && (
          <form
            onSubmit={handleSearchSubmit}
            className="md:hidden pb-3"
          >
            <div className="flex gap-2 items-center">
              <PurposeFilter
                value={localPurpose}
                onChange={handlePurposeChange}
                variant="mobile"
              />
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('hero.searchPlaceholder')}
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="ps-10 pe-4 rounded-full h-10"
                  data-testid="input-mobile-header-search"
                />
              </div>
            </div>
          </form>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('common.search')}
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="ps-10"
                  data-testid="input-mobile-search"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-2">
              <Link href="/properties" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  {t('nav.browseProperties')}
                </Button>
              </Link>
              <Link href="/saved" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Heart className="h-4 w-4" />
                  {t('nav.savedProperties')}
                </Button>
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="button-mobile-logout"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('auth.signOut')}
                  </Button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    {t('nav.login')}
                  </Button>
                </Link>
              )}
              <Link href="/list-property" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start mt-2 bg-[#089c9f] text-[#ffffff] hover:bg-[#067e81] hover:text-[#ffffff] border-none">
                  {t("homeCategoryBar.listYourSpace")}
                </Button>
              </Link>
              <div className="flex items-center justify-between pt-2 border-t mt-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
