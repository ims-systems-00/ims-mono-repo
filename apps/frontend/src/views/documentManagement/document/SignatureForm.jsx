import classNames from "classnames";
import useDualStateController from "@/hooks/useDualStateController";
import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  Form,
  ImsInputText,
  Input,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import IVal from "@/validations/validator";
const SignatureForm = ({ signature, onSubmit = function () {} }) => {
  const dataSet = {
    data: {
      signatureId: signature?._id,
      status: "Signed",
      signature: "",
      name: "",
      organisation: "",
      jobTitle: "",
      font: "dobkin-script",
    },
    errors: {},
  };
  const schema = {
    signatureId: IVal.string().required().label("signatureId"),
    status: IVal.string().required().label("Status"),
    signature: IVal.string().required().label("Signature"),
    name: IVal.string().required().label("Name"),
    organisation: IVal.string().required().label("Organisation"),
    jobTitle: IVal.string().required().label("Job title"),
    font: IVal.string().required().label("Font"),
  };
  const { dataModel, isBusy, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  const { isOpen: isSuccessOpen, toggle: toggleSuccessOpen } =
    useDualStateController();
  return (
    <Form>
      {/* <SignatureSuccessMessage
        isOpen={isSuccessOpen}
        toggle={toggleSuccessOpen}
      /> */}
      <Row>
        {/* <Col md="3">
          <Button type="button" className="btn-icon text-info">
            <i className="fa-solid fa-circle" />
          </Button>
          <Button type="button" className="btn-icon text-danger">
            <i className="fa-solid fa-circle" />
          </Button>
        </Col> */}
        <Col md="3">
          <Button
            type="button"
            className={classNames("btn-icon text-dobkin-script", {
              "text-primary": data.font === "dobkin-script",
            })}
            onClick={(e) =>
              handleChange({
                currentTarget: {
                  value: "dobkin-script",
                  name: "font",
                },
              })
            }
          >
            Dobkin script
          </Button>
        </Col>
        <Col md="3">
          <Button
            type="button"
            className={classNames("btn-icon text-pinyon-script", {
              "text-primary": data.font === "pinyon-script",
            })}
            onClick={(e) =>
              handleChange({
                currentTarget: {
                  value: "pinyon-script",
                  name: "font",
                },
              })
            }
          >
            Pinyon script
          </Button>
        </Col>
        <Col md="3">
          <Button
            type="button"
            className={classNames("btn-icon text-felix-titling", {
              "text-primary": data.font === "felix-titling",
            })}
            onClick={(e) =>
              handleChange({
                currentTarget: {
                  value: "felix-titling",
                  name: "font",
                },
              })
            }
          >
            Felix titling
          </Button>
        </Col>
      </Row>
      <div className="signaturearea">
        <ImsInputText
          type="textarea"
          name="signature"
          value={data.signature}
          onChange={handleChange}
          error={errors.signature}
          placeholder="Name"
          className={classNames("", {
            "text-dobkin-script": data.font === "dobkin-script",
            "text-pinyon-script": data.font === "pinyon-script",
            "text-felix-titling": data.font === "felix-titling",
          })}
        />
        <span className="text-secondary font-size-subtitle-2">
          By signing this document with an electronic signature, I agree that
          such signature will be valid as a handwritten signature to the extent
          allowed by local law.
        </span>
        <Row>
          <Col md="4">
            <Input
              bsSize="sm"
              label="Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Name"
            />
          </Col>
          <Col md="4">
            <Input
              bsSize="sm"
              label="Organisation"
              name="organisation"
              value={data.organisation}
              onChange={handleChange}
              placeholder="Organisation"
            />
          </Col>
          <Col md="4">
            <Input
              bsSize="sm"
              label="Job Title"
              name="jobTitle"
              value={data.jobTitle}
              onChange={handleChange}
              placeholder="Job title"
            />
          </Col>
        </Row>
      </div>
      <Button
        size="sm"
        className="btn-block mt-2"
        color="info"
        disabled={validate() ? true : isBusy}
        onClick={(e) => {
          handleSubmit(e, () => {
            onSubmit(data);
            toggleSuccessOpen();
          });
        }}
      >
        {isBusy ? "... ..." : "Sign this document"}
      </Button>
    </Form>
  );
};

export default SignatureForm;

/**
 * The document has been signed successfully.
 * A copy will be sent via email to the author and the signee you
 * can now download your copy.
 */
