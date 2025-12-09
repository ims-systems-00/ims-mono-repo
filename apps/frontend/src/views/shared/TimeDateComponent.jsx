import moment from "moment";
import React from "react";

function TimeDateComponent({ date }) {
  return (
    <div className="d-flex align-items-center gap-1">
      <p className="text-dark">{moment(date).format("ll")},</p>

      <span
        style={{
          fontSize: "12px",
        }}
        className="text-secondary"
      >
        {moment(date).format("LT")}
      </span>
    </div>
  );
}

export default TimeDateComponent;
