import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import {
  Button,
  Form,
  ImsInputSelect,
  ImsInputText,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import {
  createKpiObjective,
  mapToKpiObjectiveModel,
  updateKpiObjective,
} from "@/services/kpiObjectiveServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { KpiObjectiveActionsContext } from "./contexts/KpiObjectiveActionsContext";

const KpiObjectiveForm = ({
  kpiObjective,
  processing,
  setProcessing,
  toggleEditMode,
}) => {
  let notify = React.useContext(NotificationContext);
  const { groups } = useContext(SuperGlobalContext);
  const { addToExisting, updateKpiInList } = useContext(
    KpiObjectiveActionsContext
  );
  let { authGlobalAccess } = useAccess();
  let dataSet = kpiObjective
    ? mapToKpiObjectiveModel(kpiObjective)
    : {
        data: {
          privacy: {
            value: "Business unit",
            label: "Business unit",
          },
          group: {
            value: null,
            label: "Select Business unit",
          },
          value: "",
        },
        errors: {},
      };
  // Validation rules ....
  const schema = {
    privacy: IVal.object().keys({
      value: IVal.string().required().label("Privacy"),
      label: IVal.label("Privacy"),
    }),
    value: IVal.string().required().label("Kpi"),
    group: IVal.when("privacy", {
      is: IVal.object().keys({
        value: IVal.string().valid("Business unit").label("Kpi type"),
        label: IVal.label("Kpi type"),
      }),
      then: IVal.object().keys({
        value: IVal.string().required().label("Business unit"),
        label: IVal.label("Business unit"),
      }),
    }),
  };

  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "create": {
          setProcessing({ action: "create", id: null });
          let { data } = await createKpiObjective(dataModel.data);
          notify("Kpi Objective created successfully ", "success");
          addToExisting(data.kpiObjective);
          break;
        }
        case "update": {
          setProcessing({ action: "update", id: null });
          let { data } = await updateKpiObjective(
            kpiObjective._id,
            dataModel.data
          );
          notify("Kpi Objective updated successfully ", "success");
          updateKpiInList(data.kpiObjective);
          toggleEditMode();
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("KpiObjectiveForm", ex);
      notify("Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;

  const getPrivacyDropdown = () => {
    return authGlobalAccess()
      ? ["Organisational", "Business unit"]
      : ["Business unit"];
  };

  return (
    <Form action="/" className="form-horizontal mt-2" method="get">
      {!kpiObjective && (
        <>
          <ImsInputSelect
            label="Privacy"
            name="privacy"
            value={data.privacy}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={getPrivacyDropdown().map((item) => ({
              value: item,
              label: item,
            }))}
          />
          {data.privacy.value === "Business unit" && (
            <ImsInputSelect
              label={authGlobalAccess() ? "Business unit" : "Business unit"}
              name="group"
              value={data.group}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={groups.map((group) => ({
                value: group._id,
                label: group.name,
              }))}
            />
          )}
        </>
      )}
      <ImsInputText
        label="KPI/Objective"
        name="value"
        value={data.value}
        onChange={handleChange}
        error={errors.value}
        placeholder="KPI/Objective"
      />
      {kpiObjective ? (
        <>
          <Button
            name="update"
            onClick={(e) => handleSubmit(e, doSubmit)}
            disabled={validate() ? true : processing === "update"}
            color="info"
            size="sm"
            className=" like btn-info"
          >
            {processing.action === "update" ? "Processing..." : "Update"}
          </Button>
          <Button
            name="update"
            onClick={() => toggleEditMode && toggleEditMode()}
            color="info"
            size="sm"
            // className=" like btn-danger"
            outline
            className="border border-0"
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button
          name="create"
          onClick={(e) => handleSubmit(e, doSubmit)}
          disabled={validate() ? true : processing.action === "create"}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing.action === "create" ? "Processing..." : "Add KPI"}
        </Button>
      )}
    </Form>
  );
};

export default KpiObjectiveForm;
