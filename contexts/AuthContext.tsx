"use client";
import { createContext, useContext, useState } from "react";

// Dummy types to match original interface
interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Always return a dummy Guest user so the app behaves as if logged in
  const [user] = useState<User | null>({
    id: 'guest-123',
    email: 'guest@example.com',
    user_metadata: {
      full_name: 'Guest User',
    }
  });

  const signOut = async () => {
    // No-op for guest
    console.log("Guest signed out (no-op)");
  };

  return (
    <AuthContext.Provider value={{ user, session: null, loading: false, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
