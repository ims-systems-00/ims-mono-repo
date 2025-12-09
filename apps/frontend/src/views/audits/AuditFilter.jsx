import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import IVal from "@/validations/validator";
import { ImsInputCheck } from "@/views/shared/ImsFormElements/Index";
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
import USER_ACTIONS from "./actions";
import filters from "./filters";
import { useAudits } from "./store";

const AuditFilter = ({}) => {
  let { processing, modalFilter, toggleModalFilter, AuditQueryTools } =
    useAudits();
  const dataSet = {
    data: {
      status: [],
      groups: [],
      auditors: [],
      date: "",
      showUpcoming: false,
    },
    errors: {},
  };

  const schema = {
    status: IVal.label("Status"),
    groups: IVal.label("Groups"),
    auditors: IVal.label("Status"),
    date: IVal.label("Date"),
    showUpcoming: IVal.boolean().label("Show upcoming"),
  };

  const { dataModel, handleChange, handleSubmit } = useForm(dataSet, schema);

  const { groups } = useContext(SuperGlobalContext);
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
        backdrop={processing[USER_ACTIONS.LOAD_AUDITS].status ? false : true}
      >
        <ModalHeader toggle={toggleModalFilter}>
          <h3 className="text-dark">Filter</h3>
        </ModalHeader>
        <ModalBody>
          <Form action="/" className="form-horizontal" method="get">
            <p>Filter audits to get specific data</p>
            <Row className="mt-3">
              <Col md="12">
                <ImsInputCheck
                  label="Upcoming audits"
                  name="showUpcoming"
                  value={data.showUpcoming}
                  checked={data.showUpcoming}
                  onChange={handleChange}
                  error={errors.showUpcoming}
                />
              </Col>
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
                <ImsInputSelect
                  label={"Business unit"}
                  name="groups"
                  value={data.groups}
                  isMulti
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={groups.map((group) => ({
                    value: group._id,
                    label: group.name,
                  }))}
                />
              </Col>
              <Col md={"12"}>
                <ImsInputDate
                  label="Schedule before"
                  name="date"
                  value={data.date}
                  onChange={handleChange}
                  error={errors.date}
                />
              </Col>
              <Col md={"12"}>
                <ImsInputSelect
                  label="Auditors"
                  name="auditors"
                  value={data.auditors}
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
              {dataModel.data.groups.length > 0 && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">
                    Selected business units
                  </p>
                  <p>
                    {dataModel.data.groups.map((group) => (
                      <Badge color={"primary"}>{group.label}</Badge>
                    ))}
                  </p>
                </Col>
              )}
              {dataModel.data.auditors.length > 0 && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">
                    Selected auditors
                  </p>
                  <p>
                    {dataModel.data.auditors.map((owner) => (
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
                        dataModel.data.groups.length +
                        dataModel.data.auditors.length}{" "}
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
                        AuditQueryTools?.handleFilter({
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
                            group: {
                              in: dataModel.data.groups.map(
                                (group) => group.value
                              ),
                            },
                            auditor: {
                              in: dataModel.data.auditors.map(
                                (owner) => owner.value
                              ),
                            },
                            ...(dataModel.data.date
                              ? {
                                  startDate: {
                                    lte: new Date(
                                      moment(dataModel.data.date, "DD/MM/YYYY")
                                    ).toISOString(),
                                  },
                                }
                              : {}),
                            ...(dataModel.data.showUpcoming
                              ? {
                                  completed: { status: false },
                                  sort: "startDate",
                                  startDate: {
                                    gte: new Date().toISOString(),
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

export default AuditFilter;
