import React from "react";

import DigitalMaturityBar from "./DigitalMaturityBar";
import { Row, Col } from "@ims-systems-00/ims-ui-kit";
import NavigationTabs from "@/components/NavigationTabs";
import Box from "../Box";

const bmTradaData = [
  { label: "Risk management", value: 80 },
  { label: "Incident management", value: 60 },
  { label: "Supplier management", value: 30 },
];

const DigitalMaturityTab = () => (
  <div className="digital-maturity-tab p-3">
    {bmTradaData.map((item, idx) => (
      <DigitalMaturityBar key={idx} label={item.label} value={item.value} />
    ))}
  </div>
);

const tabs = [
  { id: "bm-trada", text: "BM Trada", component: <DigitalMaturityTab /> },
  {
    id: "carbon",
    text: "Carbon Calculator",
    component: <div className="p-4 text-center text-muted">No data</div>,
  },
  {
    id: "design",
    text: "Design Team",
    component: <div className="p-4 text-center text-muted">No data</div>,
  },
  {
    id: "dev",
    text: "Development Team",
    component: <div className="p-4 text-center text-muted">No data</div>,
  },
  {
    id: "exec",
    text: "Executive Team",
    component: <div className="p-4 text-center text-muted">No data</div>,
  },
  {
    id: "qa",
    text: "Quality Assurance",
    component: <div className="p-4 text-center text-muted">No data</div>,
  },
  {
    id: "finance",
    text: "Finance",
    component: <div className="p-4 text-center text-muted">No data</div>,
  },
];

const DigitalMaturity = () => {
  return (
    <Box
      height={410}
      padding={4}
      rounded={4}
      className="shadow-sm position-relative digital-maturity-box"
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h3 className="fw-bold mb-0">Digital Maturity</h3>
        <div
          className="d-flex flex-column align-items-center"
          style={{ minWidth: 48 }}
        >
          <div className="circle-progress mb-1">
            <svg width="48" height="48">
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="#E9F0FB"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="#0052CC"
                strokeWidth="4"
                strokeDasharray={138}
                strokeDashoffset={40}
              />
            </svg>
            <div className="circle-progress-label">
              14
              <br />
              28
            </div>
          </div>
        </div>
      </div>
      <NavigationTabs navigations={tabs} />
    </Box>
  );
};

export default DigitalMaturity;
