import React from "react";
import useStore from "./useStore";
export const Context = React.createContext();
/**
 * @typedef ComponentProperties
 * @property {JSX.Element} children - children components
 * @property {String} riskId - riskId takes a risk object id.
 */
/**
 *
 * @param {ComponentProperties} properties
 * @returns {JSX.Element}
 */
const ContextProvider = ({
  children,
  data = null,
  template = null,
  source = null,
}) => {
  let { ...store } = useStore({
    data,
    template,
    source,
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
