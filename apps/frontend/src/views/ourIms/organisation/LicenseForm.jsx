// import useForm from "@/hooks/useForm";
import { useForm } from "@ims-systems-00/ims-react-hooks";
import {
  Button,
  Col,
  Form,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import carboCalcLogo from "@/assets/img/carbo-calc-logo.svg";
import imsFormsLogo from "@/assets/img/ims-forms-logo.svg";
import imsLogo from "@/assets/img/ims-systems-logo.svg";
import projectImsLogo from "@/assets/img/project-ims-logo.svg";
import classNames from "classnames";
import { ADDITIONALMODULES, COMPLIANCE_TOOLS } from "@/rolesAndPermissions";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import * as yup from "yup";

const LicenseForm = ({ existingLicense, onSubmit = () => {} }) => {
  const dataSet = {
    superUser: 0,
    groupAmount: 0,
    userAmount: 0,
    message: "",
    complianceTools: [],
    additionalModules: [],
    projectims: false,
    imsforms: false,
    carbocalc: false,
  };
  const schema = yup.object({
    superUser: yup.number().integer().min(0).label("User licence"),
    additionalModules: yup.array().label("Additional Module"),
    groupAmount: yup.number().integer().min(0).label("Group licence"),
    userAmount: yup.number().integer().min(0).label("User licence"),
    message: yup.string().label("Message"),
    complianceTools: yup.array().label("Complaince Tools"),
    projectims: yup.bool().label("A single product"),
    imsforms: yup.bool().label("A single product"),
    carbocalc: yup.bool().label("A single product"),
  });
  const {
    dataModel,
    validationErrors,
    handleChange,
    handleSubmit,
    isBusy,
    isFormValid,
  } = useForm(dataSet, schema);

  return (
    <Form action="/" className="form-horizontal">
      <h4 className="text-dark">Select Your Products</h4>
      <Row>
        <Col md="3">
          <div
            className={classNames(
              "p-4 rounded-3 input-product-options mt-4 text-primary",
              {
                " active": true,
              }
            )}
          >
            <span className="selectetion-box">Selected</span>
            <span className="">
              <img height={25} src={imsLogo} alt="" />
            </span>
          </div>
        </Col>
        <Col md="3">
          <div
            className={classNames(
              "p-4 rounded-3 input-product-options mt-4 text-primary",
              {
                " active": dataModel.imsforms,
              }
            )}
            onClick={() => {
              handleChange({
                field: "imsforms",
                value: !dataModel.imsforms,
              });
            }}
          >
            <span className="selectetion-box">Selected</span>
            <span className="">
              <img height={25} src={imsFormsLogo} alt="" />
            </span>
          </div>
        </Col>
        <Col md="3">
          <div
            className={classNames(
              "p-4 rounded-3 input-product-options mt-4 text-primary",
              {
                " active": dataModel.projectims,
              }
            )}
            onClick={() => {
              handleChange({
                field: "projectims",
                value: !dataModel.projectims,
              });
            }}
          >
            <span className="selectetion-box">Selected</span>
            <span className="">
              <img height={25} src={projectImsLogo} alt="" />
            </span>
          </div>
        </Col>
        <Col md="3">
          <div
            className={classNames(
              "p-4 rounded-3 input-product-options mt-4 text-primary",
              {
                " active": dataModel.carbocalc,
              }
            )}
            onClick={() => {
              handleChange({
                field: "carbocalc",
                value: !dataModel.carbocalc,
              });
            }}
          >
            <span className="selectetion-box">Selected</span>
            <span className="">
              <img height={25} src={carboCalcLogo} alt="" />
            </span>
          </div>
        </Col>
      </Row>
      <hr></hr>
      <Row>
        <Col md="6">
          <ImsInputText
            label="Super user (£50 PCM)"
            type="number"
            name="superUser"
            value={dataModel.superUser}
            onChange={(e) => {
              handleChange({
                field: "superUser",
                value: e.currentTarget.value,
              });
            }}
            error={validationErrors.superUser}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="User licences (£17 PCM)"
            type="number"
            name="userAmount"
            value={dataModel.userAmount}
            onChange={(e) => {
              handleChange({
                field: "userAmount",
                value: e.currentTarget.value,
              });
            }}
            error={validationErrors.userAmount}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Business unit licences (£30  PCM)"
            type="number"
            name="groupAmount"
            value={dataModel.groupAmount}
            onChange={(e) => {
              handleChange({
                field: "groupAmount",
                value: e.currentTarget.value,
              });
            }}
            error={validationErrors.groupAmount}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            isMulti
            placeholder="Additional Module"
            label="Additional Module"
            name="additionalModules"
            value={dataModel.additionalModules}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={(e) => {
              handleChange({
                field: "additionalModules",
                value: e.currentTarget.value,
              });
            }}
            options={Object.values(ADDITIONALMODULES)
              .filter(
                (item) => !existingLicense?.additionalModules?.includes(item)
              )
              .map((item) => ({
                value: item,
                label: item,
              }))}
          />
        </Col>
        <Col md="12">
          <ImsInputSelect
            isMulti
            placeholder="Compliance toolkit (£500 one off)"
            label="Toolkit"
            name="complianceTools"
            value={dataModel.complianceTools}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={(e) => {
              handleChange({
                field: "complianceTools",
                value: e.currentTarget.value,
              });
            }}
            options={Object.values(COMPLIANCE_TOOLS)
              .filter(
                (item) => !existingLicense?.complianceTools?.includes(item)
              )
              .map((item) => ({
                value: item,
                label: item,
              }))}
          />
        </Col>

        <Col md="12">
          <ImsInputText
            label="Message"
            cols="80"
            placeholder="Message"
            rows="2"
            type="textarea"
            name="message"
            value={dataModel.message}
            onChange={(e) => {
              handleChange({
                field: "message",
                value: e.currentTarget.value,
              });
            }}
            error={validationErrors.message}
          />
        </Col>
      </Row>
      <ImsButtonGroup>
        <Button
          name="confirm"
          onClick={(e) => {
            handleSubmit(e, () => onSubmit(dataModel));
          }}
          disabled={!isFormValid() || isBusy}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {isBusy ? "Processing..." : "Confirm"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default LicenseForm;
