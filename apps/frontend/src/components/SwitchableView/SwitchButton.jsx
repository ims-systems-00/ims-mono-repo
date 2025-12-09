import { Button } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { ViewContext } from "./contexts/ViewContext";

export const EditButton = ({ children, ...rest }) => {
  let { switchView } = useContext(ViewContext);
  return (
    <Button
      color="primary"
      size="sm"
      onClick={() => switchView()}
      className="mb-2 pull-right"
      {...rest}
    >
      <span className="font-weight-bold">
        <i class="ims-icons-20-16 icon-icon-pencil-24" />
      </span>
    </Button>
  );
};
export const CancelButton = ({ children, ...rest }) => {
  let { switchView } = useContext(ViewContext);
  return (
    <Button
      color="danger"
      size="sm"
      onClick={() => switchView()}
      className="mb-2 pull-right"
      {...rest}
    >
      <span className="font-weight-bold ">
        <i className="ims-icons-20-16 icon-icon-cross-24" />
      </span>
    </Button>
  );
};
