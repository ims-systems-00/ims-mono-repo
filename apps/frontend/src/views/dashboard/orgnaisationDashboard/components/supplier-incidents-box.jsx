import Box from "../../shared/dashboardComponents/Box";
import SupplierIncidentsChart from "./supplier-incidents-chart";

const defaultStats = {
  procurementValue: 0,
  supplierIncidents: {
    totalIncidents: 11,
    openIncidents: 10,
    resolvedIncidents: 1,
  },
  supplierCompliance: {
    compliant: 0,
    inCompliant: 0,
    percentage: 0,
    riskLevel: "Hazardous",
  },
};

const SupplierIncidentsBox = ({ stats = defaultStats }) => {
  return (
    <Box className="supplier-incidents-box position-relative h-100 border-0">
      <div className="d-flex flex-column justify-content-between gap-4 h-100">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between gap-4">
            <h4 className="mb-0">Supplier Incidents</h4>
          </div>
        </div>

        <div className="chart-container position-relative">
          <SupplierIncidentsChart />
          <div className="chart-summary position-absolute bottom-0 start-50 translate-middle-x text-center">
            <h3>
              Total incidents : {stats?.supplierIncidents?.totalIncidents}
            </h3>
            <div className="d-flex flex-column align-items-center gap-1 mt-2">
              <div className="d-flex align-items-center gap-1">
                <div className="dot dot-blue" />
                <p className="fs-5 mb-0">
                  Open incidents : {stats?.supplierIncidents?.openIncidents}
                </p>
              </div>
              <div className="d-flex align-items-center gap-1">
                <div className="dot dot-green" />
                <p className="fs-5 mb-0">
                  Total resolved : {stats?.supplierIncidents?.resolvedIncidents}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default SupplierIncidentsBox;
