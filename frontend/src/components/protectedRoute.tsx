import { AuthStatesEnum } from '../store/reducers/auth/types';
import { Navigate } from "react-router-dom";

export function ProtectedRoute({
  children,
  state 
}: { children: JSX.Element, state: AuthStatesEnum }): JSX.Element {
  if (state !== AuthStatesEnum.allowed) {
    return <Navigate to="/auth" />;
  }
  return children;
};