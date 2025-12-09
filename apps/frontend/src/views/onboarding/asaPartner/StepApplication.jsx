import {
  Button,
  Col,
  Form,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { useForm } from "@ims-systems-00/ims-react-hooks";

import React from "react";
import onboardingStepVector from "../../../assets/img/onboarding-step.svg";
import { useUiManager } from "../uiManager";
import * as yup from "yup";
import { usePartnership } from "./store";

const StepApplication = () => {
  const { organization, updateApplicationInfo, applyingnow } = usePartnership();
  const { nextStep } = useUiManager();
  const dataSet = {
    customerReach: organization.customerReach || "",
    website: organization.website || "",
    standards: organization.standards || "",
    description: organization.description || "",
  };
  // Validation rules ....
  const schema = yup.object({
    customerReach: yup.number().required().label("Customer reach"),
    website: yup.string().notRequired().label("Website"),
    standards: yup.string().required().label("Standards"),
    description: yup.string().required().label("Description"),
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
        <h3>Application form</h3>
        <p>This would allow us to tailor our support.</p>
        <Form className="my-2">
          <Row>
            <Col md="6">
              <ImsInputText
                type="number"
                label="Customer reach"
                placeholder="i.e. 1000"
                mandatory={true}
                value={dataModel.customerReach}
                onChange={(e) =>
                  handleChange({
                    field: "customerReach",
                    value: e.currentTarget.value,
                  })
                }
                error={validationErrors.customerReach}
              />
            </Col>
            <Col md="6">
              <ImsInputText
                label="Website"
                placeholder="i.e. www.imssystems.tech"
                value={dataModel.website}
                mandatory
                onChange={(e) =>
                  handleChange({
                    field: "website",
                    value: e.currentTarget.value,
                  })
                }
                error={validationErrors.website}
              />
            </Col>
          </Row>
          <ImsInputText
            type="textarea"
            mandatory
            rows="2"
            label="Standards"
            placeholder="i.e. ISO 27001, ISO 27002"
            value={dataModel.standards}
            onChange={(e) =>
              handleChange({
                field: "standards",
                value: e.currentTarget.value,
              })
            }
            error={validationErrors.standards}
          />
          <ImsInputText
            type="textarea"
            rows="3"
            label="Tell us more about yourself"
            placeholder="i.e. History of the business, about us..."
            mandatory={true}
            value={dataModel.description}
            onChange={(e) =>
              handleChange({
                field: "description",
                value: e.currentTarget.value,
              })
            }
            error={validationErrors.description}
          />
          <Button
            color="primary"
            disabled={!isFormValid() || applyingnow}
            onClick={(e) =>
              handleSubmit(e, (d) => {
                updateApplicationInfo(d);
                nextStep();
              })
            }
          >
            {applyingnow ? "Please wait" : "Apply"}{" "}
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

export default StepApplication;
