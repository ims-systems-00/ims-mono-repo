import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  Form,
  ImsInputDate,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
const intervals = [
  {
    value: "Monthly",
    label: "Monthly",
  },
  {
    value: "Quarterly",
    label: "Quarterly",
  },
  {
    value: "Half yearly",
    label: "Half-yearly",
  },
  {
    value: "Yearly",
    label: "Yearly",
  },
];
const SubscriptionForm = ({ onSubmit = () => {} }) => {
  let notify = React.useContext(NotificationContext);
  const dataSet = {
    data: {
      name: "",
      email: "",
      interval: "Monthly",
      date: "",
    },
    errors: {},
  };
  const schema = {
    name: IVal.string().required().label("Name"),
    email: IVal.string().email().required().label("Email"),
    interval: IVal.object().keys({
      value: IVal.string().required().label("Interval"),
      label: IVal.label("Interval"),
    }),
    date: IVal.string().required().label("Issue date "),
  };
  const { dataModel, handleChange, handleSubmit, isBusy, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  return (
    <div>
      <Form action="/" className="form-horizontal">
        <Row>
          <Col md="6">
            <ImsInputText
              label="Person name"
              name="name"
              placeholder="Name"
              value={data.name}
              onChange={handleChange}
              error={errors.name}
            />
          </Col>
          <Col md="6">
            <ImsInputText
              label="Email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              error={errors.email}
            />
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <ImsInputDate
              label="Issue date"
              name="date"
              value={data.date}
              onChange={handleChange}
              error={errors.date}
            />
          </Col>
          <Col md="6">
            <ImsInputSelect
              label="Interval"
              name="interval"
              icon="icon-app"
              className="react-select default"
              classNamePrefix="react-select"
              error={errors.interval}
              value={data.interval}
              onChange={handleChange}
              options={intervals}
            />
          </Col>
        </Row>

        <ImsButtonGroup>
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
            {isBusy ? "Processing" : "Add"}
          </Button>
          <Button
            name="reset"
            // onClick={(e) => {
            //   handleSubmit(e, () => onSubmit());
            // }}
            className="btn-fill"
            color="primary"
            type="button"
          >
            Reset
          </Button>
        </ImsButtonGroup>
      </Form>
    </div>
  );
};

export default SubscriptionForm;
