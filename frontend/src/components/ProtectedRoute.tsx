// src/components/ProtectedRoute.tsx
import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  requireSubscription?: boolean;
}

export default function ProtectedRoute({ children, requireSubscription = false }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const isSubscribed = localStorage.getItem('isSubscribed') === 'true';

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireSubscription && !isSubscribed) {
    return <Navigate to="/home" />;
  }

  return children;
}
