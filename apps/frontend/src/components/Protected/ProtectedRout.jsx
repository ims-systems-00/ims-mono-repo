import useAccess from "@/hooks/useAccess";
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useApplication } from "@/stores/applicationStore";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn, isUserVerified } = useApplication();
  const { authAdditionalModulesLicense, authComplianceToolkitLicense } =
    useAccess();
  if (!isLoggedIn()) return <Redirect to="/auth/login" />;
  if (!isUserVerified())
    return <Redirect to="/auth/resend-account-verification" />;
  if (rest.licenseRequirements) {
    if (
      rest.licenseRequirements.complianceTool &&
      !authComplianceToolkitLicense(rest.licenseRequirements.complianceTool)
    ) {
      return null;
    }
    if (
      rest.licenseRequirements.additionalModule &&
      !authAdditionalModulesLicense(rest.licenseRequirements.additionalModule)
    ) {
      return null;
    }
  }
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ProtectedRoute;
