import React from "react";
import useActivityStore from "./useActivityStore";
export const ActivityContext = React.createContext();

const ActivityContextProvider = ({ children, ...rest }) => {
  let { ...store } = useActivityStore({
    moduleType: rest.moduleType,
    moduleId: rest.moduleId,
    metaInfo: rest.metaInfo,
  });
  return (
    <ActivityContext.Provider value={{ ...store, readOnly: rest.readOnly }}>
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivityContextProvider;
