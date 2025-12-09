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
import { useSupplier } from "./store";

const SupplierFilter = () => {
  let { processing, modalFilter, toggleModalFilter, SupplierQueryTools } =
    useSupplier();
  const dataSet = {
    data: {
      groups: [],
      creators: [],
    },
    errors: {},
  };

  const schema = {
    groups: IVal.label("Groups"),
    creators: IVal.label("Status"),
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
        backdrop={processing[USER_ACTIONS.LOAD_SUPPLIERS].status ? false : true}
      >
        <ModalHeader toggle={toggleModalFilter}>
          <h3 className="text-dark">Filter</h3>
        </ModalHeader>
        <ModalBody>
          <Form action="/" className="form-horizontal" method="get">
            <p>Filter suppliers to get specific data</p>
            <Row className="mt-3">
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
                <ImsInputSelect
                  label="Logged by"
                  name="creators"
                  value={data.creators}
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
              {dataModel.data.creators.length > 0 && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">
                    Selected logged by
                  </p>
                  <p>
                    {dataModel.data.creators.map((owner) => (
                      <Badge color={"primary"}>{owner.label}</Badge>
                    ))}
                  </p>
                </Col>
              )}

              <Col md="12" className="border-top p-3">
                <Row>
                  <Col md="6">
                    <p className="text-secondary">
                      {dataModel.data.groups.length +
                        dataModel.data.creators.length}{" "}
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
                        SupplierQueryTools?.handleFilter({
                          value: {
                            group: {
                              in: dataModel.data.groups.map(
                                (group) => group.value
                              ),
                            },
                            created: {
                              by: dataModel.data.creators.map(
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

export default SupplierFilter;
