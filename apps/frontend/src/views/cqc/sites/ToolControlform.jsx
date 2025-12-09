import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { mapToControlModel, updateControl } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";

const ToolControlform = ({
  toolControl,
  processing,
  setProcessing,
  refreshControl,
}) => {
  let notify = React.useContext(NotificationContext);
  let viewContextData = useContext(ViewContext);
  const dataSet = toolControl
    ? mapToControlModel(toolControl)
    : {
        data: {
          clause: toolControl.control.clause,
          adopted: {
            value: null,
            label: "Yes",
          },
        },
        errors: {},
      };
  const schema = {
    clause: IVal.label("clause"),
    adopted: IVal.object().keys({
      value: IVal.label("Adopted"),
      label: IVal.label("Adopted"),
    }),
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );

  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "update": {
          setProcessing({ action: "update", id: null });
          let { data } = await updateControl(toolControl._id, dataModel.data, {
            query: `group=${toolControl.group._id}`,
          });
          // refreshControl && refreshControl(data.tool)
          notify("Tool updated successfully", "success");
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("CQCSitesToolControlForm", ex.response, ex);
      notify("Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" onSubmit={handleSubmit}>
      <ImsInputText
        label="Clause"
        name="name"
        disabled={true}
        value={toolControl.control.clause}
        onChange={handleChange}
        placeholder="Name"
      />
      <ImsInputText
        label="KLOE-Prompt"
        name="name"
        value={toolControl.control.kloe}
        disabled={true}
        onChange={handleChange}
        error={errors.name}
        placeholder="Name"
      />
      <ImsInputSelect
        label="Adopted"
        name="adopted"
        value={data.adopted}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={["Yes", "No"].map((item) => ({ value: item, label: item }))}
      />
      <ImsButtonGroup>
        <Button
          name="cancel"
          className="btn-fill"
          color="danger"
          type="button"
          onClick={handleCancelClick}
        >
          Cancel
        </Button>
        <Button
          name="update"
          onClick={(e) => handleSubmit(e, doSubmit, false)}
          disabled={validate() ? true : processing.action === "update"}
          className="btn-fill"
          color="info"
          type="button"
        >
          {processing.action === "update"
            ? "Processing"
            : data.adopted.label === "Yes"
            ? "Adopted"
            : "Update"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default ToolControlform;
