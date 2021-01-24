import React from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles, ...props }) => {
  const { role } = useSelector((state) => state.user);

  const renderRoute = () => {
    if (!allowedRoles) return <Route {...props} />;
    if (!role || allowedRoles.indexOf(role) === -1)
      return <Route {...props} component={() => <>Not found</>} />;
    return <Route {...props} />;
  };
  return renderRoute();
};

export default ProtectedRoute;
