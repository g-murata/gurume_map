import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuthContext();
  if (!user) {
    // return <Navigate to="/login" />;
    return <Navigate to="/landing" />;
  }
  return children;
};

export default PrivateRoute;
