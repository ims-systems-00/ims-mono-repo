import React from "react";
import { Button, InputGroup } from "@ims-systems-00/ims-ui-kit";

const SettingGear = () => {
  return (
    <React.Fragment>
      <InputGroup className="icon-bar p-0 mt-2 me-lg-3" tag="li">
        <Button size="sm" className="btn-icon d-flex m-0">
          <i className="ims-icons-20 icon-incident-management-regular" />
          <p className="d-lg-none d-md-block px-2 text-white mb-0">Setting</p>
        </Button>
      </InputGroup>
    </React.Fragment>
  );
};

export default SettingGear;
