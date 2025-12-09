import React from "react";
import useStore from "./useStore";
export const Context = React.createContext();
const ContextProvider = ({
  children,
  onSelectionChange = () => {},
  onNewSelection = () => {},
  onDeselection = () => {},
  onResultsChange = () => {},
  preSelectedControls = [],
  preDisabledControls = [],
}) => {
  let { ...store } = useStore({
    onSelectionChange: onSelectionChange,
    onResultsChange: onResultsChange,
    onNewSelection: onNewSelection,
    onDeselection: onDeselection,
    preSelectedControls: preSelectedControls,
    preDisabledControls: preDisabledControls,
  });
  return (
    <Context.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default ContextProvider;
