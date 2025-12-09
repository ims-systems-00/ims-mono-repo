import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import {
  addIdentifications,
  mapToAuditIdentificationModel,
  updateIdentifications,
} from "@/services/auditServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { AuditActionsContext } from "./context/AuditActionsContext";
import { useAudits } from "./store";
import USER_ACTIONS from "./actions";
const IdentificationFrom = ({ identification, onSubmit = () => {} }) => {
  const dataSet = identification
    ? mapToAuditIdentificationModel(identification)
    : {
        data: {
          rootCause: "",
          nonConformity: "",
        },
        errors: {},
      };
  const schema = {
    rootCause: IVal.string().required().label("Root casuse"),
    nonConformity: IVal.string().required().label("Non conformity"),
    hasRisk: IVal.label("Risk"),
    riskTitle: IVal.label("Risk title"),
    riskDescription: IVal.label("Risk description"),
    hasOfi: IVal.label("Ofi"),
    ofiTitle: IVal.label("Ofi Title"),
    opportunityForImprovement: IVal.label("Ofi description"),
  };
  const { toggleIdentificationEditMode, processing, identificationEditMode } =
    useAudits();
  const notify = useContext(NotificationContext);
  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;

  return (
    <div
      action="/"
      className={`${
        identificationEditMode
          ? "shadow-lg p-3 border border-info rounded mt-3"
          : ""
      } form-horizontal`}
      method="get"
    >
      <ImsInputText
        label={"Non-conformity"}
        placeholder="Non conformity"
        name="nonConformity"
        value={data.nonConformity}
        onChange={handleChange}
        error={errors.nonConformity}
      />
      <ImsInputText
        label={"Root cause"}
        cols="80"
        rows="2"
        type="textarea"
        placeholder="Root cause"
        name="rootCause"
        value={data.rootCause}
        onChange={handleChange}
        error={errors.rootCause}
      />
      <ImsButtonGroup>
        {identification && identification._id ? (
          <>
            <Button
              size="sm"
              className="btn-fill"
              color="info"
              type="button"
              onClick={(e) => {
                handleSubmit(e, () => onSubmit(dataModel.data), false);
              }}
              disabled={
                processing[USER_ACTIONS.AMEND_IDENTIFICATION].status &&
                processing[USER_ACTIONS.AMEND_IDENTIFICATION].id ===
                  identification._id
              }
            >
              {processing[USER_ACTIONS.AMEND_IDENTIFICATION].status &&
              processing[USER_ACTIONS.AMEND_IDENTIFICATION].id ===
                identification._id
                ? "Saving..."
                : "Update"}
            </Button>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              type="button"
              onClick={() =>
                toggleIdentificationEditMode && toggleIdentificationEditMode()
              }
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            className="btn-fill"
            color="info"
            type="button"
            onClick={(e) => {
              handleSubmit(e, () => onSubmit(dataModel.data));
            }}
            disabled={validate() ? true : isBusy}
          >
            {isBusy ? "Saving..." : "Add"}
          </Button>
        )}
      </ImsButtonGroup>
    </div>
  );
};

export default IdentificationFrom;
