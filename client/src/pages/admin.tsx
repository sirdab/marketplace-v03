import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { fetchWithAuth } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import type { Ad } from '@shared/schema';
import { ThemeToggle } from '@/components/ThemeToggle';

const menuItems = [
  { icon: LayoutDashboard, labelKey: 'admin.overview', path: '/admin', id: 'overview' },
  { icon: Building2, labelKey: 'admin.listings', path: '/admin/listings', id: 'listings' },
  { icon: Users, labelKey: 'admin.users', path: '/admin/users', id: 'users' },
  { icon: Settings, labelKey: 'admin.settings', path: '/admin/settings', id: 'settings' },
];

function AdminSidebar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const { t } = useTranslation();
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <h2 className="font-semibold text-lg">{t('admin.title')}</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('admin.menu')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    className={activeTab === item.id ? 'bg-sidebar-accent' : ''}
                    data-testid={`admin-nav-${item.id}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{t(item.labelKey)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function OverviewTab() {
  const { t, i18n } = useTranslation();
  const { data: ads = [], isLoading } = useQuery<Ad[]>({
    queryKey: ['/api/admin/ads'],
    queryFn: async () => {
      const response = await fetchWithAuth('/api/admin/ads');
      if (!response.ok) throw new Error('Failed to fetch ads');
      return response.json();
    },
  });

  const publishedCount = ads.filter(ad => ad.published && !ad.deleted).length;
  const draftCount = ads.filter(ad => !ad.published && !ad.deleted).length;
  const verifiedCount = ads.filter(ad => ad.verified).length;

  const stats = [
    { label: t('admin.totalListings'), value: ads.length, icon: Building2 },
    { label: t('admin.published'), value: publishedCount, icon: CheckCircle },
    { label: t('admin.drafts'), value: draftCount, icon: Clock },
    { label: t('admin.verified'), value: verifiedCount, icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t('admin.overview')}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-semibold mt-1">
                    {isLoading ? '-' : stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ListingsTab() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: ads = [], isLoading } = useQuery<Ad[]>({
    queryKey: ['/api/admin/ads'],
    queryFn: async () => {
      const response = await fetchWithAuth('/api/admin/ads');
      if (!response.ok) throw new Error('Failed to fetch ads');
      return response.json();
    },
  });

  const filteredAds = ads.filter(ad => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ad.title.toLowerCase().includes(query) ||
      ad.city?.toLowerCase().includes(query) ||
      ad.district?.toLowerCase().includes(query)
    );
  });

  const formatPrice = (price: string) => {
    const num = parseInt(price);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">{t('admin.listings')}</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.searchListings')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rtl:pl-3 rtl:pr-9"
            data-testid="input-admin-search"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.tableTitle')}</TableHead>
                    <TableHead>{t('admin.tableCity')}</TableHead>
                    <TableHead>{t('admin.tablePrice')}</TableHead>
                    <TableHead>{t('admin.tableStatus')}</TableHead>
                    <TableHead className="text-end">{t('admin.tableActions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAds.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {t('admin.noListings')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAds.map((ad) => (
                      <TableRow key={ad.id} data-testid={`admin-listing-${ad.id}`}>
                        <TableCell>
                          <div className="font-medium truncate max-w-[200px]">{ad.title}</div>
                          <div className="text-sm text-muted-foreground">{ad.type || 'Warehouse'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{ad.city !== '-' ? ad.city : '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatPrice(ad.price)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {ad.published ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {t('admin.statusPublished')}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {t('admin.statusDraft')}
                              </Badge>
                            )}
                            {ad.verified && (
                              <Badge variant="outline" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {t('admin.statusVerified')}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Link href={`/ads/${ad.id}`}>
                              <Button size="icon" variant="ghost" data-testid={`button-view-${ad.id}`}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/ads/${ad.id}/edit`}>
                              <Button size="icon" variant="ghost" data-testid={`button-edit-${ad.id}`}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UsersTab() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t('admin.users')}</h2>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t('admin.usersComingSoon')}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t('admin.settings')}</h2>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t('admin.settingsComingSoon')}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('listings');

  const sidebarStyle = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'listings':
        return <ListingsTab />;
      case 'users':
        return <UsersTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <ListingsTab />;
    }
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 p-4 border-b bg-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-admin-sidebar-toggle" />
              <h1 className="text-xl font-semibold">{t('admin.dashboard')}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm" data-testid="button-back-to-site">
                  {t('admin.backToSite')}
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
