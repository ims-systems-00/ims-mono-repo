import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Form, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { mapToSupplierKpiObjectiveModel } from "@/services/supplierManagementServices";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { useSupplier } from "./store";
const KpiObjectiveForm = ({ kpi, onSubmit = () => {} }) => {
  let { processing, toggleEditMode } = useSupplier();
  const dataSet = kpi
    ? mapToSupplierKpiObjectiveModel(kpi)
    : {
        data: {
          value: "",
        },
        errors: {},
      };
  const schema = {
    value: IVal.string().required().label("Kpi/Objective"),
  };

  const notify = useContext(NotificationContext);
  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;

  return (
    <Form action="/" className="form-horizontal mt-5" method="get">
      <ImsInputText
        label={"Add KPI/Objective"}
        placeholder="KPI/Objective"
        name="value"
        value={data.value}
        onChange={handleChange}
        error={errors.value}
      />
      <ImsButtonGroup>
        {kpi && kpi._id ? (
          <>
            {/* <Button
              size="sm"
              className="btn-simple btn-primary"
              color="primary"
              type="button"
              disabled={
                validate() ? true : processing.action === "update-kpiobjective"
              }
              onClick={(e) => {
                handleSubmit(e, handleUpdatekpi, false);
              }}
            >
              {processing.action === "update-kpiobjective" &&
              processing.id === kpi._id
                ? "Saving..."
                : "Update"}
            </Button>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              type="button"
              onClick={() => toggleEditMode && toggleEditMode()}
            >
              Cancel
            </Button> */}
          </>
        ) : (
          <Button
            size="sm"
            className="btn-simple btn-primary"
            color="primary"
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
    </Form>
  );
};

export default KpiObjectiveForm;
