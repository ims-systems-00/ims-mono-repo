import NotificationContext from "@/contexts/notificationContext";
import {
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
} from "@ims-systems-00/ims-ui-kit";
import { useForm } from "@ims-systems-00/ims-react-hooks";

import React from "react";
import { setupPassword } from "@/services/authService";
import * as yup from "yup";

import useError from "../../hooks/error";
import Layout from "./Layout";
const SetupPassword = (props) => {
  const { handleError } = useError();
  let notify = React.useContext(NotificationContext);
  // defination of dataSet ...
  let dataSet = {
    password: "",
    passwordConfirm: "",
  };
  // Validation rules ....
  const schema = yup.object({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(25, "Password must not exceed 25 characters")
      .required("Password is required")
      .label("Password"),
    passwordConfirm: yup
      .string()
      // .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required")
      .label("Confirm password"),
  });

  // submission logic to sever goes here ...
  let doSubmit = async () => {
    try {
      let password = dataModel.password;
      let token = props.match.params.token;
      let { data } = await setupPassword({ password, token });
      notify(data.message, "success");
      window.location = "/auth/login";
    } catch (ex) {
      handleError(ex);
    }
  };
  const {
    dataModel,
    handleChange,
    handleSubmit,
    isFormValid,
    isBusy,
    validationErrors,
  } = useForm(dataSet, schema);

  return (
    <Layout>
      <div className="">
        <h4>Reset your password</h4>
        <p className="mb-3">Please select a strong new password.</p>
      </div>
      <InputGroup className="shadow-md">
        <InputGroupText>
          <i className={`ims-icons-20 icon-icon-lock-24`} />
        </InputGroupText>
        <Input
          type="password"
          placeholder="New password"
          name="password"
          value={dataModel.password}
          onChange={(e) =>
            handleChange({
              field: "password",
              value: e.currentTarget.value,
            })
          }
        />
      </InputGroup>
      <InputGroup className="shadow-md">
        <InputGroupText>
          <i className={`ims-icons-20 icon-icon-lock-24`} />
        </InputGroupText>
        <Input
          type="password"
          placeholder="Confirm password"
          value={dataModel.passwordConfirm}
          onChange={(e) =>
            handleChange({
              field: "passwordConfirm",
              value: e.currentTarget.value,
            })
          }
        />
      </InputGroup>
      <Button
        block
        type="submit"
        disabled={
          !isFormValid() ||
          isBusy ||
          dataModel.password !== dataModel.passwordConfirm
        }
        className="mb-3"
        color="primary"
        size="md"
        onClick={(e) => handleSubmit(e, doSubmit)}
      >
        {!isBusy ? (
          "Confirm"
        ) : (
          <span>
            Changing password <Spinner size="sm" />
          </span>
        )}
      </Button>
    </Layout>
  );
};

export default SetupPassword;
