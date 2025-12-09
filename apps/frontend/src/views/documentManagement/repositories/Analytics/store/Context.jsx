import React from "react";
import useStore from "./useStore";
export const Context = React.createContext();
const ContextProvider = ({
  children,
  onSelectionChange = () => {},
  onNewSelection = () => {},
  onDeselection = () => {},
  onResultsChange = () => {},
  preSelectedDocuments = [],
  preDisabledDocuments = [],
  purpose = "",
}) => {
  let { ...store } = useStore({
    onSelectionChange: onSelectionChange,
    onResultsChange: onResultsChange,
    onNewSelection: onNewSelection,
    onDeselection: onDeselection,
    preSelectedDocuments: preSelectedDocuments,
    preDisabledDocuments: preDisabledDocuments,
    purpose: purpose,
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
