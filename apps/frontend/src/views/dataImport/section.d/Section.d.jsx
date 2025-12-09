import { useContext } from "react";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import { DataImportContext } from "../importerStore/Context";
import ConfirmationForm from "./ConfirmationForm";
import DataTrasferProgress from "./DataTrasferProgress";
export default function SectionD({}) {
  let { importerState, dispatchImporterState } = useContext(DataImportContext);
  return (
    <>
      {importerState.validationSuccess ? (
        <>
          <DetailsSectionHeader
            className="mt-3"
            title={`4. Start importing dataset`}
          />
          <span className="text-secondary font-size-subtitle-2">
            Your sheets were scanned and validated successfully. Please review
            everything one last time. If you make any changes in{" "}
            <span className="text-warning">step 1</span> or{" "}
            <span className="text-warning">step 2</span>, please click{" "}
            <span className="text-info">Validate dataset</span> in{" "}
            <span className="text-warning">step 3</span> before you start
            migration. Otherwise you may run into validation error.
          </span>
          <DataTrasferProgress />
          <ConfirmationForm />
        </>
      ) : null}
    </>
  );
}
