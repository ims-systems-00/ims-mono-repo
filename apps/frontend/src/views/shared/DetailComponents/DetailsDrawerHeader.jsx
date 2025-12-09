import moment from "moment";
import React from "react";

const DetailsDrawerHeader = ({ data, ...props }) => {
  return (
    <React.Fragment>
      <div>
        <h4
          style={{
            fontSize: "20px",
            marginTop: "12px",
          }}
        >
          <strong>{data?.title || data?.name}</strong>
        </h4>
        <div className="d-flex  align-items-center mb-2">
          <div>
            <p>
              <span>Reference:</span>{" "}
              <span className="text-dark">{data?.reference}</span>
            </p>
          </div>
          <div className="ms-3">
            <p>
              <span>Raised:</span>{" "}
              <span className="text-dark">
                {moment(data?.createdAt).format("DD MMMM, YYYY")}
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* <div className="border-bottom border-muted mb-3"></div> */}
    </React.Fragment>
  );
};

export default DetailsDrawerHeader;
