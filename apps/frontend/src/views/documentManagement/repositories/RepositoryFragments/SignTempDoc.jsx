import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import { handleSignature } from "@/services/documentManagement/index";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import USER_ACTIONS from "@/views/documentManagement/actions";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";
const SignTempDoc = ({ processing, dispatch, signatureId, node }) => {
  let notify = React.useContext(NotificationContext);
  const dataSet = {
    data: {
      status: "Signed",
      name: "",
      signature: "",
      organisation: "",
      jobTitle: "",
      font: "dobkin-script",
    },
    errors: {},
  };
  const schema = {
    name: IVal.string().required().label("Name"),
    signature: IVal.string().required().label("Name"),
    organisation: IVal.string().required().label("Name"),
    jobTitle: IVal.string().required().label("Name"),
    font: IVal.label("Name"),
    status: IVal.label("Status"),
  };
  const _signDocument = async () => {
    try {
      dispatch({
        [USER_ACTIONS.SIGN_DOCUMENT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await handleSignature(
        node?.repository?._id,
        node?._id,
        signatureId,
        dataModel.data
      );
      notify("Document signed successfully", "success");
      history.push(`/admin/document-repositories/${node?.repository?._id}`);
      dispatch({
        [USER_ACTIONS.SIGN_DOCUMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      dispatch({
        [USER_ACTIONS.SIGN_DOCUMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(err || err.message);
    }
  };
  let history = useHistory();
  const { dataModel, handleChange, handleSubmit, validate, handleFileChange } =
    useForm(dataSet, schema);
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      <ImsInputText
        label="Name"
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Name"
      />
      <ImsInputText
        label="Organisation"
        name="organisation"
        value={data.organisation}
        onChange={handleChange}
        error={errors.organisation}
        placeholder="organisation"
      />
      <ImsInputText
        label="Job title"
        name="jobTitle"
        value={data.jobTitle}
        onChange={handleChange}
        error={errors.jobTitle}
        placeholder="Job title"
      />

      <ImsInputText
        label="Signature"
        name="signature"
        value={data.signature}
        onChange={handleChange}
        error={errors.signature}
        placeholder="Signature"
      />

      <div className="ims-faded-button">
        <Button
          name="create"
          onClick={(e) => handleSubmit(e, _signDocument)}
          disabled={
            validate() ? true : processing[USER_ACTIONS.SIGN_DOCUMENT].status
          }
          className="text-info"
          type="button"
        >
          {processing[USER_ACTIONS.SIGN_DOCUMENT].status
            ? "Processing"
            : "Accept & sign"}
        </Button>
      </div>
    </Form>
  );
};

export default SignTempDoc;
