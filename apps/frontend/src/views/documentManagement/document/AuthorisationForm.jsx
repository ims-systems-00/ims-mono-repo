import useForm from "@/hooks/useForm";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import IVal from "@/validations/validator";
import ImsInputText from "@/views/shared/ImsFormElements/ImsInputText";
const AuthorisationForm = ({ authorisation, onSubmit = function () {} }) => {
  const dataSet = {
    data: {
      authId: authorisation?._id,
      message: "",
    },
    errors: {},
  };
  const schema = {
    authId: IVal.string().required().label("Auth id"),
    message: IVal.string().required().label("Message"),
  };
  const { dataModel, isBusy, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  return (
    <Form>
      <ImsInputText
        label="Feedback"
        name="message"
        type="textarea"
        value={data.message}
        onChange={handleChange}
        error={errors.message}
        placeholder="Information"
      />
      <Button
        size="sm"
        className="btn btn-simple"
        color="success"
        disabled={validate() ? true : isBusy}
        onClick={(e) => {
          handleSubmit(e, () => onSubmit({ ...data, status: "Approved" }));
        }}
      >
        {isBusy ? "... ..." : "Approve"}
      </Button>
      <Button
        size="sm"
        className="btn btn-simple"
        color="danger"
        disabled={validate() ? true : isBusy}
        onClick={(e) => {
          handleSubmit(e, () => onSubmit({ ...data, status: "Rejected" }));
        }}
      >
        {isBusy ? "... ..." : "Reject"}
      </Button>
    </Form>
  );
};

export default AuthorisationForm;
