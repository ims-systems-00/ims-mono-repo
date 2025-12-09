import { Button } from "@ims-systems-00/ims-ui-kit";
import { useState } from "react";

const TooltipButton = ({ tooltip, id, children, ...rest }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <Button title={tooltip} {...rest} id={id}>
        {children}
      </Button>
    </>
  );
};

export default TooltipButton;
