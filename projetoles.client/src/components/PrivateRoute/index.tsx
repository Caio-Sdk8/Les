import { Navigate } from "react-router-dom";
import { authService } from "../../services/auth/authService";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (roles && roles.length > 0 && !authService.hasAnyRole(...roles)) {
    return <Navigate to="/loja" replace />;
  }

  return <>{children}</>;
}
