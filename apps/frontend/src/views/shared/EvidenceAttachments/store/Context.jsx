import React, { createContext } from "react";
import { useStore } from "./useStore";

export const EvidenceAttachmentContext = createContext(undefined);

export const EvidenceAttachmentContextProvider = ({
  children,
  controlId = null,
  readOnly = false,
  disableEmptyBlock = false,
}) => {
  const store = useStore({
    controlId,
  });

  return (
    <EvidenceAttachmentContext.Provider
      value={{ ...store, readOnly, disableEmptyBlock }}
    >
      {children}
    </EvidenceAttachmentContext.Provider>
  );
};
