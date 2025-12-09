import React from "react";
import { Button } from "@ims-systems-00/ims-ui-kit";
import classNames from "classnames";

const SupportButton = ({ children, ...props }) => {
  return (
    <div className="drawer-support-btn">
      <Button
        className={classNames("", {
          [props.className]: props.className,
        })}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};

export default SupportButton;
