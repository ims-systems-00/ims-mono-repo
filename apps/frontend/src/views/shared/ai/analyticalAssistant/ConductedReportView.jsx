import MDFormatedText from "@/components/MDFormated/MDFormatedText";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import Analysis from "./Analysis";
import { useAnalyticalAssistant } from "./store";
import USER_ACTIONS from "./store/actions";
import useAlerts from "@/hooks/useAlerts";

const ConductedReportView = ({}) => {
  const { deleteAIResponse, processing, visitSavedResponse, visitingResponse } =
    useAnalyticalAssistant();
  const { alert, warningWithConfirmMessage } = useAlerts();
  if (!visitingResponse)
    return <p className="text-center">This report has been deleted.</p>;
  return (
    <div className="my-3">
      {alert}
      <div className="mb-5">
        <MDFormatedText>
          {visitingResponse?.template?.dataDisplay}
        </MDFormatedText>
      </div>
      {visitingResponse?.template?.reportStructure?.map((analysis, i) => {
        return <Analysis analysis={analysis} />;
      })}
      <Button
        color="danger"
        block
        onClick={() => {
          warningWithConfirmMessage(
            "This analysis will be deleted.",
            async () => {
              await deleteAIResponse(visitingResponse?._id);
              visitSavedResponse(null);
            }
          );
        }}
        className="my-2"
        disabled={processing[USER_ACTIONS.DELETE_AI_RESPONSE].status}
      >
        {processing[USER_ACTIONS.DELETE_AI_RESPONSE].status ? (
          <React.Fragment>Deleting</React.Fragment>
        ) : (
          <React.Fragment>Delete analysis</React.Fragment>
        )}
      </Button>
    </div>
  );
};

export default ConductedReportView;
