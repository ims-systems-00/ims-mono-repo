import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useUsers from "@/hooks/useUsers";
import React, { useContext, useEffect } from "react";
import useDataImport from "./useDataImport";
export const DataImportContext = React.createContext();
const DataImportContextProvider = ({ children }) => {
  let { ...importUtils } = useDataImport();
  let { groups } = useContext(SuperGlobalContext);
  let { users, lazyLoadUsers } = useUsers();
  useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);

  return (
    <DataImportContext.Provider
      value={{
        systemMapableDataSet: {
          groups: groups.map((group) => ({
            label: group.name,
            value: group._id,
          })),
          users: users.map((user) => ({ label: user.name, value: user._id })),
        },
        ...importUtils,
      }}
    >
      {children}
    </DataImportContext.Provider>
  );
};
export default DataImportContextProvider;
