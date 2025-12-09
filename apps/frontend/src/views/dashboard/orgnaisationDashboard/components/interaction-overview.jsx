import Box from "../../shared/dashboardComponents/Box";
import {
  DotsSixIcon,
  DotsThreeOutlineVerticalIcon,
} from "@phosphor-icons/react";
import InteractionBoxImage from "../../../../assets/img/total-interaction.png";
import EngagedSmallBoxImage from "../../../../assets/img/customer-engaged.png";

const InteractionOverview = () => {
  return (
    <Box
      height="100%"
      minHeight="205px"
      border="none"
      className="position-relative interaction-overview"
    >
      <div className="d-flex flex-column gap-4">
        {/* Top Cards */}
        <div className="d-flex flex-column flex-md-row align-items-stretch gap-4">
          <InfoBox
            title="Total interaction"
            image={InteractionBoxImage}
            value={`07`}
          />
          <InfoBox
            title="Customer engaged"
            className="bg-orange"
            image={EngagedSmallBoxImage}
            value={`07`}
          />
        </div>

        {/* Section Title */}
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Weekly interaction overview</h4>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table custom-table w-100">
            <thead>
              <tr>
                <th>
                  <div className="d-flex align-items-center gap-1 h-100">
                    <DotsSixIcon size={16} />
                    <span>Customer name</span>
                  </div>
                </th>
                <th>
                  <div className="d-flex align-items-center h-100">
                    <span>Number of interactions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((_, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <DotsSixIcon size={16} />
                      <span className="text-dark">YouLearnt...</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-dark">2</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Box>
  );
};

export default InteractionOverview;

const InfoBox = ({ title, value, className = "bg-primary", image }) => {
  return (
    <div className={`info-card ${className}`}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div className="dot"></div>
          <p className="fs-6 text-white mb-0">{title}</p>
        </div>
        <div className="icon-box">
          <DotsThreeOutlineVerticalIcon size={12} className="text-white" />
        </div>
      </div>
      <h2 className="text-white">{value}</h2>
      <div className="img-wrapper">
        <img src={image} alt="Interaction" />
      </div>
    </div>
  );
};
