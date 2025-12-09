import React from "react";

const ProfileTextWrapper = ({ img, name }) => {
  return (
    <React.Fragment>
      <img
        src={
          img ||
          "https://assets.imssystems.tech/images/system/avatar-placeholder.jpg"
        }
        alt="avatar"
        className="card-avatar me-1 border"
      />
      {name}
    </React.Fragment>
  );
};

export default ProfileTextWrapper;
