import React, { useContext } from "react";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import { DataImportContext } from "../importerStore/Context";
import ErrorReport from "./ErrorReport/Index";
import ValidationForm from "./ValidationForm";
import ValidationProgress from "./ValidationProgress";
export default function SectionC({}) {
  let { importerState } = useContext(DataImportContext);
  return (
    <>
      {importerState.sheets?.length ? (
        <>
          <DetailsSectionHeader title={`3. Validate your dataset`} />
          <ErrorReport />
          <ValidationProgress />
          <ValidationForm />
        </>
      ) : null}
    </>
  );
}
