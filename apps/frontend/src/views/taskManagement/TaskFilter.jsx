import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Badge,
  Button,
  Col,
  Form,
  ImsInputDate,
  ImsInputSelect,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useContext } from "react";
import IVal from "@/validations/validator";
import USER_ACTIONS from "./actions";
import filters from "./filters";
import { useTask } from "./store";

const TaskFilter = ({}) => {
  let { processing, modalFilter, toggleModalFilter, TaskQueryTools } =
    useTask();
  const dataSet = {
    data: {
      status: [],
      priority: [],
      assignee: [],
      dueBefore: "",
    },
    errors: {},
  };

  const schema = {
    status: IVal.label("Status"),
    priority: IVal.label("Groups"),
    assignee: IVal.label("Status"),
    dueBefore: IVal.label("Creation before"),
  };

  const { dataModel, handleChange, handleSubmit } = useForm(dataSet, schema);

  const { priority } = useContext(SuperGlobalContext);
  let { users, lazyLoadUsers } = useUsers();
  let { data, errors } = dataModel;

  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  return (
    <React.Fragment>
      <Button
        color="secondary"
        outline
        size="md"
        className="shadow-sm--hover"
        onClick={toggleModalFilter}
      >
        <i class="ims-icons icon-icon-funnelsimple-24 me-1 p-0" />
        Filter
      </Button>
      <Modal
        isOpen={modalFilter}
        toggle={toggleModalFilter}
        style={{ width: "600px" }}
        backdrop={processing[USER_ACTIONS.LOAD_TASKS].status ? false : true}
      >
        <ModalHeader toggle={toggleModalFilter}>
          <h3 className="text-dark">Filter</h3>
        </ModalHeader>
        <ModalBody>
          <Form action="/" className="form-horizontal" method="get">
            <p>Filter tasks to get specific data</p>
            <Row className="mt-3">
              <Col md={"12"}>
                <ImsInputSelect
                  label={"Status"}
                  name="status"
                  value={data.status}
                  isMulti
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={filters.map((filter) => ({
                    value: filter.value,
                    label: filter.label,
                  }))}
                />
              </Col>
              <Col md={"12"}>
                <ImsInputDate
                  label="Due before"
                  name="dueBefore"
                  value={data.dueBefore}
                  onChange={handleChange}
                  error={errors.dueBefore}
                />
              </Col>
              <Col md={"12"}>
                <ImsInputSelect
                  label={"Priority"}
                  name="priority"
                  value={data.priority}
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={["High", "Medium", "Low"].map((priority) => ({
                    value: priority,
                    label: priority,
                  }))}
                />
              </Col>
              <Col md={"12"}>
                <ImsInputSelect
                  label="Assignee"
                  name="assignee"
                  value={data.assignee}
                  isMulti
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={users.map((user) => ({
                    value: user._id,
                    label: user.name,
                  }))}
                />
              </Col>
              {dataModel.data.status.length > 0 && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">Selected status</p>
                  <p>
                    {dataModel.data.status.map((status) => (
                      <Badge color={"primary"}>{status.label}</Badge>
                    ))}
                  </p>
                </Col>
              )}
              {dataModel.data.priority.value && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">
                    Selected priority
                  </p>
                  <p>
                    <Badge color={"primary"}>
                      {dataModel.data.priority.label}
                    </Badge>
                  </p>
                </Col>
              )}
              {dataModel.data.assignee.length > 0 && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">
                    Selected assignee
                  </p>
                  <p>
                    {dataModel.data.assignee.map((owner) => (
                      <Badge color={"primary"}>{owner.label}</Badge>
                    ))}
                  </p>
                </Col>
              )}

              <Col md="12" className="border-top p-3">
                <Row>
                  <Col md="6">
                    <p className="text-secondary">
                      {dataModel.data.status.length +
                        dataModel.data.assignee.length}{" "}
                      items selected
                    </p>
                  </Col>
                  <Col
                    md="6"
                    className="d-flex justify-content-lg-end justify-content-md-end"
                  >
                    <Button
                      color="secondary"
                      outline
                      size="sm"
                      onClick={(e) => {
                        handleSubmit(e, () => {}, true);
                      }}
                      className="shadow-sm--hover"
                    >
                      Clear all
                    </Button>

                    <Button
                      color="primary"
                      size="sm"
                      className="shadow-sm--hover"
                      onClick={() => {
                        TaskQueryTools?.handleFilter({
                          value: {
                            ...dataModel.data.status
                              .map((status) => status.value)
                              .reduce((accumulator, currentValue) => {
                                accumulator = {
                                  ...accumulator,
                                  ...currentValue,
                                };
                                return accumulator;
                              }, {}),
                            // applicableModules:{
                            //   in:dataModel.data.app
                            // },
                            priority: dataModel.data.priority.value,
                            assignedTo: {
                              user: {
                                in: dataModel.data.assignee.map(
                                  (owner) => owner.value
                                ),
                              },
                            },
                            ...(dataModel.data.dueBefore
                              ? {
                                  due: {
                                    lte: new Date(
                                      moment(
                                        dataModel.data.dueBefore,
                                        "DD/MM/YYYY"
                                      )
                                    ).toISOString(),
                                  },
                                }
                              : {}),
                          },
                        });
                      }}
                    >
                      Apply filter
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default TaskFilter;
