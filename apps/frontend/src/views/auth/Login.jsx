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
import { login } from "../../services/authService";
import Layout from "./Layout";
import useError from "@/hooks/error";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
const Login = () => {
  const notify = React.useContext(NotificationContext);
  const history = useHistory();
  const { handleError } = useError();
  const { updateTokenPair } = useApplication();
  const location = useLocation();
  let query = new URLSearchParams(location.search);
  function getRedirectLink() {
    return "redirect=";
  }
  const dataSet = {
    email: "",
    password: "",
  };
  // Validation rules ....
  const schema = yup.object({
    email: yup.string().email().required().label("Email"),
    password: yup.string().min(8).max(25).required().label("Password"),
  });
  /**
   * .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'password')
   * submission logic to sever goes here ...
   */
  let doSubmit = async () => {
    try {
      const loginDetails = await login(dataModel);
      notify(loginDetails.message, "success");
      updateTokenPair({
        accessToken: loginDetails?.accessToken,
        refreshToken: loginDetails?.refreshToken,
      });
      // isLoggedIn() && (await cacheData());
      return history.push(
        "/auth/preparation-screen?redirect=" + (query.get("redirect") || "")
      );
    } catch (ex) {
      imsLogger("Login", ex, ex.response);
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
        <p className="mb-4">Welcome to the future of business operations.</p>
      </div>
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
      <div className="">
        <h6 className="font-size-caption">
          <Link className="link footer-link" to="/auth/forgotpassword">
            Forgot password?
          </Link>
        </h6>
      </div>

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
          "Login"
        ) : (
          <span>
            Logging in <Spinner size="sm" />
          </span>
        )}
      </Button>
      <div>
        <p className="font-size-caption mt-3">
          Not a member of iMS?{" "}
          <Link className="link footer-link" to="/auth/register">
            Create an account
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Login;
