import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuthContext();
  if (!user) {
    return <Navigate to="/landing" />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
