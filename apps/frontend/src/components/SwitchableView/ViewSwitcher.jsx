import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import Box from "../Box/Index";
import { EditButton, CancelButton } from "./SwitchButton";
import { ViewContext } from "./contexts/ViewContext";

const ViewSwitcher = ({ children, ...rest }) => {
  let { editMode, canSwitch, viewTitle } = useContext(ViewContext);
  return (
    <Box>
      <Box varient="secondary-extra-light" noShadow>
        <div className={"d-flex justify-content-between"}>
          <h5 className="">{viewTitle}</h5>
          {canSwitch &&
            /**
             * TODO: this switch button needs be dynamic enough to
             * be controlled by a property
             */
            (editMode ? <CancelButton /> : <EditButton />)}
        </div>
      </Box>

      {children}
    </Box>
  );
};

export default ViewSwitcher;
