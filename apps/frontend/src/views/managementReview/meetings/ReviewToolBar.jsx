import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useSchedule } from "./store";
import ReviewLinksActions from "./ReviewLinksActions";
import Can from "@/components/Can/Can";
import { IMS_SERVICES, ACTIONS } from "@/rolesAndPermissions";

const ReviewToolBar = () => {
  const { isCompletedManagementReview } = useSchedule();
  return (
    <Can
      policy={{
        service: IMS_SERVICES.MANAGEMENT_REVIEW,
        action: ACTIONS.CREATE,
      }}
    >
      {!isCompletedManagementReview() && (
        <React.Fragment>
          <div className="">
            <ReviewLinksActions />
          </div>
          <DrawerOpener drawerId="edit-review-form">
            <Button outline size="sm" className="border-0 ">
              <i className="ims-icons-20 icon-icon-pencil-24" />
            </Button>
          </DrawerOpener>
        </React.Fragment>
      )}
    </Can>
  );
};

export default ReviewToolBar;
