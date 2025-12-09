import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  Form,
  Row,
  ImsInputText,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import IVal from "@/validations/validator";
import NotificationContext from "../../contexts/notificationContext";
const dataSet = {
  data: {
    person: "",
    personEmail: "",
  },
  errors: {},
};
// Validation rules ....
const schema = {
  person: IVal.string().required().label("Name"),
  personEmail: IVal.string().email().required().label("Email"),
};

const ExtractReport = ({ drawerView, onSubmit = () => {} }) => {
  let notify = React.useContext(NotificationContext);

  const { isBusy, dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      {drawerView && (
        <h4 className="text-center text-info mb-2">Send Report</h4>
      )}
      <ImsInputText
        label="Person"
        name="person"
        value={data.person}
        onChange={handleChange}
        error={errors.person}
        placeholder="Name"
      />
      <ImsInputText
        label="Email"
        name="personEmail"
        value={data.personEmail}
        onChange={handleChange}
        error={errors.personEmail}
        placeholder="Email address"
      />
      <Button
        name="send"
        disabled={validate() ? true : isBusy}
        className="btn-fill"
        color="primary"
        type="button"
        onClick={(e) => {
          handleSubmit(e, () => onSubmit(dataModel.data));
        }}
      >
        {isBusy ? "Sending..." : "Send report"}
      </Button>
    </Form>
  );
};

export default ExtractReport;
