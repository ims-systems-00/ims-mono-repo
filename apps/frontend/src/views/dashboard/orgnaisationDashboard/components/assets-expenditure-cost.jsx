import Box from "../../shared/dashboardComponents/Box";
import VerticalChart from "./vertical-chart";
import LegendItem from "./legend-item";

const defaultStats = {
  amounts: [0, 0, 0, 0, 0],
  areas: ["Hardware", "Software", "People", "Premises", "Information"],
  costs: [20, 30, 40, 50, 60],
};

const AssetsExpenditureCost = ({ stats = defaultStats }) => {
  const { areas, costs } = stats || defaultStats;

  const costData = (areas || []).map((name, i) => ({
    name,
    value: costs?.[i] ?? 0,
  }));

  return (
    <Box className="assets-expenditure-box position-relative h-100 border-0">
      <div className="d-flex flex-column justify-content-between gap-4 h-100">
        <div className="d-flex align-items-center justify-content-between gap-4 mt-3">
          <p className="fs-5 mb-0">Assets expenditure (Cost)</p>
          <LegendItem color="#FF6900" label="Cost" />
        </div>
        {/* Cost Chart */}
        <VerticalChart data={costData} barColor="#FF6900" />
      </div>
    </Box>
  );
};

export default AssetsExpenditureCost;
