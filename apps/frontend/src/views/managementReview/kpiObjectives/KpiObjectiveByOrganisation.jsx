import { Form } from "@ims-systems-00/ims-ui-kit";

import KpiObjective from "./KpiObjective";
const KpiObjectiveByOrganisation = ({ kpiObjectives }) => {
  return (
    <Form action="/" className="form-horizontal" method="get">
      {kpiObjectives?.filter((kpi) => kpi.privacy === "Organisational")
        ?.length ? (
        kpiObjectives
          .filter((kpi) => kpi.privacy === "Organisational")
          .map((data, index) => (
            <KpiObjective key={data._id} kpiObjective={data} />
          ))
      ) : (
        <p>Your organisation has no KPI/Objective(s) set up.</p>
      )}
    </Form>
  );
};

export default KpiObjectiveByOrganisation;
