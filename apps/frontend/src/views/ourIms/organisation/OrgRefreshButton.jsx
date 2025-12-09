import { Button, Spinner } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import USER_ACTIONS from "./actions";
import { useOrganisation } from "./store";

const OrgRefreshButton = ({}) => {
  const { processing, loadOrganisation } = useOrganisation();
  return (
    <React.Fragment>
      <Button
        disabled={processing[USER_ACTIONS.LOAD_ORGANISATION].status}
        outline
        className="border-0"
        size="sm"
        onClick={loadOrganisation}
      >
        {processing[USER_ACTIONS.LOAD_ORGANISATION].status ? (
          <Spinner size="sm" />
        ) : (
          <i className="ims-icons-20 icon-icon-arrowsclockwise-24" />
        )}
      </Button>
    </React.Fragment>
  );
};

export default OrgRefreshButton;
