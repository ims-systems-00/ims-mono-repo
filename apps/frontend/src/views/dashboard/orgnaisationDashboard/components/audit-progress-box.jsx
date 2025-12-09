import Box from "../../shared/dashboardComponents/Box";
import { CalendarIcon } from "@phosphor-icons/react";

const defaultStats = {
  total: 100,
  scheduled: 70,
  nonConformities: [],
};

const AuditProgressBox = ({ stats = defaultStats }) => {
  const { total, scheduled } = stats || {};
  // Calculate on time completion rate
  const completionRate =
    total > 0 ? Math.round(((total - scheduled) / total) * 100) : 0;

  return (
    <Box className="audit-progress-box position-relative h-100 border-0">
      <div className="d-flex flex-column gap-4 h-100">
        {/* Header */}
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between gap-4">
            <h4>Audit in Progress</h4>
          </div>
        </div>

        {/* Audit Cards */}
        <div className="audit-cards d-flex align-items-center gap-4 h-100">
          {/* Left Card */}
          <div className="audit-card card-light d-flex flex-column align-items-center justify-content-center gap-4">
            <div className="icon-circle border-blue">
              <CalendarIcon size={24} className="text-blue" />
            </div>
            <div className="text-center">
              <p className="fs-5 text-blue mb-0">Total</p>
              <h2 className="mt-2 text-blue">{total}</h2>
            </div>
          </div>

          {/* Right Card */}
          <div className="audit-card card-dark d-flex flex-column align-items-center justify-content-center gap-4">
            <div className="icon-circle border-white">
              <CalendarIcon size={24} className="text-white" />
            </div>
            <div className="text-center">
              <p className="fs-5 text-white mb-0">Scheduled</p>
              <h2 className="mt-2 text-white">{scheduled}</h2>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="d-flex align-items-center justify-content-between gap-2">
          <p className="fs-5 mb-0">On time completion rate:</p>
          <div className="d-flex align-items-center gap-2">
            <h3 className="mb-0">{completionRate}%</h3>
            {/* Optionally, you can add a rate badge or trend here if you have more data */}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default AuditProgressBox;
