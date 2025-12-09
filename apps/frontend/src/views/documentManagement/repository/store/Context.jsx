import React from "react";
import useRepositoryStore from "./useRepositoryStore";
export const RepositoryContext = React.createContext();
const RepositoryContextProvider = ({ children, ...rest }) => {
  let { ...store } = useRepositoryStore({ repoId: rest.repoId });
  return (
    <RepositoryContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};
export default RepositoryContextProvider;
