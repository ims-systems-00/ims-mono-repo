import Loading from "@/components/Loader/Loading";
import { Panel } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { getCurrentSessionData } from "@/services/authService";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import TimeLine from "@/views/shared/Timeline/Timeline";
import AttachmentsButtons from "./AttachmentsButtons";
import TaskActionsContextProvider from "./contexts/TaskActionsContext";
import useTask from "./hooks/useTask";
import { RequestedTaskTableActions } from "./TableActions";
import TaskActions from "./TaskActions";
import TaskForm from "./TaskForm";
import TaskOverview from "./TaskOverview";
export const CommentContext = React.createContext();

const TaskDetail = (props) => {
  const { isModalOpen = false } = props;
  let { entityAccessControl } = useAccess();
  const user = getCurrentSessionData();
  const {
    processing,
    task,
    alert,
    users,
    authAcceptanceStatus,
    checkAssignedTo,
    isCompletedTask,
    setProcessing,
    handleCompleteTask,
    handleUpdateTask,
    handleRequestedTask,
    handleDeleteAttachments,
    warningWithConfirmMessage,
  } = useTask({
    taskId:
      (props.match && props.match.params.id) || (props.view && props.view._id),
    onUpdate: props.onUpdate,
  });

  const viewCheck = (task) => {
    (task.completed.status !== "Complete" &&
      authAcceptanceStatus() === "Accepted") ||
      entityAccessControl({
        users: task && task.created.by ? [task.created.by._id] : [],
        effect: "Allow",
      });
  };
  return (
    <React.Fragment>
      {alert}
      <div className="content">
        <h4 className="mb-3 text-primary fw-bold">Task details</h4>
        <TaskActionsContextProvider
          value={{
            task,
            users,
            processing,
            setProcessing,
            authAcceptanceStatus,
            handleCompleteTask,
            handleUpdateTask,
            handleRequestedTask,
            handleDeleteAttachments,
            warningWithConfirmMessage,
          }}
        >
          <ErrorHandlerComponent
            hasError={processing.error}
            errorMessage="This task has been deleted or removed"
          >
            {processing.action === "initializing-data" ? (
              <Loading />
            ) : (
              task && (
                <Row>
                  <Col xl="4" sm="12">
                    <DetailsSidebar
                      title="Details"
                      label={`Raised on ${moment(task?.created?.on).format(
                        "DD/MM/YYYY"
                      )}`}
                    >
                      <TaskActions task={task} setProcessing={setProcessing} />
                      <TaskOverview data={task} />
                    </DetailsSidebar>
                  </Col>
                  <Col xl="8" sm="12" className="mb-3">
                    <SwitchableView
                      viewTitle={task.name}
                      canSwitch={
                        !isCompletedTask(task) &&
                        checkAssignedTo(
                          task?.assignedTo,
                          task?.created?.by,
                          user
                        ) &&
                        viewCheck(task)
                      }
                    >
                      <SecondaryWrapperChild>
                        <TaskForm task={task} processing={processing} />
                      </SecondaryWrapperChild>
                      <PrimaryWrapperChild>
                        {task?.completed?.status === "Completed" && (
                          <span className="text-success font-size-subtitle-2">
                            <i className="fas fa-calendar-check"></i> This task
                            has been completed on{" "}
                            {task?.completed?.on
                              ? moment(task.completed.on).format("DD/MM/YYYY")
                              : ""}{" "}
                            by {task?.completed.by?.name}
                          </span>
                        )}
                        <Row>
                          {authAcceptanceStatus() === "Declined" && (
                            <Col md="12" className="text-center mb-5">
                              <p className="text-danger">
                                This task has been declined.
                              </p>
                            </Col>
                          )}
                          {authAcceptanceStatus() === "Accepted" && (
                            <Col md="12" className="text-center mb-5">
                              {task.teamPriority ? (
                                <p className="text-secondary">
                                  This is a Team Task that has been assigned to
                                  you
                                </p>
                              ) : (
                                <p className="text-secondary">
                                  This task has been assigned to you by{" "}
                                  {task.created.by && task.created.by.name}.
                                </p>
                              )}
                            </Col>
                          )}
                          {authAcceptanceStatus() === "Pending" &&
                            task?.completed.status !== "Complete" && (
                              <Col md="12" className="text-center mb-5">
                                <p>Would you like to accept?</p>
                                <RequestedTaskTableActions task={task} />
                              </Col>
                            )}
                        </Row>
                        <Row>
                          <Col md="12">
                            <DetailsWrapper
                              label={"Description:"}
                              iconClass={"tim-icons icon-pencil"}
                              value={task.description}
                              labelClass={"pr-2"}
                            />
                          </Col>
                          <Col md="12">
                            <DetailsWrapper label={"Assigned to:"} />
                            <DetailsSectionContent
                              labelClass="text-info"
                              value={
                                <Row className="mt-3">
                                  {task.assignedTo &&
                                    task.assignedTo.map((assignee, index) => (
                                      <Col md="3" key={assignee._id}>
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
                                          {assignee.acceptance !==
                                            "Pending" && (
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
                                      </Col>
                                    ))}
                                </Row>
                              }
                            />
                          </Col>
                        </Row>
                        <DetailsSectionHeader title={`Attachments`} />
                        <Row>
                          <Col md="12" className="mb-4">
                            <Attachments s3Information={task.attachments}>
                              <AttachmentsButtons />
                            </Attachments>
                          </Col>
                        </Row>
                        <DetailsSectionHeader title={`Comments`} />
                        <Row>
                          <Col md="12">
                            {task.completed.status === "Complete" ? (
                              <TimeLine
                                readOnly={true}
                                horizontalSpacing={false}
                                containerClass="mx-auto sm-10"
                                moduleType="tasks"
                                moduleId={task._id}
                              />
                            ) : (
                              <TimeLine
                                editLabel="comment"
                                editPlaceholder="Comment"
                                horizontalSpacing={true}
                                containerClass="mx-auto sm-10"
                                moduleType="tasks"
                                moduleId={task._id}
                              />
                            )}
                          </Col>
                        </Row>
                      </PrimaryWrapperChild>
                    </SwitchableView>
                  </Col>
                </Row>
              )
            )}
          </ErrorHandlerComponent>
        </TaskActionsContextProvider>
      </div>
    </React.Fragment>
  );
};

export default TaskDetail;
