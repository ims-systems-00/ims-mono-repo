import { useForm } from "@ims-systems-00/ims-react-hooks";
import {
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
} from "@ims-systems-00/ims-ui-kit";
import NotificationContext from "@/contexts/notificationContext";
import useDataProcessing from "@/hooks/useProcessing";

import React from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/services/authService";
import * as yup from "yup";
import useError from "../../hooks/error";
import Layout from "./Layout";
const ForgotPassword = () => {
  let notify = React.useContext(NotificationContext);
  let { processing, setProcessing } = useDataProcessing();
  // defination of dataSet ...
  let dataSet = {
    email: "",
  };
  // Validation rules ....
  const schema = yup.object({
    email: yup.string().email().required().label("Email"),
  });
  const { handleError } = useError();
  // submission logic to sever goes here ...
  let doSubmit = async () => {
    try {
      setProcessing("Sending email");
      let { data } = await forgotPassword(dataModel);
      notify(data.message, "success");
      setProcessing("Mail sent");
    } catch (ex) {
      handleError(ex);
      setProcessing("Mail not sent");
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
        <h4>Forgot password?</h4>
        <p className="mb-3">
          {" "}
          Please enter your email address and we will send you a verification
          code.
        </p>
      </div>
      <InputGroup className="shadow-md">
        <InputGroupText>
          <i className={`ims-icons-20 icon-icon-envelope-24`} />
        </InputGroupText>
        <Input
          type="email"
          placeholder="i.e. hello@imssystems.tech"
          value={dataModel.email}
          onChange={(e) =>
            handleChange({
              field: "email",
              value: e.currentTarget.value,
            })
          }
          error={validationErrors.email}
        />
      </InputGroup>
      <Button
        block
        disabled={!isFormValid() || isBusy}
        color="primary"
        type="submit"
        onClick={(e) => handleSubmit(e, doSubmit)}
        size="md"
      >
        {isBusy ? (
          <span>
            Sending email <Spinner size="sm" />
          </span>
        ) : (
          "Send verification email"
        )}
      </Button>
      {processing === "Mail sent" ? (
        <div>
          <div className="pull-left mt-2">
            <small className="text-primary ">
              <i>
                An email has been sent to your email to reset your password.
                Please check your inbox.
              </i>
            </small>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="pull-right mt-2">
        <h6 className="font-size-caption">
          <Link className="link footer-link" to="/auth/login">
            Login
          </Link>
        </h6>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
