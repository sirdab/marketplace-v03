import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/lib/theme';
import { AuthProvider } from '@/lib/auth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useDirection } from '@/hooks/use-direction';
import Home from '@/pages/home';
import Properties from '@/pages/properties';
import PropertyDetail from '@/pages/property-detail';
import Dashboard from '@/pages/dashboard';
import MyAds from '@/pages/my-ads';
import AdForm from '@/pages/ad-form';
import AdDetail from '@/pages/ad-detail';
import RegionAds from '@/pages/region-ads';
import AdminDashboard from '@/pages/admin';
import AuthPage from '@/pages/auth';
import NotFound from '@/pages/not-found';

function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function ProtectedMyAds() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function ProtectedCreateAd() {
  return (
    <ProtectedRoute>
      <AdForm mode="create" />
    </ProtectedRoute>
  );
}

function ProtectedEditAd() {
  return (
    <ProtectedRoute>
      <AdForm mode="edit" />
    </ProtectedRoute>
  );
}

function ProtectedAdmin() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties" component={Properties} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/dashboard" component={ProtectedDashboard} />
      <Route path="/bookings" component={ProtectedDashboard} />
      <Route path="/visits" component={ProtectedDashboard} />
      <Route path="/saved" component={ProtectedDashboard} />
      <Route path="/my-ads" component={ProtectedMyAds} />
      <Route path="/ads/new" component={ProtectedCreateAd} />
      <Route path="/ads/region/sa/:city" component={RegionAds} />
      <Route path="/ads/:id/edit" component={ProtectedEditAd} />
      <Route path="/ads/:id" component={AdDetail} />
      <Route path="/admin" component={ProtectedAdmin} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function DirectionWrapper({ children }: { children: React.ReactNode }) {
  useDirection();
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <DirectionWrapper>
              <Toaster />
              <Router />
            </DirectionWrapper>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
