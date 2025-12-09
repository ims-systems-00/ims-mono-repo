import Box from "../../shared/dashboardComponents/Box";
import ContinualImprovementChart from "./continual-improvement-chart";
import LegendItem from "./legend-item";

const defaultData = [
  { name: "HR", opportunities: 4, improvements: 2 },
  { name: "Finance", opportunities: 3, improvements: 1 },
];

const ContinualImprovementBox = ({ stats = defaultData }) => {
  return (
    <Box className="continual-improvement-box position-relative border-0">
      <div className="d-flex flex-column gap-4">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between gap-4">
            <h4 className="mb-0">Continual Improvement</h4>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <LegendItem color="#FF6900" label="Improvements implemented" />
              <LegendItem color="#0040A3" label="Improvements indentified" />
            </div>
          </div>
        </div>

        <ContinualImprovementChart data={stats} />
      </div>
    </Box>
  );
};

export default ContinualImprovementBox;
