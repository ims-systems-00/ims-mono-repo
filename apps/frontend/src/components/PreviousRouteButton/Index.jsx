import classNames from "classnames";

import { Button } from "@ims-systems-00/ims-ui-kit";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function PreviousRouteButton({ ...props }) {
  const history = useHistory();
  return (
    <Button
      {...props}
      className={classNames("border-0", props.className)}
      onClick={(e) => {
        history.goBack();
        if (typeof props.onClick === "function") props.onClick(e);
      }}
    >
      {props.children}
    </Button>
  );
}
