import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useConstants from "@/hooks/useConstants";
import useDebounce from "@/hooks/useDebounce";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  Form,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { mapToUserModel } from "./dataModels/userMaper";

const UserForm = ({ user, onSubmit = () => {} }) => {
  let dataSet = user
    ? mapToUserModel(user)
    : {
        data: {
          firstName: "",
          lastName: "",
        },
        errors: {},
      };
  const schema = {
    firstName: IVal.string().required().label("First name"),
    lastName: IVal.string().required().label("Last name"),
  };

  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema
  );

  let { data, errors } = dataModel;

  return (
    <Form action="/" className="form-horizontal">
      <Row>
        <Col md="6">
          <ImsInputText
            label="First name"
            name="firstName"
            mandatory={true}
            value={data.firstName}
            onChange={handleChange}
            error={errors.firstName}
            placeholder="First name"
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Last name"
            name="lastName"
            mandatory={true}
            value={data.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Last name"
          />
        </Col>
      </Row>
      <ImsButtonGroup>
        {user ? (
          <Button
            name="update"
            disabled={validate() ? true : isBusy}
            className="btn-fill"
            color="primary"
            type="button"
            onClick={(e) =>
              handleSubmit(e, () => onSubmit(dataModel.data), false)
            }
          >
            {isBusy ? "Processing" : "Update"}
          </Button>
        ) : (
          <Button
            name="create"
            disabled={validate() ? true : isBusy}
            className="btn-fill"
            color="primary"
            type="button"
            onClick={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
          >
            {isBusy ? "Processing" : "Confirm"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default UserForm;
