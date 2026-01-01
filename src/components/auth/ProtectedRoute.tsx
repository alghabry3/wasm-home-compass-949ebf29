import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, userRole } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('🔐 ProtectedRoute Debug:', {
      user: user?.email || null,
      userId: user?.id || null,
      loading,
      isAdmin,
      userRole,
      requireAdmin,
      willRedirectToAuth: !user && !loading,
      willRedirectToHome: requireAdmin && !isAdmin && !loading
    });
  }, [user, loading, isAdmin, userRole, requireAdmin]);

  if (loading) {
    console.log('🔐 ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔐 ProtectedRoute: No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('🔐 ProtectedRoute: User is not admin, redirecting to /');
    return <Navigate to="/" replace />;
  }

  console.log('🔐 ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
