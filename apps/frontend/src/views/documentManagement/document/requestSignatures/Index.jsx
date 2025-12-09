import React from "react";
import Content from "./Content";
import RequestSignatureContextProvider from "./store/Context";
const RequestSignatures = ({ onComplete }) => {
  return (
    <RequestSignatureContextProvider onComplete={onComplete}>
      <Content />
    </RequestSignatureContextProvider>
  );
};

export default RequestSignatures;
