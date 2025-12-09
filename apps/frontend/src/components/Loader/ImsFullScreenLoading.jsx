import { motion } from "framer-motion";
import React from "react";
import { useApplication } from "@/stores/applicationStore";
import imsLogo from "@/assets/img/logo.png";
const icon = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fill: "rgba(255, 255, 255, 0)",
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    fill: "rgba(255, 255, 255, 1)",
  },
};
const ImsFullScreenLoading = () => {
  const { loadingNarratives, isImsFreezedForLoading } = useApplication();
  return (
    <React.Fragment>
      {isImsFreezedForLoading ? (
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            zIndex: 1500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "black",
              opacity: 0.3,
            }}
          ></div>

          <div
            className="px-5 p-4 bg-white rounded-3 border-3 d-flex justify-content-center align-items-center"
            style={{ zIndex: 1 }}
          >
            <div className="ims-loader">
              <span className="ims-loader-inner">
                <img src={imsLogo} className="ims-loader-img" alt="" />
              </span>
            </div>
            <p className="text-dark font-wieight-bold">{loadingNarratives}</p>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default ImsFullScreenLoading;
