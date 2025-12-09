import Box from "../../shared/dashboardComponents/Box";
import RiskManagementLineChart from "./risk-management-line-chart";
import React, { useState } from "react";

const defaultRiskByType = {
  hardware: {
    risks: [2, 3, 4, 5, 6, 7],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  software: {
    risks: [5, 6, 7, 8, 9, 10],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  people: {
    risks: [10, 11, 12, 13, 14, 15],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  premises: {
    risks: [15, 16, 17, 18, 19, 20],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  organizational: {
    risks: [20, 21, 22, 23, 24, 25],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  clinical: {
    risks: [25, 26, 27, 28, 29, 30],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
};

const RiskManagementBox = ({ riskByType = defaultRiskByType }) => {
  const tabKeys = Object.keys(riskByType);
  const [activeTab, setActiveTab] = useState(tabKeys[0]);
  const activeData = riskByType[activeTab];

  return (
    <Box className="risk-management-box position-relative h-100 border-0">
      <div className="d-flex flex-column gap-4 h-100">
        {/* Header Section */}
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-start justify-content-between gap-4 flex-wrap">
            <h4>Risk Management</h4>
            <div className="risk-tabs d-flex align-items-center overflow-hidden">
              {tabKeys.map((label, index) => (
                <span
                  key={label}
                  className={`risk-tab fs-6 text-white ${
                    activeTab === label ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(label)}
                  style={{ cursor: "pointer", textTransform: "capitalize" }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <p className="fs-5 mb-0">Risks raised over the last year</p>
        </div>

        {/* Chart Section */}
        <RiskManagementLineChart
          months={activeData.months}
          risks={activeData.risks}
        />
      </div>
    </Box>
  );
};

export default RiskManagementBox;
