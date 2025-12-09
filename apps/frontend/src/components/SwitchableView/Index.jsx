import React from "react";
import ViewContextProvider from "./contexts/ViewContext";
import ViewSwitcher from "./ViewSwitcher";

const SwitchableView = ({ children, ...rest }) => {
  return (
    <ViewContextProvider {...rest}>
      <ViewSwitcher {...rest}>{children}</ViewSwitcher>
    </ViewContextProvider>
  );
};

export default SwitchableView;
