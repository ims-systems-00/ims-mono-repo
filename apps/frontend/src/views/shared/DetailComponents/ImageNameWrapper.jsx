import React from "react";

const ImageNameWrapper = ({ img, name }) => {
  return (
    <React.Fragment>
      <img
        src={
          img ||
          "https://assets.imssystems.tech/images/system/avatar-placeholder.jpg"
        }
        alt="avatar"
        className="avatar-sm me-1 border"
      />
      <span className="text-dark"> {name}</span>
    </React.Fragment>
  );
};

export default ImageNameWrapper;
