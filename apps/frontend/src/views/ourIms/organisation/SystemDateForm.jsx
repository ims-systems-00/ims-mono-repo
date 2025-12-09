import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  Form,
  ImsInputDate,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { mapToSystemDates } from "@/services/organizationService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/CustomFormElements";

const SystemDateForm = ({ organisation, onSubmit = () => {} }) => {
  let notify = React.useContext(NotificationContext);
  const dataSet = organisation
    ? mapToSystemDates(organisation)
    : {
        data: {
          start: "",
          end: "",
        },
        errors: {},
      };
  const schema = {
    start: IVal.label("System start date"),
    end: IVal.label("System end date"),
  };

  const { dataModel, handleChange, handleSubmit, isBusy, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      <Row>
        <Col md="6">
          <ImsInputDate
            label="System start date"
            name="start"
            value={data.start}
            onChange={handleChange}
            error={errors.start}
          />
        </Col>
        <Col md="6">
          <ImsInputDate
            label="System end date"
            name="end"
            value={data.end}
            onChange={handleChange}
            error={errors.end}
          />
        </Col>
      </Row>

      <ImsButtonGroup>
        {" "}
        <Button
          name="confirm"
          onClick={(e) => {
            handleSubmit(e, () => onSubmit(dataModel.data), false);
          }}
          disabled={validate() ? true : isBusy}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {isBusy ? "Processing..." : "Confirm"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default SystemDateForm;
