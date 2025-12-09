import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import {
  addRisk,
  mapToAuditRiskModel,
  updateRisk,
} from "@/services/auditServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { AuditActionsContext } from "./context/AuditActionsContext";
import { useAudits } from "./store";
import USER_ACTIONS from "./actions";
const RiskForm = ({ risk, onSubmit = () => {} }) => {
  const dataSet = risk
    ? mapToAuditRiskModel(risk)
    : {
        data: {
          riskTitle: "",
          riskDescription: "",
          consequence: {
            value: 1,
            label: 1,
          },
          likelihood: {
            value: 1,
            label: 1,
          },
        },
        errors: {},
      };
  const schema = {
    riskTitle: IVal.string().required().label("Title"),
    riskDescription: IVal.string().required().label("Description"),
    consequence: IVal.object().keys({
      value: IVal.number().required().label("Consequence"),
      label: IVal.label("Consequence"),
    }),
    likelihood: IVal.object().keys({
      value: IVal.number().required().label("likelihood"),
      label: IVal.label("likelihood"),
    }),
  };
  const { toggleRiskEditMode, processing, riskEditMode } = useAudits();
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
        riskEditMode ? "shadow-lg p-3 border border-info rounded mt-3" : ""
      } form-horizontal`}
    >
      <ImsInputText
        label={"Title"}
        placeholder="Title"
        name="riskTitle"
        value={data.riskTitle}
        onChange={handleChange}
        error={errors.riskTitle}
      />
      <ImsInputText
        label={"Description"}
        cols="80"
        rows="2"
        type="textarea"
        placeholder="Description"
        name="riskDescription"
        value={data.riskDescription}
        onChange={handleChange}
        error={errors.riskDescription}
        mentionSuggestions={users}
      />
      <Row>
        <Col>
          <ImsInputSelect
            label="Likelihood"
            name="likelihood"
            value={data.likelihood}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            isHorizontal={false}
            error={errors.likelihood}
            options={[1, 2, 3, 4, 5].map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Col>
        <Col>
          <ImsInputSelect
            label="Consequence"
            name="consequence"
            value={data.consequence}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            isHorizontal={false}
            error={errors.consequence}
            options={[1, 2, 3, 4, 5].map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Col>
      </Row>
      <ImsButtonGroup>
        {risk && risk._id ? (
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
                processing[USER_ACTIONS.AMEND_RISK].status &&
                processing[USER_ACTIONS.AMEND_RISK].id === risk._id
              }
            >
              {processing[USER_ACTIONS.AMEND_RISK].status &&
              processing[USER_ACTIONS.AMEND_RISK].id === risk._id
                ? "Saving..."
                : "Update"}
            </Button>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              type="button"
              onClick={() => toggleRiskEditMode && toggleRiskEditMode()}
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
            {isBusy ? "Saving..." : "Add risk"}
          </Button>
        )}
      </ImsButtonGroup>
    </div>
  );
};

export default RiskForm;
