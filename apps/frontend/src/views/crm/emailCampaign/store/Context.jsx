import React from "react";
import useStore from "./useStore";
export const CampaignContext = React.createContext();
const CampaignContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore({
    ...rest,
  });
  return (
    <CampaignContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};
export default CampaignContextProvider;
