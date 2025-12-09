import React from "react";

const LegendItem = ({
  color,
  label,
  size = 12,
  borderRadius = "2px",
  className = "",
}) => {
  return (
    <div className={`d-flex align-items-center gap-1 ${className}`}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius,
          background: color,
        }}
      ></div>
      <p style={{ fontSize: "12px", margin: 0 }}>{label}</p>
    </div>
  );
};

export default LegendItem;
