import React from "react";
import useAccess from "@/hooks/useAccess";
const Can = ({ policy, children }) => {
  const { authUser } = useAccess();
  if (!policy || !authUser(policy)) return null;
  return <React.Fragment>{children}</React.Fragment>;
};
export default Can;
