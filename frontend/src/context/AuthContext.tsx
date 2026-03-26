import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Loading from '../components/Loading';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Development/Test環境のみ: localStorageにモックユーザーがいればそれを使う
    const mockEmail = localStorage.getItem('MOCK_AUTH_USER');
    if (mockEmail && process.env.NODE_ENV === 'development') {
      setUser({ email: mockEmail, displayName: 'Test User' } as User);
      setLoading(false);
      return;
    }

    const unsubscribed = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  const value = {
    user,
    loading,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
