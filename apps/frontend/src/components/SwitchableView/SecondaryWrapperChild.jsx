import React, { useContext } from "react";
import { ViewContext } from "./contexts/ViewContext";

const SecondaryWrapperChild = ({ children, ...rest }) => {
  let { editMode } = useContext(ViewContext);
  return <div {...rest}>{editMode && <>{children}</>}</div>;
};

export default SecondaryWrapperChild;
