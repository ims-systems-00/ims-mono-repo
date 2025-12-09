import React from "react";
import useRequestSignatureStore from "./useRequestSignatureStore";
export const RequestSignature = React.createContext();
const RequestSignatureContextProvider = ({ children, onComplete }) => {
  let { ...store } = useRequestSignatureStore({});
  return (
    <RequestSignature.Provider
      value={{
        ...store,
        onComplete,
      }}
    >
      {children}
    </RequestSignature.Provider>
  );
};
export default RequestSignatureContextProvider;
