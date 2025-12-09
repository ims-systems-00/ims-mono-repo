import React from "react";
import PropTypes from "prop-types";

const LABEL_WIDTH = 56;

const DigitalMaturityBar = ({ label, value }) => {
  // For very small values, keep the label inside the bar
  const isLow = value < 12;

  return (
    <div className="digital-maturity-bar mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="dm-label">{label}</span>
      </div>
      <div
        className="progress position-relative"
        style={{ height: 38, background: "#E9F0FB", borderRadius: 8 }}
      >
        <div
          className="progress-bar bg-primary position-relative"
          role="progressbar"
          style={{
            width: `${value}%`,
            borderRadius: 8,
            height: 38,
            transition: "width 0.6s ease",
            overflow: "visible",
            position: "relative",
          }}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className={`dm-percentage-label bg-white text-primary fw-bold${
              isLow ? " low" : ""
            }`}
            style={{
              minWidth: LABEL_WIDTH,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              border: "2px solid #E9F0FB",
              fontSize: 16,
              position: "absolute",
              right: isLow ? "auto" : 8,
              left: isLow ? 4 : "auto",
              top: "50%",
              transform: "translateY(-50%)",
              background: "#fff",
              zIndex: 2,
              padding: "0 8px",
            }}
          >
            {value}%
          </span>
        </div>
      </div>
    </div>
  );
};

DigitalMaturityBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default DigitalMaturityBar;
