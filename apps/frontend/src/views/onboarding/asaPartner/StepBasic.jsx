import {
  Button,
  Col,
  Form,
  ImsInputText,
  UncontrolledAlert,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useForm } from "@ims-systems-00/ims-react-hooks";

import onboardingStepVector from "../../../assets/img/onboarding-step.svg";
import { useUiManager } from "../uiManager";
import * as yup from "yup";
import { usePartnership } from "./store";
import { useApplication } from "@/stores/applicationStore";

const StepBasic = () => {
  const { tokenPair } = useApplication();
  const { organization, updateBasicInfo } = usePartnership();
  const { nextStep } = useUiManager();
  const dataSet = {
    serviceProvision: organization.organization || "",
  };
  // Validation rules ....
  const schema = yup.object({
    serviceProvision: yup.string().required().label("Email"),
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
        <h3>Basic information</h3>
        <p>Please fill in the required details </p>
        <Form className="my-2">
          <UncontrolledAlert>
            Have you already got an iMS? Please select the organisation that
            would partner with us.
          </UncontrolledAlert>
          <ImsInputText
            label="Organisation (optional)"
            placeholder="i.e. iMS Systems"
            error={""}
            value={tokenPair?.accessTokenData?.user?.organizationName}
            disabled
          />
          <ImsInputText
            type="textarea"
            rows="2"
            label="Area of expertise/Service provision"
            placeholder="i.e. iMS Technologies"
            mandatory={true}
            onChange={(e) =>
              handleChange({
                field: "serviceProvision",
                value: e.currentTarget.value,
              })
            }
            error={validationErrors.serviceProvision}
          />
          <Button
            color="primary"
            onClick={(e) =>
              handleSubmit(e, () => {
                updateBasicInfo(dataModel);
                nextStep();
              })
            }
          >
            Next <i className={`ims-icons-20 icon-icon-arrowright-24`} />
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
