import React from "react";
import useStore from "./useStore";
export const IncidentContext = React.createContext();
const IncidentContextProvider = ({
  children,
  moduleType,
  moduleId,
  ...rest
}) => {
  let { ...store } = useStore({
    moduleType,
    moduleId,
    ...rest,
  });
  return (
    <IncidentContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
export default IncidentContextProvider;
