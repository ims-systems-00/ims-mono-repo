import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { RESOURCES } from "@/rolesAndPermissions";
import { imsLogger } from "@/services/loggerService";
import { assignComplianceToolkit } from "@/services/userServices";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputSelect,
} from "@/views/shared/CustomFormElements";

const ToolkitForm = ({ userId, tools, processing, setProcessing }) => {
  let notify = React.useContext(NotificationContext);
  const dataSet = {
    data: {
      toolkit: tools
        ? tools.map((toolkit) => ({
            value: toolkit,
            label: toolkit,
          }))
        : [],
    },
    errors: {},
  };
  const schema = {
    toolkit: IVal.array().items(),
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );

  let doSubmit = async (e) => {
    let submissionType = e.currentTarget.name;
    try {
      switch (submissionType) {
        case "confirm": {
          setProcessing({ action: "confirm", id: null });
          let { data } = await assignComplianceToolkit(userId, dataModel.data);
          notify("Toolkit licenses updated", "success");
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      notify("Toolkit assign failed", "danger");
      imsLogger("ToolkitForm", ex.response || ex);
    }
    setProcessing({ action: null, id: null });
  };

  let { data, errors } = dataModel;
  return (
    <div className="form-horizontal">
      <ImsInputSelect
        isMulti
        placeholder="Toolkit"
        label="Toolkit"
        name="toolkit"
        value={data.toolkit}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={Object.values(RESOURCES)
          .filter((item) => item !== RESOURCES.ALL)
          .map((item) => ({
            value: item,
            label: item,
          }))}
      />
      <ImsButtonGroup>
        <Button
          name="confirm"
          size="sm"
          className="btn-simple btn-primary"
          color="primary"
          type="button"
          disabled={validate() ? true : processing.action === "confirm"}
          onClick={(e) => handleSubmit(e, doSubmit, false)}
        >
          {processing.action === "confirm" ? "Adding..." : "Confirm"}
        </Button>
      </ImsButtonGroup>
    </div>
  );
};

export default ToolkitForm;
