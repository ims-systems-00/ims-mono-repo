import Loading from "@/components/Loader/Loading";
import {
  Button,
  Col,
  DrawerOpener,
  PopoverBody,
  Row,
  Table,
  UncontrolledPopover,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { Link } from "react-router-dom";
import { truncate } from "@/utils/truncate";
import USER_ACTIONS from "@/views/taskManagement/actions";
import { useTask } from "@/views/taskManagement/store";

const TaskManagement = ({}) => {
  const { toggle } = useDrawer();
  const {
    isCompletedTask,
    handleCompleteTask,
    alert,
    warningWithConfirmMessage,
    handleDeleteTask,
    setTask,
    handleCreateTask,
    processing,
    todoLists,
  } = useTask();

  return (
    <div>
      {alert}
      <Row>
        <Col md="12">
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/admin/tasks">
              <h4 className="font-weight-500 text-dark">To-do list</h4>
            </Link>
            <DrawerOpener drawerId="create-task">
              <Button size="sm" outline color="dark" className="rounded">
                <i className="fa-solid fa-plus"></i>
              </Button>
            </DrawerOpener>
          </div>
          {processing[USER_ACTIONS.LOAD_TODOLISTS].status && <Loading />}
          <div className="task-management-list">
            {todoLists.length > 0 &&
              todoLists.slice(0, 5).map((task) => {
                if (isCompletedTask(task)) return null;
                return (
                  <div
                    key={`task-${task._id}`}
                    id={`task-${task._id}`}
                    className="bg-secondary-extra-light rounded-3 d-flex align-items-center my-3 task-card px-2 py-1"
                  >
                    <img
                      style={{
                        width: "36px",
                        height: "36px",
                        marginRight: "12px",
                      }}
                      src={
                        "https://assets.imssystems.tech/images/system/notification/task-assigned.png"
                      }
                      alt="avatar"
                      className=" mt-1"
                    />
                    <div>
                      <span className="text-dark font-size-subtitle-1">
                        {truncate(task.name, 15)}
                      </span>{" "}
                      &nbsp; &nbsp;
                      {task.teamPriority && (
                        <i className="ims-icons-20  icon-icon-users-24 text-success font-weight-bold" />
                      )}
                      <p className=" font-size-subtitle-2">
                        {moment(task.created.on).format("MMMM DD [at] hh:mm A")}
                      </p>
                    </div>
                    <UncontrolledPopover
                      placement="bottom"
                      trigger="hover"
                      target={`task-${task._id}`}
                    >
                      <PopoverBody
                        style={{
                          minWidth: "254px",
                        }}
                        className="shadow rounded p-0 border"
                      >
                        <div className="px-3 pt-3 ">
                          <Table borderless className="table-sm ">
                            <tbody className="pb-0">
                              <tr>
                                <td>Reference</td>
                                <td>{task.reference}</td>
                              </tr>
                              <tr>
                                <td>Title</td>
                                <td>{task.name}</td>
                              </tr>
                              <tr>
                                <td>Owner</td>
                                <td>{task?.created?.by?.name}</td>
                              </tr>
                              <tr>
                                <td>Date</td>
                                {/* March 8, 2023 */}
                                <td>
                                  {moment(task.created.on).format(
                                    "MMMM DD, YYYY hh:mm A"
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                        <hr />
                        <div className="px-3 pb-3 d-flex justify-content-between">
                          <div>
                            <DrawerOpener drawerId="edit-task-form">
                              <Button
                                size="sm"
                                outline
                                className=" border-0 rounded"
                                onClick={(e) => {
                                  setTask(task);
                                }}
                              >
                                <i className="ims-icons-20 icon-icon-pencil-24"></i>
                              </Button>
                            </DrawerOpener>
                            <DrawerOpener drawerId="task-detail">
                              <Button
                                size="sm"
                                color="primary"
                                className="border-0 rounded"
                                onClick={(e) => {
                                  setTask(task);
                                }}
                              >
                                <i className="ims-icons-20 icon-icon-eye-24"></i>
                              </Button>
                            </DrawerOpener>
                            <Button
                              size="sm"
                              outline
                              color="danger"
                              className="border-0 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                warningWithConfirmMessage(
                                  "This task will be deleted",
                                  () => {
                                    handleDeleteTask(task._id);
                                  }
                                );
                              }}
                            >
                              <i className="ims-icons-20 icon-icon-trash-24"></i>
                            </Button>
                          </div>
                          <div>
                            <Button
                              size="sm"
                              outline
                              color="primary"
                              className="rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                warningWithConfirmMessage(
                                  "This task will be completed. No one else will be able to amend it later",
                                  () => {
                                    handleCompleteTask(task._id);
                                  }
                                );
                              }}
                            >
                              Complete Task
                            </Button>
                          </div>
                        </div>
                      </PopoverBody>
                    </UncontrolledPopover>
                  </div>
                );
              })}
          </div>

          {/* See More */}
          {todoLists.length > 5 && (
            <div className="d-flex justify-content-end mb-2">
              <Link to="/admin/tasks">See More</Link>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TaskManagement;
