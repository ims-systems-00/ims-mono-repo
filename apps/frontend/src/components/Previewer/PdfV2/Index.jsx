import React from "react";
import Content from "./Content";
import ViewerContextProvider from "./store/Context";

const Pdf = ({ fileDetails, onPageClick }) => {
  return (
    <>
      <ViewerContextProvider
        fileDetails={fileDetails}
        onPageClick={onPageClick}
      >
        <Content />
      </ViewerContextProvider>
    </>
  );
};

export default Pdf;
