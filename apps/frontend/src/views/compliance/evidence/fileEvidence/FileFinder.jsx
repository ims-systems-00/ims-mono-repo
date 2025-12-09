import { useState } from "react";
import ComplianceActionsContextProvider from "@/views/compliance/contexts/ComplianceActionsContext";
import { EvidenceAttachments } from "@/views/shared/EvidenceAttachments";

export const FileFinder = ({ compliance, updateDataTable }) => {
  let [processing, setProcessing] = useState({
    action: "load-clause",
    id: null,
    error: false,
  });

  return (
    <ComplianceActionsContextProvider
      value={{ clauseTool: compliance, setProcessing, processing }}
    >
      <h5 className="text-dark mb-4">
        {compliance?.control?.clause} - {compliance?.control?.title}
      </h5>

      <EvidenceAttachments controlId={compliance?._id} />
    </ComplianceActionsContextProvider>
  );
};
