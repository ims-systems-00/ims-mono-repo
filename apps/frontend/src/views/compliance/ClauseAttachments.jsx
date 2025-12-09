import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { addEvidenceToCompliance } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
} from "@/views/shared/ImsFormElements/Index";
import { ComplianceActionsContext } from "./contexts/ComplianceActionsContext";

const ClauseAttachments = ({ clauseTool, updateDataTable }) => {
  const dataSet = {
    data: {
      docs: [],
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    docs: IVal.array().label("docs"),
  };
  const { closeDrawer } = useDrawer();
  let notify = React.useContext(NotificationContext);
  const { setProcessing, processing } = useContext(ComplianceActionsContext);
  const { dataModel, handleSubmit, validate, handleFileChange } = useForm(
    dataSet,
    schema
  );
  let doSubmit = async (e) => {
    let submissionType = e.currentTarget.name;
    try {
      // eslint-disable-next-line default-case
      switch (submissionType) {
        case "attach": {
          setProcessing({ action: "attach-docs", id: null });
          await addEvidenceToCompliance(clauseTool._id, dataModel.data);
          notify("Document attached successfully ", "success");
          closeDrawer("complaince-detail");
          updateDataTable();
          break;
        }
      }
    } catch (ex) {
      notify("Document could not be added", "danger");
      imsLogger("ClauseAttachments", ex.response || ex);
    }
    setProcessing(false);
  };
  let { data, errors } = dataModel;
  return (
    <div className="form-horizontal mt-2">
      <ImsInputDropZone
        label="Evidences"
        clearAll={!data.docs.length}
        name="isoEvidence"
        onLoad={(files) => handleFileChange(files, "docs")}
      />
      <ImsButtonGroup>
        <Button
          name="attach"
          onClick={(e) => handleSubmit(e, doSubmit)}
          disabled={
            validate() || !data.docs.length
              ? true
              : processing.action === "attach-docs"
          }
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing.action === "attach-docs" ? "Processing" : "Attach"}
        </Button>
      </ImsButtonGroup>
      {/* <Row>
        <Col sm="2"></Col>
        <Col sm="3">{}</Col>
      </Row> */}
    </div>
  );
};

export default ClauseAttachments;
