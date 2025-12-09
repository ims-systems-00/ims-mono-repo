import React from "react";

import { useDocument } from "../store";
import Trails from "./Trails";
import { AuditTrailContextProvider } from "./store";
import Loading from "@/components/Loader/Loading";
const AuditTrail = ({}) => {
  const { document } = useDocument();
  return (
    <React.Fragment>
      {document ? (
        <AuditTrailContextProvider document={document}>
          <Trails />
        </AuditTrailContextProvider>
      ) : (
        <Loading text="Preparing document activities" />
      )}
    </React.Fragment>
  );
};

export default AuditTrail;
