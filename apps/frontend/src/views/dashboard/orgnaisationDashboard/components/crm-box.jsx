import Box from "../../shared/dashboardComponents/Box";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import React, { useState } from "react";

const defaultStats = {
  totalContractValue: 1200000,
  averageContractValue: 2300,
  highestContractValue: {
    name: "Carbon Calculator",
    value: 90000,
  },
  lowestContractValue: {
    name: "IMS Techno",
    value: 10000,
  },
  contractValueByStage: [
    {
      stage: "Live",
      totalContractValue: 900000,
      count: 0,
    },
    {
      stage: "Prospect",
      totalContractValue: 200000,
      count: 0,
    },
    {
      stage: "Warm lead",
      totalContractValue: 300000,
      count: 0,
    },
    {
      stage: "Qualified",
      totalContractValue: 0,
      count: 0,
    },
    {
      stage: "Proposal",
      totalContractValue: 70000,
      count: 0,
    },
  ],
};

const CrmBox = ({ stats = defaultStats }) => {
  const chartData =
    stats?.contractValueByStage?.map((item) => ({
      name: item.stage,
      value: item.totalContractValue,
    })) || [];
  const barColors = ["#002D72", "#FF6900", "#00C49F", "#FFBB28", "#FF8042"];
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const allZero = chartData.every((d) => d.value === 0);
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    label: "",
    value: 0,
    color: "",
  });

  const handleMouseEnter = (e, d, idx) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      label: d.name,
      value: d.value,
      color: barColors[idx % barColors.length],
    });
  };
  const handleMouseLeave = () => setTooltip({ ...tooltip, show: false });

  return (
    <Box className="crm-box position-relative">
      <div className="d-flex flex-column gap-4">
        <div className="d-flex align-items-center justify-content-between gap-4">
          <h4 className="mb-0">CRM</h4>
          <p className="fs-5 mb-0">Live Customer</p>
        </div>

        {/* Ratio Bar replaces old colored bar */}

        {/* CRM Progress Bar with Empty State Overlay */}
        <div
          className="crm-progress-bar position-relative"
          style={{ minHeight: 40 }}
        >
          <div className="crm-value">
            <h3>£{stats.totalContractValue}</h3>
            <p className="label-small">Highest unit</p>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: 32,
              borderRadius: 8,
              overflow: "hidden",
              background: allZero ? "#e9ecef" : "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: allZero ? "center" : "flex-start",
            }}
          >
            {allZero ? (
              <span className="text-muted" style={{ fontSize: 13 }}>
                No contract value data
              </span>
            ) : (
              <>
                {chartData.map((d, idx) => {
                  const width =
                    total > 0 ? `${(d.value / total) * 100}%` : "0%";
                  return (
                    <div
                      key={d.name}
                      style={{
                        width,
                        height: "100%",
                        background: barColors[idx % barColors.length],
                        transition: "width 0.3s",
                        cursor: d.value > 0 ? "pointer" : "default",
                      }}
                      onMouseEnter={
                        d.value > 0
                          ? (e) => handleMouseEnter(e, d, idx)
                          : undefined
                      }
                      onMouseLeave={handleMouseLeave}
                      title={d.value > 0 ? `${d.name}: £${d.value}` : ""}
                    />
                  );
                })}
                {/* Custom Tooltip */}
                {tooltip.show && (
                  <div
                    style={{
                      position: "fixed",
                      left: tooltip.x,
                      top: tooltip.y,
                      background: "#fff",
                      color: tooltip.color,
                      border: `1px solid ${tooltip.color}`,
                      borderRadius: 4,
                      padding: "4px 10px",
                      fontSize: 13,
                      pointerEvents: "none",
                      zIndex: 9999,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    <strong>{tooltip.label}</strong>: £{tooltip.value}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* average contract value */}

        <div className="crm-list d-flex flex-column gap-3 mt-4">
          <div className="crm-item d-flex align-items-center justify-content-between gap-4">
            <div className="d-flex align-items-center gap-2">
              <span className="circle-dot"></span>
              <p className="fs-5 mb-0">Average contract value</p>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
              <span className="crm-value-tag">
                £{stats.averageContractValue}
              </span>
            </div>
          </div>

          {/* heighest contract value */}

          <div className="crm-item d-flex align-items-center justify-content-between gap-4">
            <div className="d-flex align-items-center gap-2">
              <span className="circle-dot"></span>
              <p className="fs-5 mb-0">Heighest Contract Value</p>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
              <p className="fs-5 mb-0 text-end">
                {stats?.highestContractValue?.name}
              </p>
              <span className="bg-success crm-value-tag">
                £{stats?.highestContractValue?.value}
              </span>
            </div>
          </div>

          {/* lowest contract value */}
          <div className="crm-item d-flex align-items-center justify-content-between gap-4">
            <div className="d-flex align-items-center gap-2">
              <span className="circle-dot"></span>
              <p className="fs-5 mb-0">Lowest Contract Value</p>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
              <p className="fs-5 mb-0 text-end">
                {stats?.lowestContractValue?.name}
              </p>
              <span className="bg-danger crm-value-tag">
                £{stats?.lowestContractValue?.value}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default CrmBox;
