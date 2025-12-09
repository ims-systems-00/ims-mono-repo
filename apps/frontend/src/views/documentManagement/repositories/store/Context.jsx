import React from "react";
import useStore from "./useStore";

export const RepositoriesContext = React.createContext();

const RepositoriesContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore({
    ...rest,
  });
  return (
    <RepositoriesContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </RepositoriesContext.Provider>
  );
};
export default RepositoriesContextProvider;
