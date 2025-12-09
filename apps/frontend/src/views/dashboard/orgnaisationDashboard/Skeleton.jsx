import React from "react";
import "./Skeleton.css";

const Skeleton = ({
  width = "100%",
  height = "1rem",
  className = "",
  style = {},
  circle = false,
}) => {
  return (
    <div
      className={`skeleton-base rounded-3 ${className}`}
      style={{
        width,
        height,
        borderRadius: circle ? "50%" : "0.375rem",
        ...style,
      }}
    />
  );
};

export default Skeleton;
