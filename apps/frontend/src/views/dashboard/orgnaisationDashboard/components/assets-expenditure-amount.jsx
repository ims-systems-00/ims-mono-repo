import Box from "../../shared/dashboardComponents/Box";
import VerticalChart from "./vertical-chart";
import LegendItem from "./legend-item";

const defaultStats = {
  amounts: [10, 20, 23, 15, 30],
  areas: ["Hardware", "Software", "People", "Premises", "Information"],
  costs: [20, 30, 40, 50, 60],
};

const AssetsExpenditureAmount = ({ stats = defaultStats }) => {
  const { amounts, areas } = stats || defaultStats;
  // Prepare data for charts
  const amountData = (areas || []).map((name, i) => ({
    name,
    value: amounts?.[i] ?? 0,
  }));

  return (
    <Box className="assets-expenditure-box position-relative h-100 border-0">
      <div className="d-flex flex-column justify-content-between gap-4 h-100">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between gap-4">
          <p className="fs-5 mb-0">Assets expenditure (Amount)</p>
          <LegendItem color="#0040A3" label="Amount" />
        </div>
        {/* Amount Chart */}
        <VerticalChart data={amountData} barColor="#0040A3" />
      </div>
    </Box>
  );
};

export default AssetsExpenditureAmount;
