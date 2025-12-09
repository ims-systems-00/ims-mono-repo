import useForm from "@/hooks/useForm";
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
import React from "react";
import IVal from "@/validations/validator";
import { useISO20000 } from "./store";
import filters from "./iso20000Sections";
import USER_ACTIONS from "./actions";

const Iso20000Filter = ({}) => {
  let { processing, modalFilter, toggleModalFilter, Iso20000QueryTools } =
    useISO20000();
  const dataSet = {
    data: {
      status: [],
      selectedStatus: "",
      implementedStatus: "",
    },
    errors: {},
  };
  const schema = {
    status: IVal.label("Status"),
    selectedStatus: IVal.label("Selected"),
    implementedStatus: IVal.label("implemented"),
  };
  const { dataModel, handleChange, handleSubmit } = useForm(dataSet, schema);

  let { data, errors } = dataModel;

  return (
    <>
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
        backdrop={
          processing[USER_ACTIONS.LOAD_COMPLIANCE_20000].status ? false : true
        }
      >
        <ModalHeader toggle={toggleModalFilter}>
          <h3 className="text-dark">Filter</h3>
        </ModalHeader>
        <ModalBody>
          <Form action="/" className="form-horizontal" method="get">
            <p>Filter ISO 20000 to get specific data</p>
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
              {/* <Col md={"12"}>
                <ImsInputSelect
                  label={"Selected status"}
                  name="selectedStatus"
                  value={data.selectedStatus}
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={["Selected", "Not selected"].map((stat) => ({
                    value: stat,
                    label: stat,
                  }))}
                />
              </Col>

              <Col md={"12"}>
                <ImsInputSelect
                  label="Implement status"
                  name="implementedStatus"
                  value={data.implementedStatus}
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={["Implemented", "Not implemented"].map((stat) => ({
                    value: stat,
                    label: stat,
                  }))}
                />
              </Col> */}
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
              {dataModel.data.selectedStatus.value && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">Is selected</p>
                  <p>
                    <Badge color={"primary"}>
                      {dataModel.data.selectedStatus.value}
                    </Badge>
                  </p>
                </Col>
              )}
              {dataModel.data.implementedStatus.value && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">Is implemented</p>
                  <p>
                    <Badge color={"primary"}>
                      {dataModel.data.implementedStatus.value}
                    </Badge>
                  </p>
                </Col>
              )}

              <Col md="12" className="border-top p-3">
                <Row>
                  <Col md="6"></Col>
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
                        Iso20000QueryTools?.handleFilter({
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

                            // ...(dataModel.data.selectedStatus.value && {
                            //   selected: dataModel.data.selectedStatus.value,
                            // }),
                            // ...(dataModel.data.implementedStatus.value && {
                            //   state: dataModel.data.implementedStatus.value,
                            // }),
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
    </>
  );
};

export default Iso20000Filter;
