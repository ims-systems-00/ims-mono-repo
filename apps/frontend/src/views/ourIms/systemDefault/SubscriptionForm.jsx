import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import { addReportSubscriber } from "@/services/organizationService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import {
  ImsInputDate,
  ImsInputSelect,
  ImsInputText,
} from "@ims-systems-00/ims-ui-kit";
import ACTIONS from "./actions";
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
const SubscriptionForm = ({ processing, dispatch, addToTable }) => {
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
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "confirm": {
          dispatch({
            [ACTIONS.ADD_SUBSCRIBER]: { status: true, error: false, id: null },
          });
          let { data } = await addReportSubscriber(dataModel.data);
          addToTable && addToTable(data.subscriber);
          notify("Report interval successfully scheduled", "success");
          break;
        }
        case "reset": {
        }
      }
    } catch (ex) {
      imsLogger("SubscriptionForm", ex.response || ex);
      notify(ex.response.data.message, "danger");
    }
    dispatch({
      [ACTIONS.ADD_SUBSCRIBER]: { status: false, error: false, id: null },
    });
  };

  const { dataModel, handleChange, handleSubmit, validate, setDataModel } =
    useForm(dataSet, schema);
  let { data, errors } = dataModel;
  return (
    <div>
      <Form action="/" className="form-horizontal" onSubmit={handleSubmit}>
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
            onClick={(e) => handleSubmit(e, doSubmit)}
            disabled={
              validate() ? true : processing[ACTIONS.ADD_SUBSCRIBER].status
            }
            className="btn-fill"
            color="primary"
            type="button"
          >
            {processing[ACTIONS.ADD_SUBSCRIBER].status
              ? "Processing"
              : "Create"}
          </Button>
          <Button
            name="reset"
            onClick={(e) => handleSubmit(e, doSubmit)}
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
