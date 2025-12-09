import NotificationContext from "@/contexts/notificationContext";
import useCache from "@/hooks/useCache";
import useForm from "@/hooks/useForm";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { assignComplianceToolkit } from "@/services/iamGroupServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect } from "@ims-systems-00/ims-ui-kit";

const ToolkitForm = ({
  group,
  licenses,
  processing,
  setProcessing,
  refreshGroup,
}) => {
  let { cacheData } = useCache();
  let notify = React.useContext(NotificationContext);
  let tools = group.userLicenses.complianceTools;
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
          let { data } = await assignComplianceToolkit(
            group._id,
            dataModel.data
          );
          notify("Toolkit licenses updated", "success");
          refreshGroup && refreshGroup(data.iamGroup);
          cacheData();
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
        options={
          licenses
            ? licenses.complianceTools.map((tool) => ({
                value: tool.name,
                label: tool.name,
              }))
            : []
        }
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
