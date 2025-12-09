import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import {
  mapToClauseModel,
  updateISOControl,
} from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";

const ClauseUpdateForm = ({
  clauseTool,
  processing,
  setProcessing,
  refreshClause,
}) => {
  let notify = React.useContext(NotificationContext);
  let viewContextData = useContext(ViewContext);
  const dataSet = clauseTool
    ? mapToClauseModel(clauseTool)
    : {
        data: {
          name: clauseTool.name,
          clause: clauseTool.control.clause,
          title: clauseTool.control.title,
          state: {
            value: null,
            label: "Yes",
          },
          selected: {
            value: null,
            label: "Not Selected",
          },
        },
        errors: {},
      };
  const schema = {
    name: IVal.label("Name"),
    clause: IVal.label("Clause"),
    title: IVal.label("Title"),
    state: IVal.object().keys({
      value: IVal.label("State"),
      label: IVal.label("State"),
    }),
    selected: IVal.object().keys({
      value: IVal.label("Selected"),
      label: IVal.label("Selected"),
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
          let { data } = await updateISOControl(dataModel.data);
          refreshClause && refreshClause(data.control);
          notify("Tool updated successfully", "success");
          viewContextData.switchView && viewContextData.switchView();
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("ClauseUpdateForm", ex.response, ex);
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
        label="Title"
        name="name"
        value={clauseTool.control.title}
        disabled={true}
        onChange={handleChange}
        error={errors.name}
        placeholder="Name"
      />
      <Row>
        <Col md="6">
          <ImsInputText
            label="Name"
            name="name"
            value={clauseTool.name}
            disabled={true}
            onChange={handleChange}
            error={errors.name}
            placeholder="Name"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Control"
            name="name"
            disabled={true}
            value={clauseTool.control.clause}
            onChange={handleChange}
            placeholder="Name"
          />
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <ImsInputSelect
            label="Select control"
            name="selected"
            value={data.selected}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={["Not selected", "Selected"].map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label={"Status"}
            name="state"
            value={data.state}
            isDisabled={data.selected.label === "Not selected"}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={["Not implemented", "Implemented"].map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Col>
      </Row>

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
            : (clauseTool.name === IMS_SERVICES.ISO27002 &&
                data.selected.label === "Selected") ||
              data.state.label === "Yes"
            ? "Adopted"
            : "Update"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default ClauseUpdateForm;
