interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Simplified ProtectedRoute - always allows access for crawling purposes
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
