import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import Box from "../../shared/dashboardComponents/Box";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MdOutlineDataExploration } from "react-icons/md";

const defaultStats = {
  total: 12,
  scheduled: 5,
  nonConformities: [
    { businessUnit: "HR", amount: 3 },
    { businessUnit: "Finance", amount: 7 },
    { businessUnit: "Development", amount: 10 },
    { businessUnit: "Testing", amount: 10 },
    { businessUnit: "HR", amount: 3 },
  ],
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF69B4",
  "#A020F0",
  "#00CED1",
  "#FFD700",
];

const NonConformitiesBox = ({ stats = defaultStats }) => {
  const nonConformities = stats?.nonConformities || [];
  const hasData = Array.isArray(nonConformities) && nonConformities.length > 0;

  if (!hasData) {
    return (
      <Box height="278px" className=" border-0">
        <div className="d-flex flex-column gap-4">
          <h4>Non-Conformities</h4>
          <div className="d-flex flex-column align-items-center justify-content-center gap-2">
            <MdOutlineDataExploration size={64} color="#0040a3" />
            <p className="fs-5 mb-0 text-primary">No data available</p>
          </div>
        </div>
      </Box>
    );
  }

  // Sort by amount descending and take top 4
  const sortedUnits = [...nonConformities].sort(
    (a, b) => (b.amount || 0) - (a.amount || 0)
  );
  const topUnits = sortedUnits.slice(0, 4);
  // Prepare data for chart
  const chartData = topUnits.map((item) => ({
    name: item.businessUnit,
    value: item.amount,
  }));
  // Total units (sum of all nonConformities amounts)
  const totalUnits = topUnits.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  return (
    <Box className="non-conformities-box position-relative h-100 border-0">
      <div className="d-flex flex-column gap-4">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between gap-4">
            <h4>Non-Conformities</h4>
            <p className="fs-5 mb-0">Top business unit</p>
          </div>
        </div>

        <Row>
          <Col md={8}>
            <Row>
              {topUnits.map((item, i) => (
                <Col
                  sm={6}
                  className={i >= 2 ? "mt-3" : ""}
                  key={item.businessUnit}
                >
                  <div className="conformity-card d-flex flex-column justify-content-between w-100">
                    <div className="d-flex align-items-center gap-2">
                      <div className="circle-dot"></div>
                      <p className="fs-6 mb-0">{item.businessUnit}</p>
                    </div>
                    <div className="d-flex align-items-end gap-1">
                      <h3 className="mb-0">{item.amount}</h3>
                      <p className="mb-0 label-small">Highest unit</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>

          <Col md={4}>
            <div className="chart-wrapper position-relative">
              <ResponsiveContainer width="100%" height={182}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [`${value}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-center position-absolute top-50 start-50 translate-middle text-center">
                <h3>{totalUnits}</h3>
                <p className="label-small">Total unit</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Box>
  );
};

export default NonConformitiesBox;
