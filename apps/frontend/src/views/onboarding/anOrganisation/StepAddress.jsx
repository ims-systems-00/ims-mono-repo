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
import { countries } from "./countries";
import { useCreateOrganisation } from "./store";

const StepBasic = () => {
  const { nextStep } = useUiManager();
  const { updateAddress, organization } = useCreateOrganisation();
  const dataSet = {
    addressCity: organization.addressCity || "",
    addressStreet: organization.addressStreet || "",
    addressBuilding: organization.addressBuilding || "",
    addressPostCode: organization.addressPostCode || "",
    addressStateProvince: organization.addressStateProvince || "",
    countryName: organization.countryName || {
      value: "United Kingdom",
      label: "United Kingdom",
    },
    countryAbbr: "GB",
    countryCurrency: "GBP",
  };
  // Validation rules ....
  const schema = yup.object({
    addressCity: yup.string().min(3).required().label("City"),
    addressStreet: yup.string().min(3).required().label("Street"),
    addressBuilding: yup
      .string()
      .min(1)
      .required()
      .label("Building name or number"),
    addressPostCode: yup.string().min(3).required().label("Post code"),
    addressStateProvince: yup
      .string()
      .min(3)
      .required()
      .label("State/Province"),
    countryName: yup.object({
      // value: yup.string().min(3).required().label(),
      // label: yup.string().min(3).required().label(),
    }),
    countryAbbr: yup.string().notRequired().label("Country code"),
    countryCurrency: yup.string().notRequired().label("Country currency"),
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
        <h3>Business address</h3>
        <p>This will help us automate information within iMS.</p>
        <Form className="my-2">
          <ImsInputSelect
            label="Country"
            placeholder="i.e. United Kingdom"
            mandatory={true}
            error={validationErrors.countryName}
            className="react-select default"
            classNamePrefix="react-select"
            value={dataModel.countryName}
            onChange={(e) => {
              // handleChange({
              //   field: "countryAbbr",
              //   value: e.currentTarget.value.value.countryCode,
              // });
              // handleChange({
              //   field: "countryCurrency",
              //   value: e.currentTarget.value.value.currencyCode,
              // });
              handleChange({
                field: "countryName",
                value: e.currentTarget.value,
              });
            }}
            options={countries.map((country) => ({
              label: country.countryName,
              value: country.countryName,
            }))}
          />
          <ImsInputText
            label="Building name or number"
            placeholder="i.e. 123 or Plaza building"
            value={dataModel.addressBuilding}
            onChange={(e) =>
              handleChange({
                field: "addressBuilding",
                value: e.currentTarget.value,
              })
            }
            mandatory={true}
            error={validationErrors.addressBuilding}
          />

          <Row>
            <Col md="6">
              <ImsInputText
                label="Street"
                placeholder="i.e. Walmart"
                mandatory={true}
                value={dataModel.addressStreet}
                onChange={(e) =>
                  handleChange({
                    field: "addressStreet",
                    value: e.currentTarget.value,
                  })
                }
                error={validationErrors.addressStreet}
              />
            </Col>
            <Col md="6">
              <ImsInputText
                label="City"
                placeholder="i.e. Oldham"
                mandatory={true}
                value={dataModel.addressCity}
                onChange={(e) =>
                  handleChange({
                    field: "addressCity",
                    value: e.currentTarget.value,
                  })
                }
                error={validationErrors.addressCity}
              />
            </Col>
            <Col md="6">
              <ImsInputText
                label="Post code"
                placeholder="i.e. AB2 90C"
                mandatory={true}
                value={dataModel.addressPostCode}
                onChange={(e) =>
                  handleChange({
                    field: "addressPostCode",
                    value: e.currentTarget.value,
                  })
                }
                error={validationErrors.addressPostCode}
              />
            </Col>
            <Col md="6">
              <ImsInputText
                label="State/Province"
                placeholder="i.e. Greater Manchester"
                mandatory={true}
                value={dataModel.addressStateProvince}
                onChange={(e) =>
                  handleChange({
                    field: "addressStateProvince",
                    value: e.currentTarget.value,
                  })
                }
                error={validationErrors.addressStateProvince}
              />
            </Col>
          </Row>
          <Button
            disabled={!isFormValid()}
            color="primary"
            onClick={(e) => {
              handleSubmit(e, (d) => {
                updateAddress(d);
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
