import { Col, Input, Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import onboardingStepVector from "../../../assets/img/onboarding-step.svg";
import { useCreateOrganisation } from "./store";
import * as yup from "yup";
import { useForm } from "@ims-systems-00/ims-react-hooks";

const StepConfirmCreate = () => {
  const { createOrganisation, organization, creatingorg } =
    useCreateOrganisation();
  const dataSet = {
    signatureStatus: false,
  };
  // Validation rules ....
  const schema = yup.object({
    signatureStatus: yup.boolean().oneOf([true]).label("Aggreement"),
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
        <h3>Let's get started</h3>
        <p className="mb-2">Please review the details one last time.</p>
        <h4 className="mt-2">Organisation</h4>
        <p className="mb-3">{organization.name}</p>
        <h4 className="mt-2">Address</h4>
        <p className="mb-3">
          {organization.addressBuilding} {organization.addressStreet}{" "}
          {organization.addressPostCode} {organization.addressCity}{" "}
          {organization.addressStateProvince} {organization.countryName?.value}
        </p>
        <h4 className="mt-2">Contact information</h4>
        <p className="mb-3">
          Email: {organization.officeEmail} Phone: {organization.contactNumber}
        </p>
        <h4 className="mt-2">Partner code</h4>
        <p className="mb-3">{organization.referralSource}</p>
        <p className="my-4">
          <small className="text-danger">
            {validationErrors.signatureStatus}
            <br></br>
          </small>
          <Input
            type="checkbox"
            checked={dataModel.signatureStatus}
            onChange={(e) => {
              handleChange({
                field: "signatureStatus",
                value: !dataModel.signatureStatus,
              });
            }}
          />{" "}
          <span>
            "I have reviewed and can confirm all the details provided are up to
            date and accurate."
          </span>
        </p>
        <Button
          disabled={!isFormValid() || creatingorg}
          color="primary"
          onClick={(e) => {
            handleSubmit(e, (d) => {
              createOrganisation();
            });
          }}
        >
          {creatingorg
            ? "Creating your organisation"
            : "Create my organisation"}
          <i className={`ims-icons-20 icon-icon-arrowright-24`} />
        </Button>
      </Col>
      <Col md="6" className="d-flex justify-content-center align-items-center">
        <img className="w-75" src={onboardingStepVector} />
      </Col>
    </React.Fragment>
  );
};

export default StepConfirmCreate;
