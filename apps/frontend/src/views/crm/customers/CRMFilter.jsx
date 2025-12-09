import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useDebounce from "@/hooks/useDebounce";
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
import { useTagsAndCategories } from "@/views/tagsAndCategoriesManager/store";
import USER_ACTIONS from "./actions";
import filters from "./filters";
import { useCRM } from "./store";

const CRMFilter = ({}) => {
  let { processing, modalFilter, toggleModalFilter, CustomerQueryTools } =
    useCRM();

  const dataSet = {
    data: {
      status: [],
      groups: [],
      accountManagers: [],
      categories: [],
    },
    errors: {},
  };

  const schema = {
    status: IVal.label("Status"),
    groups: IVal.label("Groups"),
    accountManagers: IVal.label("Account managers"),
    categories: IVal.label("Account managers"),
  };

  const { dataModel, handleChange, handleSubmit } = useForm(dataSet, schema);

  const { groups } = useContext(SuperGlobalContext);
  let { users, lazyLoadUsers } = useUsers();
  let { data, errors } = dataModel;

  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  let { tagsAndCategories, searchTags } = useTagsAndCategories();
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  React.useEffect(() => {
    searchTags(searchString);
  }, [debouncedSearchString]);

  return (
    <React.Fragment>
      <Button
        color="secondary"
        outline
        size="md"
        className="shadow-sm--hover"
        onClick={toggleModalFilter}
      >
        <i class="ims-icons icon-icon-funnelsimple-24 me-1 p-0" /> Filter
      </Button>
      <Modal
        isOpen={modalFilter}
        toggle={toggleModalFilter}
        style={{ width: "600px" }}
        backdrop={processing[USER_ACTIONS.LOAD_CUSTOMERS].status ? false : true}
      >
        <ModalHeader toggle={toggleModalFilter}>
          <h3 className="text-dark">Filter</h3>
        </ModalHeader>
        <ModalBody>
          <Form action="/" className="form-horizontal" method="get">
            <p>Filter customers to get specific data</p>
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
                  label="Account Managers"
                  name="accountManagers"
                  value={data.accountManagers}
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
              <Col xl={"12"} xs="12">
                <ImsInputSelect
                  name="categories"
                  value={data.categories}
                  vertical={true}
                  isMulti
                  onChange={handleChange}
                  onInputChange={setSearchString}
                  options={[
                    {
                      value: null,
                      label: "Not selected",
                    },
                    ...tagsAndCategories.map((tag) => ({
                      value: tag._id,
                      label: tag.name,
                    })),
                  ]}
                  label={"Category"}
                  className="react-select default"
                  classNamePrefix="react-select"
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
              {dataModel.data.accountManagers.length > 0 && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">Selected owners</p>
                  <p>
                    {dataModel.data.accountManagers.map((owner) => (
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
                        dataModel.data.accountManagers.length}{" "}
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
                        CustomerQueryTools?.handleFilter({
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
                            accountManager: {
                              in: dataModel.data.accountManagers.map(
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

export default CRMFilter;
