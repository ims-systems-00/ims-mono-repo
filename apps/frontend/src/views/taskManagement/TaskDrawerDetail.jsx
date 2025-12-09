import Loading from "@/components/Loader/Loading";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import Timeline from "@/views/shared/Timeline/Timeline";
import { useTask } from "@/views/taskManagement/store";
import AttachmentsButtons from "./AttachmentsButtons";
import { RequestedTaskTableActions } from "./TableActions";
import TaskOverview from "./TaskOverview";
import USER_ACTIONS from "./actions";
import NavigationTabs from "@/components/NavigationTabs";

const TaskDrawerDetail = (props) => {
  let { processing, task, authAcceptanceStatus, linkedURL } = useTask();

  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_TASK].status ? (
        <Loading />
      ) : (
        task && (
          <React.Fragment>
            <DetailsDrawerHeader data={task} />
            <NavigationTabs
              container={false}
              activeTab="overview"
              navigations={[
                {
                  id: "overview",
                  text: "Overview",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                  ),
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3 mb-3">
                        <TaskOverview />
                      </div>
                    </div>
                  ),
                },
                {
                  id: "details",
                  text: "Details",
                  icon: <i className="ims-icons-20 icon-icon-list-24 me-1"></i>,
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3 mb-3">
                        {task.source.module && (
                          <div className="text-center mb-3">
                            <Link
                              className="text-info font-weight-bold"
                              to={linkedURL}
                            >
                              This task is linked to{" "}
                              {task.source.module.reference} (
                              {task.source.module.name ||
                                task.source.module.title}
                              )
                            </Link>
                          </div>
                        )}
                        {task?.completed?.status === "Completed" && (
                          <span className="text-success">
                            <i className="fas fa-calendar-check"></i> This task
                            has been completed on{" "}
                            {task?.completed?.on
                              ? moment(task.completed.on).format("DD/MM/YYYY")
                              : ""}{" "}
                            by {task?.completed.by?.name}
                          </span>
                        )}
                        <div>
                          {authAcceptanceStatus() === "Declined" && (
                            <div className="text-center mb-3">
                              <p className="text-danger">
                                This task has been declined.
                              </p>
                            </div>
                          )}
                          {authAcceptanceStatus() === "Accepted" && (
                            <div className="text-center mb-3">
                              <p className="text-secondary">
                                This task has been assigned by{" "}
                                {task.created.by && task.created.by.name}.
                              </p>
                              {task.teamPriority && (
                                <p className="text-warning">Team priority</p>
                              )}
                            </div>
                          )}
                          {authAcceptanceStatus() === "Pending" &&
                            task?.completed.status !== "Complete" && (
                              <div md="12" className="text-center mb-3">
                                <p>Do you want to accept the task?</p>
                                <RequestedTaskTableActions task={task} />
                              </div>
                            )}
                        </div>
                        <div>
                          {task.completed.by && (
                            <DetailsSectionContent
                              label="Completed:"
                              value={`${task.completed.by.name} ${moment(
                                task.completed.on
                              ).format("DD/MM/YYYY")}`}
                            />
                          )}

                          <DetailsWrapper
                            label={"Description:"}
                            iconClass={"tim-icons icon-pencil"}
                            value={task.description}
                            labelClass={"pr-2"}
                          />

                          <DetailsWrapper label={"Assigned to:"} />
                          <DetailsSectionContent
                            labelClass="text-info"
                            value={
                              <div className="mb-3">
                                {task.assignedTo &&
                                  task.assignedTo.map((assignee, index) => (
                                    <>
                                      <p className="text-bold">
                                        {assignee.user?.name}
                                        <br />
                                      </p>
                                      <span>
                                        <span
                                          className={
                                            assignee.acceptance === "Accepted"
                                              ? "text-success"
                                              : assignee.acceptance ===
                                                "Declined"
                                              ? "text-danger"
                                              : assignee.acceptance ===
                                                "Pending"
                                              ? "text-warning"
                                              : ""
                                          }
                                        >
                                          {assignee.acceptance}
                                        </span>{" "}
                                        {assignee.acceptance !== "Pending" && (
                                          <>
                                            on{" "}
                                            <span className="text-secondary">
                                              {moment(
                                                assignee.updatedOn
                                              ).format("DD/MM/YYYY HH:mm")}
                                            </span>
                                          </>
                                        )}
                                      </span>
                                    </>
                                  ))}
                              </div>
                            }
                          />
                        </div>
                        <br></br>
                        <DetailsSectionHeader title={`Attachments`} />

                        <div className="mb-3">
                          <Attachments s3Information={task.attachments}>
                            <AttachmentsButtons />
                          </Attachments>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "activity",
                  text: "Activity",
                  icon: (
                    <i className="ims-icons-20 icon-icon-activity-24 me-1"></i>
                  ),
                  component: (
                    <div className="px-2 pt-3">
                      {task.completed.status === "Complete" ? (
                        <Timeline
                          readOnly={true}
                          horizontalSpacing={false}
                          containerClass="mx-auto sm-10"
                          moduleType="tasks"
                          moduleId={task._id}
                        />
                      ) : (
                        <Timeline
                          editLabel="comment"
                          editPlaceholder="Comment"
                          horizontalSpacing={true}
                          containerClass="mx-auto sm-10"
                          moduleType="tasks"
                          moduleId={task._id}
                        />
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
};

export default TaskDrawerDetail;
