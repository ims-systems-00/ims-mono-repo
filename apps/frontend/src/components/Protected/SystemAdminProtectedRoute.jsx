import useAccess from "@/hooks/useAccess";
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useApplication } from "@/stores/applicationStore";

const SystemAdminProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn, isUserVerified } = useApplication();
  const {
    authAdditionalModulesLicense,
    authComplianceToolkitLicense,
    authSystemAdminAccess,
  } = useAccess();
  if (!isLoggedIn()) return <Redirect to="/auth/login" />;
  if (!isUserVerified())
    return <Redirect to="/auth/resend-account-verification" />;
  if (!authSystemAdminAccess()) {
    return <Redirect to="/" />;
  }
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default SystemAdminProtectedRoute;
