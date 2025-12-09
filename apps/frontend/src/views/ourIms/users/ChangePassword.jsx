import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import useDataProcessing from "@/hooks/useProcessing";
import {
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import { changePassword } from "@/services/userServices";
import IVal from "@/validations/validator";
import Layout from "@/views/auth/Layout";
const ChangePassword = (props) => {
  let notify = React.useContext(NotificationContext);
  let { processing, setProcessing, btnProcessing } = useDataProcessing();

  // defination of dataSet ...
  let dataSet = {
    data: {
      oldPassword: "",
      password: "",
      passwordConfirm: "",
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    oldPassword: IVal.string().min(8).max(25).required().label("oldPassword"),
    password: IVal.string().min(8).max(25).required().label("Password"),
    passwordConfirm: IVal.any()
      .valid(IVal.ref("password"))
      .label("Confirm password"),
  };

  // submission logic to sever goes here ...
  let doSubmit = async () => {
    try {
      setProcessing(true);
      await changePassword(props.match.params.id, dataModel.data);
      notify("Password changed successfully", "success");
      window.location = "/";
    } catch (ex) {
      imsLogger(ex.response);
      notify("Your password couldn't be changed", "danger");
    }
    setProcessing(false);
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;

  return (
    <Layout>
      <div className="">
        <h4>Change Password</h4>
        <p className="mb-3">Please enter your old password and new password</p>
      </div>

      <InputGroup>
        <InputGroupText>
          <i className={`tim-icons icon-lock-circle`} />
        </InputGroupText>
        <Input
          icon=""
          type="password"
          placeholder="Old password"
          name="oldPassword"
          value={data.oldPassword}
          onChange={handleChange}
          error={errors.password}
        />
      </InputGroup>
      <InputGroup>
        <InputGroupText>
          <i className={`tim-icons icon-lock-circle`} />
        </InputGroupText>
        <Input
          type="password"
          placeholder="New password"
          name="password"
          value={data.password}
          onChange={handleChange}
          error={errors.password}
        />
      </InputGroup>
      <InputGroup>
        <InputGroupText>
          <i className={`tim-icons icon-lock-circle`} />
        </InputGroupText>
        <Input
          type="password"
          placeholder="Confirm password"
          name="passwordConfirm"
          value={data.passwordConfirm}
          onChange={handleChange}
        />
      </InputGroup>

      <Button
        block
        type="submit"
        disabled={validate() ? !processing : false}
        color="primary"
        size="md"
        onClick={(e) => handleSubmit(e, doSubmit)}
      >
        {!processing ? (
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

export default ChangePassword;
