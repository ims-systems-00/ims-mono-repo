// contexts ...
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import { Col, Progress, Row } from "@ims-systems-00/ims-ui-kit";
import { useCallback, useContext, useEffect, useState } from "react";
import { getCurrentSessionData } from "@/services/authService";
import { startListening, stopListening } from "@/services/webSocketService";
import { USER_ACTIONS } from "../importerStore/actions";
import { DataImportContext } from "../importerStore/Context";
import { useApplication } from "@/stores/applicationStore";
const ValidationProgress = ({}) => {
  let { processing, importerState } = useContext(DataImportContext);
  let [__state, setState] = useState({
    currentField: "Not started yet",
    progress: 0,
    rowNumber: 0,
  });
  let { socketSubscriptionDetails } = useApplication();
  let _updateState = useCallback((_data) => {
    setState({
      currentField: _data.field,
      progress: _data.progress,
      rowNumber: _data.rowNumber,
    });
  }, []);
  useEffect(() => {
    let events = { new_validated_row_info: "new-validated-row-info" };
    if (getCurrentSessionData())
      startListening(events.new_validated_row_info, _updateState);
    return () => {
      stopListening(events.new_validated_row_info, _updateState);
    };
  }, [socketSubscriptionDetails]);
  return (
    <>
      {processing[USER_ACTIONS.VALIDATION].status && (
        <Row>
          <Col md="5">
            {importerState?.validationDataTransferProgress ? (
              <span className="font-size-subtitle-2">
                Loading your datasets for{" "}
                <span className="text-warning">Validation</span>
              </span>
            ) : (
              <span>Processing {__state?.currentField}: </span>
            )}
          </Col>
          <Col md="5">
            <span className="mb-2 font-size-subtitle-2">
              {importerState?.validationDataTransferProgress ||
                __state?.progress}{" "}
              %
            </span>
            <Progress
              value={
                importerState?.validationDataTransferProgress ||
                __state?.progress
              }
            />
          </Col>
          <Col md="2">
            {importerState?.validationDataTransferProgress ? null : (
              <span className="text-secondary font-size-subtitle-2">
                <span className="text-warning">{__state?.rowNumber}</span> rows
              </span>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};
export default ValidationProgress;
