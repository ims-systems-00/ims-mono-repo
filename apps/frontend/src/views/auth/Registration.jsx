import {
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
} from "@ims-systems-00/ims-ui-kit";
import { useForm } from "@ims-systems-00/ims-react-hooks";

import React from "react";
import { Link } from "react-router-dom";
import { imsLogger } from "@/services/loggerService";
import { useApplication } from "@/stores/applicationStore";
import * as yup from "yup";
import NotificationContext from "../../contexts/notificationContext";
import { registerAccount } from "../../services/authService";
import Layout from "./Layout";
import useError from "../../hooks/error/index";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Register = () => {
  const { handleError } = useError();
  const notify = React.useContext(NotificationContext);
  const history = useHistory();
  const { updateTokenPair } = useApplication();
  const dataSet = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
  // Validation rules ....
  const schema = yup.object({
    firstName: yup.string().min(2).required().label("First name"),
    lastName: yup.string().min(2).required().label("Last name"),
    email: yup.string().email().required().label("Email"),
    password: yup.string().min(8).max(25).required().label("Password"),
  });
  /**
   * .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'password')
   * submission logic to sever goes here ...
   */
  let doSubmit = async () => {
    try {
      const loginDetails = await registerAccount(dataModel);
      notify(loginDetails.message, "success");
      updateTokenPair({
        accessToken: loginDetails?.accessToken,
        refreshToken: loginDetails?.refreshToken,
      });
      history.push("/auth/preparation-screen");
    } catch (ex) {
      imsLogger(ex, ex.response);
      handleError(ex);
    }
  };
  const {
    dataModel,
    handleChange,
    handleSubmit,
    isFormValid,
    validationErrors,
    isBusy,
  } = useForm(dataSet, schema);

  return (
    <Layout>
      <div className="">
        <h4 className="mb-4">Hey there!</h4>
        <p className="mb-4">Your digital age adventure starts here.</p>
      </div>
      {(validationErrors.firstName || validationErrors.lastName) && (
        <small className="text-danger">
          {validationErrors.firstName || validationErrors.lastName}
        </small>
      )}
      <InputGroup className="shadow-md">
        <InputGroupText>
          <i className={`ims-icons-20 icon-icon-user-24`} />
        </InputGroupText>
        <Input
          type="text"
          placeholder="First name"
          value={dataModel.firstName}
          onChange={(e) =>
            handleChange({
              field: "firstName",
              value: e.currentTarget.value,
            })
          }
        />
        <Input
          type="text"
          placeholder="Last name"
          value={dataModel.lastName}
          onChange={(e) =>
            handleChange({
              field: "lastName",
              value: e.currentTarget.value,
            })
          }
        />
      </InputGroup>
      {validationErrors.email && (
        <small className="text-danger">{validationErrors.email}</small>
      )}
      <InputGroup className="shadow-md">
        <InputGroupText>
          <i className={`ims-icons-20 icon-icon-envelope-24`} />
        </InputGroupText>
        <Input
          type="email"
          placeholder="Email"
          value={dataModel.email}
          onChange={(e) =>
            handleChange({
              field: "email",
              value: e.currentTarget.value,
            })
          }
        />
      </InputGroup>
      {validationErrors.password && (
        <small className="text-danger">{validationErrors.password}</small>
      )}
      <InputGroup className="shadow-md">
        <InputGroupText>
          <i className={`ims-icons-20 icon-icon-lock-24`} />
        </InputGroupText>
        <Input
          type="password"
          placeholder="Password"
          value={dataModel.password}
          onChange={(e) =>
            handleChange({
              field: "password",
              value: e.currentTarget.value,
            })
          }
        />
      </InputGroup>

      <Button
        block
        type="submit"
        disabled={!isFormValid() || isBusy}
        color="primary"
        onClick={(e) => handleSubmit(e, doSubmit, false)}
        size="md"
        className="mt-3"
      >
        {!isBusy ? (
          "Sign up"
        ) : (
          <span>
            Signing up <Spinner size="sm" />
          </span>
        )}
      </Button>
      <div>
        <p className="font-size-caption mt-3">
          Already member of iMS?{" "}
          <Link className="link footer-link" to="/auth/login">
            Login here.
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Register;
