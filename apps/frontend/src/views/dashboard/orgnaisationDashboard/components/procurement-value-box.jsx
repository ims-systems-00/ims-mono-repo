import Box from "../../shared/dashboardComponents/Box";

const defaultStats = {
  procurementValue: 0,
  supplierIncidents: {
    totalIncidents: 0,
    openIncidents: 0,
    resolvedIncidents: 0,
  },
  supplierCompliance: {
    compliant: 0,
    inCompliant: 0,
    percentage: 0,
    riskLevel: "Hazardous",
  },
};
const ProcurementValueBox = ({ stats = defaultStats }) => (
  <Box className="procurement-value-box bg-primary text-white position-relative h-100 border-0">
    <div className="d-flex flex-column gap-4">
      {/* Title */}
      <div className="d-flex align-items-center gap-1">
        <div className="indicator" />
        <p className="fs-5 mb-0 text-white">Procurement value</p>
      </div>

      {/* Value and Chart Background */}
      <div className="value-section d-flex flex-column align-items-center justify-content-center gap-2">
        <h2 className="mb-0 text-white">£{stats?.procurementValue}</h2>
        <div className="value-chart-bg w-100" />
      </div>
    </div>
  </Box>
);

export default ProcurementValueBox;
