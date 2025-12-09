import NotificationContext from "@/contexts/notificationContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { RESOURCES } from "@/rolesAndPermissions";
import { makeLicenseRequest } from "@/services/licensemanagementServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import {} from "@/views/shared/CustomFormElements";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";

const MakeRequest = ({ processing, setProcessing, addToTable }) => {
  let notify = React.useContext(NotificationContext);
  let { authGlobalAccess } = useAccess();
  let { groups } = React.useContext(SuperGlobalContext);
  const dataSet = {
    data: {
      type: authGlobalAccess()
        ? {
            value: "Organisational",
            label: "Organisational",
          }
        : {
            value: "Business unit",
            label: "Business unit",
          },
      groupAmount: 0,
      userAmount: 0,
      message: "",
      complianceTools: [],
    },
    errors: {},
  };
  const schema = {
    type: IVal.object().keys({
      value: IVal.string().required().label("Type"),
      label: IVal.string().required().label("Type"),
    }),
    groupAmount: IVal.number().integer().min(0).label("Group licence"),
    userAmount: IVal.number().integer().min(0).label("User licence"),
    message: IVal.string().label("Message"),
    complianceTools: IVal.array().items(),
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
          let { data } = await makeLicenseRequest(dataModel.data);
          addToTable && addToTable(data.request);
          notify("Licence request sent successfully", "success");
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      notify("Licence request failed", "danger");
      imsLogger("MakeRequest", ex.response || ex);
    }
    setProcessing({ action: null, id: null });
  };
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" onSubmit={handleSubmit}>
      <Row>
        {data.type.value === "Organisational" && (
          <Col md="6">
            <ImsInputText
              label="Business unit licences"
              type="number"
              name="groupAmount"
              value={data.groupAmount}
              onChange={handleChange}
              error={errors.groupAmount}
            />
          </Col>
        )}
        <Col md="6">
          <ImsInputText
            label="User licences"
            type="number"
            name="userAmount"
            value={data.userAmount}
            onChange={handleChange}
            error={errors.userAmount}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            isMulti
            placeholder="Toolkit"
            label="Toolkit"
            name="complianceTools"
            value={data.complianceTools}
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
        </Col>
        <Col md="6">
          <ImsInputText
            label="Message"
            cols="80"
            placeholder="Message"
            rows="2"
            type="textarea"
            name="message"
            value={data.message}
            onChange={handleChange}
            error={errors.message}
          />
        </Col>
      </Row>
      <ImsButtonGroup>
        <Button
          name="confirm"
          onClick={(e) => handleSubmit(e, doSubmit)}
          disabled={validate() ? true : processing.action === "confirm"}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing.action === "confirm" ? "Processing..." : "Confirm"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default MakeRequest;
