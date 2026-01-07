import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from "./supabase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    // First get the current session
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      console.log('[Auth] No session found');
      return {};
    }
    
    // Check if token needs refresh (expires within 5 minutes)
    const expiresAt = currentSession.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const needsRefresh = expiresAt && (expiresAt - now < 300);
    
    if (needsRefresh) {
      console.log('[Auth] Token near expiry, refreshing...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (!refreshError && refreshData.session?.access_token) {
        console.log('[Auth] Token refreshed successfully');
        return { Authorization: `Bearer ${refreshData.session.access_token}` };
      } else {
        console.log('[Auth] Refresh failed:', refreshError?.message);
      }
    }
    
    // Use current session token
    return { Authorization: `Bearer ${currentSession.access_token}` };
  } catch (error) {
    console.error('[Auth] Error getting auth headers:', error);
  }
  
  return {};
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(url, {
    method,
    headers: {
      ...authHeaders,
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
      headers: authHeaders,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export async function fetchWithAuth(url: string): Promise<Response> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(url, {
    credentials: "include",
    headers: authHeaders,
  });
  return res;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
