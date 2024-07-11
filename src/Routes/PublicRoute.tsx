import React, { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface PublicRouteProps {
  children: ReactElement;
}

const PublicRoute: FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
