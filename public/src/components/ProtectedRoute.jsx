import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ message: "Please log in to access this page." }} />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" state={{ message: "Admin access required." }} />;
  }

  return children;
};

export default ProtectedRoute;