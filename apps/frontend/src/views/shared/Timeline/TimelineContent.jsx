import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
import { Activity, Button, Spinner } from "@ims-systems-00/ims-ui-kit";
import { getCurrentSessionData } from "@/services/authService";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import timePassedSinceCreated from "@/utils/timePassedSince";
import USER_ACTIONS from "./actions";
import ActivityBox from "./ActivityBox";
import useActivity from "./store/useActivity";

import moment from "moment";
import React from "react";
import ExtraLog from "./ExtraLog";
import Loading from "@/components/Loader/Loading";

const TimelineContent = (props) => {
  const {
    activities,
    processing,
    viewMoreActivity,
    readOnly,
    selectedActivity,
    selectActivity,
    deleteActivity,
  } = useActivity() || {};
  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_ACTIVITIES].status ? (
        <Loading />
      ) : (
        <React.Fragment>
          {!readOnly && <ActivityBox />}
          {activities.length > 0 ? (
            activities.map((activity) => (
              <Activity
                key={activity._id}
                name={
                  activity?.isAutomated
                    ? activity?.value
                    : activity.created?.by?.name
                }
                avatar={
                  (activity?.isAutomated && activity?.iconSrc) ||
                  activity?.created?.by?.profileImageSrc ||
                  "https://t4.ftcdn.net/jpg/04/62/63/65/360_F_462636502_9cDAYuyVvBY4qYJlHjW7vqar5HYS8h8x.jpg"
                }
                activity={
                  !activity?.isAutomated ? (
                    selectedActivity?._id === activity?._id && !readOnly ? (
                      <ActivityBox activity={activity} />
                    ) : processing[USER_ACTIONS.UPDATE_ACTIVITY].action ===
                        "update-activity" &&
                      processing[USER_ACTIONS.UPDATE_ACTIVITY].id ===
                        activity._id ? (
                      "Saving..."
                    ) : (
                      <FormattedContents
                        value={activity.value}
                        mediaLinkGeneratorFn={linkGenerator}
                      />
                    )
                  ) : activity?.isAutomated &&
                    activity?.extraLogs?.length > 0 ? (
                    activity.extraLogs.map((log) => (
                      <ExtraLog key={log._id} log={log} />
                    ))
                  ) : null
                }
                subHeading={
                  activity?.isAutomated
                    ? moment(activity?.createdAt).format(
                        "dddd, Do MMMM, YYYY, h:mm a"
                      )
                    : timePassedSinceCreated(activity?.createdAt)
                }
                footer={
                  !activity?.isAutomated && (
                    <React.Fragment>
                      {activity.created.by &&
                        activity.created.by._id ===
                          getCurrentSessionData().user?._id &&
                        !readOnly &&
                        selectedActivity?._id !== activity?._id && (
                          <React.Fragment>
                            <Button
                              size="sm"
                              className="border border-0"
                              outline
                              disabled={
                                processing[USER_ACTIONS.UPDATE_ACTIVITY]
                                  .action === "update-activity" &&
                                processing[USER_ACTIONS.UPDATE_ACTIVITY].id ===
                                  activity._id
                              }
                              onClick={() => selectActivity(activity)}
                            >
                              {processing[USER_ACTIONS.UPDATE_ACTIVITY]
                                .action === "update-activity" &&
                              processing[USER_ACTIONS.UPDATE_ACTIVITY].id ===
                                activity._id ? (
                                <Spinner size="sm" />
                              ) : (
                                <span>
                                  <i className="ims-icons-20 icon-icon-pencil-24" />{" "}
                                  Edit
                                </span>
                              )}
                            </Button>
                            <Button
                              className="border border-0"
                              outline
                              color="danger"
                              disabled={
                                processing[USER_ACTIONS.DELETE_ACTIVITY]
                                  .action === "delete-activity" &&
                                processing[USER_ACTIONS.DELETE_ACTIVITY].id ===
                                  activity._id
                              }
                              size="sm"
                              onClick={() => deleteActivity(activity._id)}
                            >
                              {processing[USER_ACTIONS.DELETE_ACTIVITY]
                                .action === "delete-activity" &&
                              processing[USER_ACTIONS.DELETE_ACTIVITY].id ===
                                activity._id ? (
                                <Spinner size="sm" />
                              ) : (
                                <span>
                                  <i className="ims-icons-20 icon-icon-trash-24" />{" "}
                                  Delete
                                </span>
                              )}
                            </Button>
                          </React.Fragment>
                        )}
                    </React.Fragment>
                  )
                }
              />
            ))
          ) : (
            <div className="text-center">
              <span className=" font-size-subtitle-2">No activities found</span>
            </div>
          )}
          {processing[USER_ACTIONS.LOAD_ACTIVITIES].hasMore && (
            <Button
              size="sm"
              color="link"
              className="border border-0 mx-auto d-block bg-transparent shadow-none"
              onClick={viewMoreActivity}
              disabled={processing[USER_ACTIONS.LOAD_ACTIVITIES].status}
            >
              {processing[USER_ACTIONS.LOAD_ACTIVITIES].status ? (
                <React.Fragment>
                  Loading <Spinner size="sm"></Spinner>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  View more{" "}
                  <i className="ims-icons-16 icon-icon-filearrowdown-24" />
                </React.Fragment>
              )}
            </Button>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default TimelineContent;
