import classNames from "classnames";
import {
  Button,
  Col,
  Form,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { useForm } from "@ims-systems-00/ims-react-hooks";
import React from "react";
import { useUiManager } from "../uiManager";
import { PAYMENT_METHODS, useCreateOrganisation } from "./store";
import * as yup from "yup";
import { COMPLIANCE_TOOLS } from "@/rolesAndPermissions";
import imsLogo from "../../../assets/img/ims-systems-logo.svg";
import carboCalcLogo from "../../../assets/img/carbo-calc-logo.svg";
import imsFormsLogo from "../../../assets/img/ims-forms-logo.svg";
import projectImsLogo from "../../../assets/img/project-ims-logo.svg";

const StepBasic = () => {
  const { goinglive, paymentMethod, chosePaymentMethod, updateLicenses } =
    useCreateOrganisation();
  const { nextStep } = useUiManager();
  const dataSet = {
    paymentType: "",
    users: 0,
    groups: 0,
    superUser: 1,
    complianceTools: [],
    additionalModules: [],
    projectims: false,
    imsforms: false,
    carbocalc: false,
  };
  // Validation rules ....
  const schema = yup.object({
    paymentType: yup
      .string()
      .oneOf([PAYMENT_METHODS.CARD, PAYMENT_METHODS.INVOICE])
      .required()
      .label("Payment method"),
    users: yup.number().min(0).required().label("Users"),
    groups: yup.number().min(0).required().label("Business units"),
    superUser: yup.number().min(1).required().label("Super user"),
    complianceTools: yup.array().label("Compliance tools"),
    additionalModules: yup.array().label("Additional modules"),
    projectims: yup.bool().label("A single product"),
    imsforms: yup.bool().label("A single product"),
    carbocalc: yup.bool().label("A single product"),
  });
  const {
    dataModel,
    handleChange,
    handleSubmit,
    isFormValid,
    validationErrors,
    isBusy,
  } = useForm(dataSet, schema);
  function calculateMonthlyPrice() {
    let licensePrice =
      dataModel.superUser * 50 + dataModel.groups * 30 + dataModel.users * 17;
    return licensePrice + Math.ceil(licensePrice * 0.25);
  }
  return (
    <React.Fragment>
      <Col md="6">
        <h5 className="mb-2">Select your Products.</h5>
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
              <span className="selectetion-box">Default</span>
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
        </Row>
        <p className="pt-1">
          iMS Systems is added as default in order to manage your account.
        </p>

        <h5 className="mt-5">
          <span className="text-danger">*</span>The selected licences apply to
          all products at no additional cost.
        </h5>
        <Form className="mt-3">
          <Row>
            <Col md="6">
              <ImsInputText
                label="Business units (£30  PCM)"
                type="number"
                placeholder="i.e. 20"
                value={dataModel.groups}
                onChange={(e) =>
                  handleChange({
                    field: "groups",
                    value: e.currentTarget.value,
                  })
                }
                error={validationErrors.groups}
              />
            </Col>
            <Col md="6">
              <ImsInputText
                label="Users (£17 PCM)"
                type="number"
                placeholder="i.e. 100"
                value={dataModel.users}
                onChange={(e) =>
                  handleChange({
                    field: "users",
                    value: e.currentTarget.value,
                  })
                }
                error={validationErrors.users}
              />
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <ImsInputText
                label="Super admins (£50 PCM)"
                type="number"
                placeholder="i.e. 3"
                mandatory={true}
                min="1"
                value={dataModel.superUser}
                onChange={(e) =>
                  handleChange({
                    field: "superUser",
                    value: e.currentTarget.value,
                  })
                }
                error={validationErrors.superUser}
              />
            </Col>
            <Col md="6">
              <ImsInputSelect
                label="Additional modules"
                placeholder="i.e. CRM"
                className="react-select default"
                classNamePrefix="react-select"
                isMulti
                options={[{ value: "CRM", label: "CRM" }]}
                onChange={(e) =>
                  handleChange({
                    field: "additionalModules",
                    value: e.currentTarget.value.map((v) => v.value),
                  })
                }
                error={validationErrors.additionalModules}
              />
            </Col>
          </Row>
          <ImsInputSelect
            label="Compliance toolkits (£500 one off)"
            placeholder="i.e. ISO 27001 ISO 45001 ISO 14001"
            isMulti
            className="react-select default"
            classNamePrefix="react-select"
            options={Object.values(COMPLIANCE_TOOLS).map((t) => ({
              value: t,
              label: t,
            }))}
            onChange={(e) =>
              handleChange({
                field: "complianceTools",
                value: e.currentTarget.value.map((v) => v.value),
              })
            }
            error={validationErrors.complianceTools}
          />
        </Form>
      </Col>
      <Col md="6" className="d-flex flex-column">
        <div>
          <h5 className="mb-2">Choose your payment method.</h5>
        </div>
        <div className="flex-grow-1 d-flex justify-content-between flex-column">
          <div>
            <div
              className={classNames(
                "p-4 rounded-3 payment-option mt-4 text-primary",
                {
                  " active": paymentMethod === PAYMENT_METHODS.CARD,
                }
              )}
              onClick={() => {
                chosePaymentMethod(PAYMENT_METHODS.CARD);
                handleChange({
                  field: "paymentType",
                  value: PAYMENT_METHODS.CARD,
                });
              }}
            >
              <span className="selectetion-box">Selected</span>
              <span className="">
                <b>Card payment</b>
              </span>
              <span className="selectetion-dot pull-right">
                {" "}
                <i className={`ims-icons-20 icon-icon-checkcircle-24`} />
              </span>
            </div>
            <div
              className={classNames(
                "p-4 rounded-3 payment-option mt-4 text-primary",
                {
                  " active": paymentMethod === PAYMENT_METHODS.INVOICE,
                }
              )}
              onClick={() => {
                chosePaymentMethod(PAYMENT_METHODS.INVOICE);
                handleChange({
                  field: "paymentType",
                  value: PAYMENT_METHODS.INVOICE,
                });
              }}
            >
              <span className="selectetion-box">Selected</span>
              <span className="text-primary">
                <b>Monthly payment (Manual invoicing)</b>
              </span>
              <span className="selectetion-dot pull-right">
                <i className={`ims-icons-20 icon-icon-checkcircle-24`} />
              </span>
            </div>
          </div>
          {validationErrors.paymentType && (
            <p className="text-danger">
              <small>{validationErrors.paymentType}</small>
            </p>
          )}
          <p>
            <span className="text-danger">*</span>If you wish for payments to be
            taken via our Finance Team, please select the Monthly option.
          </p>
          <p>
            <span className="text-danger">*</span>A 25% support fee applies to
            your total cost.
          </p>
          <div>
            <hr style={{ background: "#ced4da" }}></hr>
            <p className="my-2 text-dark">
              Initial payment{" "}
              <span className="pull-right">
                {"£" +
                  (dataModel.complianceTools.length * 500 +
                    dataModel.additionalModules.length * 500)}
              </span>
            </p>
            <p className="my-2 text-dark">
              Monthly{" "}
              <span className="pull-right">
                {"£" + calculateMonthlyPrice()}
              </span>
            </p>
            <Button
              disabled={!isFormValid() || goinglive}
              color="primary"
              className="mb-3"
              block
              onClick={(e) =>
                handleSubmit(e, () => {
                  updateLicenses(dataModel);
                  nextStep();
                })
              }
            >
              {goinglive ? "Processing..." : "Create my Account"}
              <i className={`ims-icons-20 icon-icon-arrowright-24`} />
            </Button>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};

export default StepBasic;
