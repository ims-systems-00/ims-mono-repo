import React from "react";
import useSignatureStore from "./useSignatureStore";
export const SignatureContext = React.createContext();
const SignatureContextProvider = ({ children, ...rest }) => {
  let { ...store } = useSignatureStore({
    repoId: rest.repoId,
    docId: rest.docId,
  });
  return (
    <SignatureContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </SignatureContext.Provider>
  );
};
export default SignatureContextProvider;
