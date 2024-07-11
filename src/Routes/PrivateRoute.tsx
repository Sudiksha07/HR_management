import React, { FC, ReactElement } from "react";
import { useAuth } from "../context/authContext";
import SignIn from "../pages/SignIn/SignIn";

interface PrivateRouteProps {
  children: ReactElement;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return children;
};

export default PrivateRoute;
