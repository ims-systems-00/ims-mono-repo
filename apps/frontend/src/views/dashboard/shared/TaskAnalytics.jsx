import Loading from "@/components/Loader/Loading";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
} from "@ims-systems-00/ims-ui-kit";
import { imsLogger } from "@/services/loggerService";
import { getTopTasks } from "@/services/tasksServices";
import moment from "moment";
import { Link } from "react-router-dom";
import { truncate } from "@/utils/truncate";

const TaskAnalytics = () => {
  let [processing, setProcessing] = React.useState({
    action: "top-tasks",
    error: false,
    id: null,
  });
  let [topTasks, setTopTasks] = React.useState([]);
  let [teamTasks, setTeamTasks] = React.useState([]);
  async function fetchTopTasks() {
    try {
      setProcessing({ action: "top-tasks", error: false, id: null });
      let { data } = await getTopTasks();
      setTopTasks(data.individualTasks);
      setTeamTasks(data.teamTasks);
      setProcessing({ action: null, error: false, id: null });
    } catch (ex) {
      setProcessing({ action: null, error: true, id: null });
      imsLogger("TaskAnalytics", ex, ex.response);
    }
  }
  React.useEffect(() => {
    fetchTopTasks();
  }, []);
  return (
    <>
      {processing.action === "top-tasks" && <Loading />}
      <Row>
        <Col md="12">
          <Card className="shadow">
            <CardHeader>
              <Link to="/admin/tasks" className="module-link">
                My tasks
              </Link>
            </CardHeader>
            <CardBody>
              {topTasks.length ? (
                <Table>
                  <thead className="text-primary">
                    <tr key={"1"}>
                      <th className="">Task name</th>
                      <th>Owner</th>
                      <th className="">Due date</th>
                      <th className="text-right">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTasks.map((task) => (
                      <tr key={task._id}>
                        <td>{truncate(task.name, 13)}</td>
                        <td>{task.created.by && task.created.by.name}</td>
                        <td>{moment(task.due).format("DD/MM/YYYY")}</td>
                        <td className="text-right">
                          {task.priority === "Low" ? (
                            <span className="text-success">
                              {task.priority}
                            </span>
                          ) : task.priority === "Medium" ? (
                            <span className="text-warning">
                              {task.priority}
                            </span>
                          ) : (
                            <span className="text-danger">{task.priority}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Table>
                  <thead className="text-primary">
                    <tr key={"2"}>
                      <th className="">Task name</th>
                      <th>Owner</th>
                      <th className="">Due date</th>
                      <th className="text-right">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="text-primary">No analytics available</td>
                      <td className="text-right"></td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col md="12">
          <Card>
            <CardHeader>
              <Link to="/admin/tasks" className="module-link">
                Team tasks
              </Link>
            </CardHeader>
            <CardBody>
              {teamTasks.length ? (
                <Table>
                  <thead className="text-primary">
                    <tr key={"1"}>
                      <th className="">Task name</th>
                      <th>Owner</th>
                      <th className="">Due date</th>
                      <th className="text-right">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamTasks.map((task) => (
                      <tr key={task._id}>
                        <td>{truncate(task.name, 13)}</td>
                        <td>{task.created.by && task.created.by.name}</td>
                        <td>{moment(task.due).format("DD/MM/YYYY")}</td>
                        <td className="text-right ">
                          {task.priority === "Low" ? (
                            <span className="text-success">
                              {task.priority}
                            </span>
                          ) : task.priority === "Medium" ? (
                            <span className="text-warning">
                              {task.priority}
                            </span>
                          ) : (
                            <span className="text-danger">{task.priority}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Table>
                  <thead className="text-primary">
                    <tr key={"2"}>
                      <th className="">Task name</th>
                      <th>Owner</th>
                      <th className="">Due date</th>
                      <th className="text-right">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="text-primary">No analytics available</td>
                      <td className="text-right "></td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TaskAnalytics;
