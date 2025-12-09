import Box from "../../shared/dashboardComponents/Box";

const defaultCompliance = {
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

const SupplierManagementBox = ({ stats = defaultCompliance }) => {
  return (
    <Box className="supplier-management-box position-relative h-100 border-0">
      <div className="d-flex flex-column gap-4 h-100">
        {/* Title */}
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between gap-4">
            <h4>Supplier Management</h4>
          </div>
        </div>

        {/* Compliance Bars */}
        <div className="d-flex align-items-center gap-4 w-100 compliance-bars">
          <div className="compliance-box compliant w-100">
            <p className="fs-5 mb-0">
              Compliant : {stats?.supplierCompliance?.compliant}
            </p>
            <div className="bar bg-compliant"></div>
          </div>
          <div className="compliance-box non-compliant w-100">
            <p className="fs-5 mb-0">
              Non-Compliant : {stats?.supplierCompliance?.inCompliant}
            </p>
            <div className="bar bg-non-compliant"></div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default SupplierManagementBox;
