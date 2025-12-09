import React from "react";
import useHardwareAssetsStore from "./useHardwareAssetsStore";
export const HardwareAssetsContext = React.createContext();
const HardwareAssetsContextProvider = ({ children, ...rest }) => {
  let { ...store } = useHardwareAssetsStore({
    ...rest,
  });
  return (
    <HardwareAssetsContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </HardwareAssetsContext.Provider>
  );
};
export default HardwareAssetsContextProvider;
