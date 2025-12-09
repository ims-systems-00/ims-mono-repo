import { useState } from "react";
import { Link } from "react-router-dom";

const TooltipLink = ({ tooltip, id, to, children, ...rest }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <>
      <Link title={tooltip} {...rest} id={id} to={to}>
        {children}
      </Link>{" "}
    </>
  );
};

export default TooltipLink;
