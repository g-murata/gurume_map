import { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from '../components/Loading';

const AuthContext = createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  const value = {
    user,
    loading,
  };

  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribed();
    };
  }, []);
  if (loading) {
    return <Loading />
  } else {
    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    );
  }
}
