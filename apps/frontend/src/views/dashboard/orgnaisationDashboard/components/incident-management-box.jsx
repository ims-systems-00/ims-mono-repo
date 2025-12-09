import Box from "../../shared/dashboardComponents/Box";
import IncidentManagementBar from "./incident-management-bar";

const defaultIncidentStats = [
  { name: "Internal 1", total: 0, resolved: 0 },
  { name: "Internal 2", total: 0, resolved: 0 },
];

const IncidentManagementBox = ({ incidentStats = defaultIncidentStats }) => {
  return (
    <Box className="incident-management-box position-relative h-100 border-0">
      <div className="d-flex flex-column gap-4">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between gap-4">
            <h4>Incident Management</h4>
          </div>
          <p className="fs-5 mb-0">Raised vs resolved</p>
        </div>

        <IncidentManagementBar incidentStats={incidentStats} />
      </div>
    </Box>
  );
};

export default IncidentManagementBox;
