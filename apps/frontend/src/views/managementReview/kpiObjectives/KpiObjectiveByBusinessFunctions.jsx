import NotificationContext from "@/contexts/notificationContext";
import React from "react";
import IVal from "@/validations/validator";
import { Form, ImsInputSelect } from "@ims-systems-00/ims-ui-kit";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useForm from "@/hooks/useForm";
import { useContext } from "react";
import KpiObjective from "./KpiObjective";
const KpiObjectivesByBusinessFunction = ({ kpiObjectives }) => {
  let notify = React.useContext(NotificationContext);
  const { groups } = useContext(SuperGlobalContext);

  let dataSet = {
    data: {
      group: {
        value: null,
        label: "Select group",
      },
    },
    errors: {},
  };

  // Validation rules ....
  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business function/group"),
      label: IVal.label("Business function/group"),
    }),
  };
  const { dataModel, handleChange } = useForm(dataSet, schema);
  let { data, errors } = dataModel;

  return (
    <>
      <Form action="/" className="form-horizontal" method="get">
        <ImsInputSelect
          label="Select a business unit to view their KPI/Objectives."
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
      </Form>
      {kpiObjectives.length
        ? kpiObjectives
            .filter((kpi) => kpi.group && kpi.group._id === data.group.value)
            .map((data, index) => (
              <KpiObjective key={data._id} kpiObjective={data} />
            ))
        : data.group.value && (
            <p>
              The business unit currently have no KPI/Objective setup for them.
            </p>
          )}
    </>
  );
};

export default KpiObjectivesByBusinessFunction;
