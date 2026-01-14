import { createContext, useContext, useEffect, useState } from 'react';

// Simple mock user type
interface MockUser {
  id: string;
  phone: string;
}

// Simple mock session type
interface MockSession {
  access_token: string;
  user: MockUser;
}

interface AuthContextType {
  user: MockUser | null;
  session: MockSession | null;
  loading: boolean;
  sendPhoneOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'sirdab-auth-token';
const VALID_OTP = '1111';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a simple mock token
function generateMockToken(): string {
  return 'mock_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession) as MockSession;
        setSession(parsed);
        setUser(parsed.user);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Mock send OTP - always succeeds (we don't actually send anything)
  const sendPhoneOtp = async (_phone: string): Promise<{ error: Error | null }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { error: null };
  };

  // Mock verify OTP - accepts "1111" as valid
  const verifyPhoneOtp = async (phone: string, token: string): Promise<{ error: Error | null }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (token !== VALID_OTP) {
      return { error: new Error('Invalid OTP. Use 1111') };
    }

    // Create mock user and session
    const mockUser: MockUser = {
      id: 'user_' + Math.random().toString(36).substring(2),
      phone,
    };

    const mockSession: MockSession = {
      access_token: generateMockToken(),
      user: mockUser,
    };

    // Store in localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockSession));

    // Update state
    setUser(mockUser);
    setSession(mockSession);

    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, sendPhoneOtp, verifyPhoneOtp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
