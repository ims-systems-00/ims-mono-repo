import React from "react";
import useSwitchableView from "../useSwitchableView";

export const ViewContext = React.createContext();

const ViewContextProvider = ({
  children,
  canSwitch = true,
  viewTitle = "",
  ...rest
}) => {
  let togglerUtilities = useSwitchableView({
    canSwitch,
    viewTitle,
  });
  return (
    <ViewContext.Provider value={{ ...togglerUtilities, ...rest }}>
      {children}
    </ViewContext.Provider>
  );
};
export default ViewContextProvider;
