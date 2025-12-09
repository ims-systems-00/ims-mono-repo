import Box from "../../shared/dashboardComponents/Box";
import StatusVsChart from "./status-vs-chart";
import LegendItem from "./legend-item";

const defaultRiskByStatus = {
  open: {
    risks: [0, 0, 0, 0, 0, 0],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  mitigated: {
    risks: [0, 0, 0, 0, 0, 0],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  accepted: {
    risks: [0, 0, 0, 0, 0, 0],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  escalated: {
    risks: [0, 0, 0, 0, 0, 0],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
};

const StatusVsBox = ({ riskByStatus = defaultRiskByStatus }) => {
  return (
    <Box className="status-vs-box position-relative h-100 border-0">
      <div className="d-flex flex-column gap-4 h-100">
        <div className="d-flex flex-column gap-3">
          <p className="fs-5 mb-0">
            Open vs mitigated vs accepted vs escalated risks
          </p>
        </div>

        <div className="d-flex flex-column gap-2">
          <StatusVsChart riskByStatus={riskByStatus} />

          <div className="d-flex align-items-center justify-content-center gap-2">
            <LegendItem color="#FF6900" label="Open" />
            <LegendItem color="#0040A3" label="Accepted" />
            <LegendItem color="#ED3447" label="Escalated" />
            <LegendItem color="#28A745" label="Mitigated" />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default StatusVsBox;
