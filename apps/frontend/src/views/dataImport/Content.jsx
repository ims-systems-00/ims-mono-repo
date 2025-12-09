import React, { useContext } from "react";
import { DataImportContext } from "./importerStore/Context";
import Congratulations from "./congratulations/Congratulations";
import SectionA from "./section.a/Section.a";
import SectionB from "./section.b/Section.b";
import SectionC from "./section.c/Section.c";
import SectionD from "./section.d/Section.d";
import Box from "@/components/Box/Index";

const Content = (props) => {
  let { importerState } = useContext(DataImportContext);
  return (
    <Box>
      {!importerState.submissionSuccess ? (
        <>
          <SectionA />
          <SectionB />
          <SectionC />
          <SectionD />
        </>
      ) : (
        <Congratulations />
      )}
    </Box>
  );
};

export default Content;
