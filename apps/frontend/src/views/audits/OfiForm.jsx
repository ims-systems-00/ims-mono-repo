import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import {
  addOfi,
  mapToAuditCipModel,
  updateOfi,
} from "@/services/auditServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { AuditActionsContext } from "./context/AuditActionsContext";
import { useAudits } from "./store";
import USER_ACTIONS from "./actions";
const OfiForm = ({ ofi, onSubmit = () => {} }) => {
  const dataSet = ofi
    ? mapToAuditCipModel(ofi)
    : {
        data: {
          ofiTitle: "",
          opportunityForImprovement: "",
        },
        errors: {},
      };
  const schema = {
    ofiTitle: IVal.string().required().label("Title"),
    opportunityForImprovement: IVal.string().required().label("Description"),
  };
  const { toggleOfiEditMode, processing, ofiEditMode } = useAudits();
  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema
  );
  let { users, lazyLoadUsers } = useUsers();
  let { data, errors } = dataModel;
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  return (
    <div
      className={`${
        ofiEditMode ? "shadow-lg p-3 border border-info rounded mt-3" : ""
      } form-horizontal`}
    >
      <ImsInputText
        label={"Title"}
        placeholder="Title"
        name="ofiTitle"
        value={data.ofiTitle}
        onChange={handleChange}
        error={errors.ofiTitle}
      />
      <ImsInputText
        label={"Description"}
        cols="80"
        rows="2"
        placeholder="Description"
        type="textarea"
        name="opportunityForImprovement"
        value={data.opportunityForImprovement}
        onChange={handleChange}
        error={errors.opportunityForImprovement}
        mentionSuggestions={users}
      />
      <ImsButtonGroup>
        {ofi && ofi._id ? (
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
                processing[USER_ACTIONS.AMEND_OFI].status &&
                processing[USER_ACTIONS.AMEND_OFI].id === ofi._id
              }
            >
              {processing[USER_ACTIONS.AMEND_OFI].status &&
              processing[USER_ACTIONS.AMEND_OFI].id === ofi._id
                ? "Saving..."
                : "Update"}
            </Button>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              type="button"
              onClick={() => toggleOfiEditMode && toggleOfiEditMode()}
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
            disabled={validate() ? true : isBusy}
            onClick={(e) => {
              handleSubmit(e, () => onSubmit(dataModel.data));
            }}
          >
            {isBusy ? "Saving..." : "Add ofi"}
          </Button>
        )}
      </ImsButtonGroup>
    </div>
  );
};

export default OfiForm;
