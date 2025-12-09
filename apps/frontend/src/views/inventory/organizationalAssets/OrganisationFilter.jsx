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
import { useOrganizationAssets } from "./store";

const OrganisationFilter = () => {
  let { processing, modalFilter, toggleModalFilter, OrganizationQueryTools } =
    useOrganizationAssets();
  const dataSet = {
    data: {
      groups: [],
      owners: [],
      categories: [],
    },
    errors: {},
  };

  const schema = {
    groups: IVal.label("Status"),
    owners: IVal.label("Status"),
    categories: IVal.label("Status"),
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
        <i class="ims-icons icon-icon-funnelsimple-24 me-1 p-0" />
        Filter
      </Button>
      <Modal
        isOpen={modalFilter}
        toggle={toggleModalFilter}
        style={{ width: "600px" }}
        backdrop={
          processing[USER_ACTIONS.LOAD_ORGANIZATIONS].status ? false : true
        }
      >
        <ModalHeader toggle={toggleModalFilter}>
          <h3 className="text-dark">Filter</h3>
        </ModalHeader>
        <ModalBody>
          <Form action="/" className="form-horizontal" method="get">
            <p>Filter risks to get specific data</p>
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
                  label="Owned by"
                  name="owners"
                  value={data.owners}
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
                  options={tagsAndCategories.map((tag) => ({
                    value: tag._id,
                    label: tag.name,
                  }))}
                  label={"Category"}
                  className="react-select default"
                  classNamePrefix="react-select"
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
              {dataModel.data.owners.length > 0 && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">Selected owners</p>
                  <p>
                    {dataModel.data.owners.map((owner) => (
                      <Badge color={"primary"}>{owner.label}</Badge>
                    ))}
                  </p>
                </Col>
              )}
              {dataModel.data.categories.length > 0 && (
                <Col md="12">
                  <p className="font-weight-bold text-dark">
                    Selected categories
                  </p>
                  <p>
                    {dataModel.data.categories.map((category) => (
                      <Badge color={"primary"}>{category.label}</Badge>
                    ))}
                  </p>
                </Col>
              )}

              <Col md="12" className="border-top p-3">
                <Row>
                  <Col md="6">
                    <p className="text-secondary">
                      {dataModel.data.groups.length +
                        dataModel.data.owners.length +
                        dataModel.data.categories.length}{" "}
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
                        OrganizationQueryTools?.handleFilter({
                          value: {
                            group: {
                              in: dataModel.data.groups.map(
                                (group) => group.value
                              ),
                            },
                            owner: {
                              in: dataModel.data.owners.map(
                                (owner) => owner.value
                              ),
                            },
                            tagsAndCategories: {
                              in: dataModel.data.categories.map(
                                (category) => category.value
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

export default OrganisationFilter;
