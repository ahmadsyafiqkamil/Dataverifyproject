import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
