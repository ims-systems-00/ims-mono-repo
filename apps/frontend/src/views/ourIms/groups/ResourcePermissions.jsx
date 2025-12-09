import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsInputSelect } from "@/views/shared/CustomFormElements";
const resources = [
  {
    value: "risk-management-hardware",
    label: (
      <>
        <div>Risk management - hardware</div>
        <div></div>
      </>
    ),
  },
  {
    value: "risk-management-software",
    label: (
      <>
        <div>Risk management - software</div>
        <div></div>
      </>
    ),
  },
  {
    value: "risk-management-people",
    label: (
      <>
        <div>Risk management - people</div>
        <div></div>
      </>
    ),
  },
  {
    value: "risk-management-premises",
    label: (
      <>
        <div>Risk management - premises</div>
        <div></div>
      </>
    ),
  },
  {
    value: "risk-management-organisational",
    label: (
      <>
        <div>Risk management - orgnisational</div>
        <div></div>
      </>
    ),
  },
  {
    value: "risk-management-clinic",
    label: (
      <>
        <div>Risk management - clinic</div>
        <div></div>
      </>
    ),
  },
  {
    value: "incident-management",
    label: (
      <>
        <div>Incident management</div>
        <div></div>
      </>
    ),
  },
  {
    value: "internal-audits",
    label: (
      <>
        <div>Internal audits</div>
        <div></div>
      </>
    ),
  },
  {
    value: "external-audits",
    label: (
      <>
        <div>External audits</div>
        <div></div>
      </>
    ),
  },
  {
    value: "management-reviews",
    label: (
      <>
        <div>Management review</div>
        <div></div>
      </>
    ),
  },
  {
    value: "kpi-objectives",
    label: (
      <>
        <div>Kpi objectives</div>
        <div></div>
      </>
    ),
  },
];

const ResoucePermissions = ({}) => {
  let dataSet = {
    data: {
      resources: "",
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    resources: IVal.string()
      .required()
      .valid(
        "system-administrator",
        "business-function",
        "compliance-body",
        "supplier-partner"
      )
      .label("Type"),
  };

  // submission logic to sever goes here ...
  let doSubmit = async () => {
    try {
      // api call
    } catch (ex) {
      if (
        ex.response &&
        ex.response.status >= 400 &&
        ex.response.status < 500
      ) {
        imsLogger("ResourcePermissions", ex.response);
        notify(
          ex.response.data.errors[0].msg ||
            "Business function could not be created",
          "danger"
        );
      }
    }
  };
  // initializig hooks requried hooks...
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let notify = React.useContext(NotificationContext);

  let { data, errors } = dataModel;

  return (
    <Form
      action="/"
      className="form-horizontal"
      onSubmit={(e) => handleSubmit(e, doSubmit)}
    >
      <ImsInputSelect
        label="Permitted resources"
        name="resources"
        value={{ value: data.resources, label: data.resources }}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={resources}
      />
      <Row>
        <Col sm="2"></Col>
        <Col sm="4">
          <Button
            disabled={validate() ? true : false}
            className="btn-fill"
            color="primary"
            type="button"
          >
            {"Confirm"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ResoucePermissions;
