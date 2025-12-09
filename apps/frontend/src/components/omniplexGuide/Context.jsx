import React from "react";
import useJourneyStore from "./useJourneyStore";
export const JourneyContext = React.createContext();
const JourneyContextProvider = ({ children }) => {
  let { ...store } = useJourneyStore({});
  return (
    <JourneyContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};
export default JourneyContextProvider;
