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
import onboardingStepVector from "../../../assets/img/onboarding-step.svg";
import { useUiManager } from "../uiManager";
import * as yup from "yup";
import { industries } from "./industries";
import { useCreateOrganisation } from "./store";
const StepBasic = () => {
  const { updateBasicInfo, organization } = useCreateOrganisation();
  const { nextStep } = useUiManager();
  const dataSet = {
    name: organization.name || "",
    officeEmail: organization.officeEmail || "",
    contactNumber: organization.contactNumber || "",
    sizeOfOrg: organization.sizeOfOrg || 1,
    industry: organization.industry || {
      value: "Accounting",
      label: "Accounting",
    },
  };
  // Validation rules....
  const schema = yup.object({
    name: yup.string().min(3).required().label("Name"),
    officeEmail: yup.string().min(3).email().required().label("Work email"),
    contactNumber: yup.number().required().label("Contact number"),
    sizeOfOrg: yup.number().min(1).required().label("Size of your company"),
    industry: yup
      .object({
        // value: yup.string().min(3).required().label(),
        // label: yup.string().min(3).required().label(),
      })
      .label("Industry"),
  });
  const {
    dataModel,
    handleChange,
    handleSubmit,
    isFormValid,
    validationErrors,
    isBusy,
  } = useForm(dataSet, schema);
  return (
    <React.Fragment>
      <Col md="6">
        <h3>Organisation setup</h3>
        <p>Let's get to know your organisation.</p>
        <Form className="my-2">
          <ImsInputText
            label="Name of your organisation"
            placeholder="i.e. iMS Technologies"
            mandatory={true}
            value={dataModel.name}
            onChange={(e) =>
              handleChange({
                field: "name",
                value: e.currentTarget.value,
              })
            }
            error={validationErrors.name}
          />
          <Row>
            <Col md="6">
              <ImsInputSelect
                label="Industry"
                placeholder="i.e. Engineering"
                mandatory={true}
                className="react-select default"
                classNamePrefix="react-select"
                value={dataModel.industry}
                onChange={(e) =>
                  handleChange({
                    field: "industry",
                    value: e.currentTarget.value,
                  })
                }
                options={industries.map((i) => ({
                  label: i,
                  value: i,
                }))}
                error={validationErrors.industry}
              />
            </Col>
            <Col md="6">
              <ImsInputText
                label="Size of your company"
                placeholder="i.e. 100"
                type="number"
                mandatory={true}
                value={dataModel.sizeOfOrg}
                onChange={(e) =>
                  handleChange({
                    field: "sizeOfOrg",
                    value: e.currentTarget.value,
                  })
                }
                error={validationErrors.sizeOfOrg}
              />
            </Col>
          </Row>
          <ImsInputText
            label="Work email"
            placeholder="i.e. hello@imssystems.tech"
            mandatory={true}
            value={dataModel.officeEmail}
            onChange={(e) =>
              handleChange({
                field: "officeEmail",
                value: e.currentTarget.value,
              })
            }
            error={validationErrors.officeEmail}
          />
          <ImsInputText
            label="Phone number"
            type="number"
            placeholder="i.e. 8801699999999"
            mandatory={true}
            value={dataModel.contactNumber}
            onChange={(e) =>
              handleChange({
                field: "contactNumber",
                value: e.currentTarget.value,
              })
            }
            error={validationErrors.contactNumber}
          />
          <Button
            disabled={!isFormValid()}
            color="primary"
            onClick={(e) => {
              handleSubmit(e, (d) => {
                updateBasicInfo(d);
                nextStep();
              });
            }}
          >
            Confirm & proceed{" "}
            <i className={`ims-icons-20 icon-icon-arrowright-24`} />
          </Button>
        </Form>
      </Col>
      <Col md="6" className="d-flex justify-content-center align-items-center">
        <img className="w-75" src={onboardingStepVector} />
      </Col>
    </React.Fragment>
  );
};

export default StepBasic;
