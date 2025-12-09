import useGroups from "@/hooks/useGroups";
import React from "react";
import { GROUP_TYPE } from "@/rolesAndPermissions";
import { useApplication } from "@/stores/applicationStore";

export const SuperGlobalContext = React.createContext();

const SuperGlobalAdminProvider = ({ children }) => {
  let { isLoggedIn, currentUserData, membershipData } = useApplication();
  const { groups } = useGroups();
  return (
    <SuperGlobalContext.Provider
      value={{
        user: isLoggedIn() && currentUserData,
        groups: groups.filter((g) =>
          [GROUP_TYPE.INTERNAL_BU, GROUP_TYPE.EXTERNAL_U].includes(g.type)
        ),
        complianceBody: groups.filter((g) =>
          [GROUP_TYPE.INTERNAL_CU, GROUP_TYPE.EXTERNAL_CU].includes(g.type)
        ),
        cqcGroups: [],
        organisation: membershipData?.organization || null,
        // workLog: JSON.parse(getWorkLogCache()),
        profile: isLoggedIn() && currentUserData,
      }}
    >
      {children}
    </SuperGlobalContext.Provider>
  );
};
export default SuperGlobalAdminProvider;
