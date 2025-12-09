import { Button, Col, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { useForm } from "@ims-systems-00/ims-react-hooks";

import React from "react";
import { getCachedParnterCode } from "@/services/organizationService";
import * as yup from "yup";
import partnerCodeVector from "../../../assets/img/partner-code-01.svg";
import { useUiManager } from "../uiManager";
import { useCreateOrganisation } from "./store";
import Loading from "@/components/Loader/Loading";

const StepBasic = () => {
  const automatedPartnerCode = getCachedParnterCode();
  const { nextStep } = useUiManager();
  const { updatePartnerCode, organization, loadingPartner, partnerShip } =
    useCreateOrganisation();
  const dataSet = {
    // order of or logic matters here
    referralSource: automatedPartnerCode || organization.referralSource || null,
  };
  // Validation rules ....
  const schema = yup.object({
    referralSource: yup.string().notRequired().nullable().label("Partner code"),
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
      <Col md="12">
        <div className="w-50 text-center mx-auto">
          <h3>Partner code</h3>
          <p className="mb-4">
            {loadingPartner ? (
              <Loading />
            ) : partnerShip?.organization?.name ? (
              `Partner "${partnerShip?.organization?.name}"`
            ) : (
              "Referred over from one of our strategic partners? You should have recieved a code."
            )}
          </p>
          <ImsInputText
            disabled={automatedPartnerCode ? true : false}
            placeholder="i.e. 64e340809274e40acaa3b983"
            value={dataModel.referralSource}
            dataModel
            onChange={(e) =>
              handleChange({
                field: "referralSource",
                value: e.currentTarget.value,
              })
            }
            error={validationErrors.referralSource}
          />
          <img className="w-50 my-2" src={partnerCodeVector} />
        </div>
        <div className="d-flex justify-content-center align-items-center mt-5">
          {!automatedPartnerCode && (
            <Button
              outline
              color="primary"
              onClick={() => {
                /** defaulting because default doesn't provide any data. as user want to skip we ignore data */
                updatePartnerCode(dataSet);
                nextStep();
              }}
            >
              Skip{" "}
              <i className={`ims-icons-20 icon-icon-arrowbendupright-24`} />
            </Button>
          )}
          <Button
            color="primary"
            disabled={!isFormValid()}
            onClick={() => {
              updatePartnerCode(dataModel);
              nextStep();
            }}
          >
            Confirm <i className={`ims-icons-20 icon-icon-arrowright-24`} />
          </Button>
        </div>
      </Col>
    </React.Fragment>
  );
};

export default StepBasic;
