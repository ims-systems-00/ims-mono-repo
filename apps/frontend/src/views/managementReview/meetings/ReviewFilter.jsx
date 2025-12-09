import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Badge,
  Button,
  Col,
  Form,
  ImsInputSelect,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import IVal from "@/validations/validator";
import USER_ACTIONS from "./actions";
import filters from "./filters";
import { useSchedule } from "./store";

const ReviewFilter = ({}) => {
  let { processing, modalFilter, toggleModalFilter, ReviewQueryTools } =
    useSchedule();
  const dataSet = {
    data: {
      status: [],
      attendees: [],
    },
    errors: {},
  };

  const schema = {
    status: IVal.label("Status"),
    attendees: IVal.label("Attendees"),
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
        backdrop={processing[USER_ACTIONS.LOAD_REVIEWS].status ? false : true}
      >
        <ModalHeader toggle={toggleModalFilter}>
          <h3 className="text-dark">Filter</h3>
        </ModalHeader>
        <ModalBody>
          <Form action="/" className="form-horizontal" method="get">
            <p>Filter management review to get specific data</p>
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
                <ImsInputSelect
                  label="Attendees"
                  name="attendees"
                  value={data.attendees}
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
              {dataModel.data.attendees.length > 0 && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">
                    Selected attendees
                  </p>
                  <p>
                    {dataModel.data.attendees.map((owner) => (
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
                        dataModel.data.attendees.length}{" "}
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
                        ReviewQueryTools?.handleFilter({
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

                            attendees: {
                              in: dataModel.data.attendees.map(
                                (owner) => owner.value
                              ),
                            },
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

export default ReviewFilter;
