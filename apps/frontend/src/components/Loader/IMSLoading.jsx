import React from "react";
import imsLogo from "@/assets/img/logo.png";
const Loading = ({ color = "light", text = "Loading..." }) => {
  return (
    <div className="ims-loader">
      <span className="ims-loader-inner">
        <img src={imsLogo} className="ims-loader-img" alt="" />
      </span>
    </div>
  );
};

export default Loading;
{
  /* <motion.svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 100 100"
  style={{
    width: "56%",
    overflow: "visible",
    stroke: "#fff",
    strokeWidth: 2,
    strokeLinejoin: "round",
    strokeLinecap: "round",
  }}
>
  <motion.path
    d="M0 100V0l50 50 50-50v100L75 75l-25 25-25-25z"
    variants={icon}
    initial="hidden"
    animate="visible"
    transition={{
      default: { duration: 2, ease: "easeInOut" },
      fill: { duration: 2, ease: [1, 0, 0.8, 1] },
    }}
  />
</motion.svg>; */
}
