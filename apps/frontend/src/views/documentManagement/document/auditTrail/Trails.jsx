import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
import useScrollTracker from "@/hooks/useScrollTracker";
import {
  Activity,
  Button,
  DrawerOpener,
  DrawerRight,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import ExtraLog from "@/views/shared/Timeline/ExtraLog";
import { useAuditTrail } from "./store";

const Trails = ({}) => {
  const { activities, loadMoreActivities } = useAuditTrail();
  let [activitiesPane, handleScroll] = useScrollTracker(null, {
    onBottomReached: (element) => {
      loadMoreActivities();
    },
  });
  return (
    <React.Fragment>
      <DrawerOpener onClick={loadMoreActivities} color="primary" size="sm">
        <Button size="sm" color="secondary" className="border-0 ms-1">
          <i className="ims-icons-20 icon-icon-hourglass-24"></i> Audit trail
        </Button>
      </DrawerOpener>
      <DrawerRight
        title="Audit trail"
        containerRef={activitiesPane}
        onScroll={() => {
          handleScroll();
        }}
      >
        {activities.map((activity) => (
          <Activity
            key={activity._id}
            name={
              activity?.isAutomated
                ? activity?.value
                : activity?.created?.by?.name
            }
            avatar={
              (activity?.isAutomated && activity?.iconSrc) ||
              activity?.created?.by?.profileImageSrc ||
              "https://t4.ftcdn.net/jpg/04/62/63/65/360_F_462636502_9cDAYuyVvBY4qYJlHjW7vqar5HYS8h8x.jpg"
            }
            activity={
              activity?.isAutomated ? (
                activity?.extraLogs?.length > 0 ? (
                  activity.extraLogs.map((log) => (
                    <ExtraLog key={log._id} log={log} />
                  ))
                ) : null
              ) : (
                <FormattedContents
                  value={activity.value}
                  mediaLinkGeneratorFn={linkGenerator}
                />
              )
            }
            subHeading={moment(activity?.createdAt).format(
              "dddd, Do MMMM, YYYY, h:mm a"
            )}
          />
        ))}
      </DrawerRight>
    </React.Fragment>
  );
};

export default Trails;
