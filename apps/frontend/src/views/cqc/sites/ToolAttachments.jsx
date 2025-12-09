import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { addToolEvidence } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsInputDropZone } from "@/views/shared/ImsFormElements/Index";
import { ToolActionsContext } from "./context/ToolActionsContext";

const ToolAttachments = ({ toolControl }) => {
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

  let notify = React.useContext(NotificationContext);
  const { refreshControl, processing, setProcessing } =
    useContext(ToolActionsContext);
  const { dataModel, handleSubmit, validate, handleFileChange } = useForm(
    dataSet,
    schema
  );
  let doSubmit = async (e) => {
    let submissionType = e.currentTarget.name;
    try {
      switch (submissionType) {
        case "attach": {
          setProcessing({ action: "attach-docs", id: null });
          let { data } = await addToolEvidence(toolControl._id, dataModel.data);
          notify("Document attached successfully ", "success");
          refreshControl(data.control);
          break;
        }
      }
    } catch (ex) {
      notify("Document could not be added", "danger");
      imsLogger("CQCSitesToolAttachments", ex.response || ex);
    }
    setProcessing(false);
  };
  let { data, errors } = dataModel;
  return (
    <div className="form-horizontal mt-2">
      <ImsInputDropZone
        label="Evidences"
        clearAll={!data.docs.length}
        name="cqcEvidence"
        onLoad={(files) => handleFileChange(files, "docs")}
      />
      <div className="pl-3">
        {
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
        }
      </div>
    </div>
  );
};

export default ToolAttachments;
