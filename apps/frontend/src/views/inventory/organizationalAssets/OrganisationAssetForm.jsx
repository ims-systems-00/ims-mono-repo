import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  Form,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { mapToInformationAssetModel } from "@/services/inventoryServices";
import { filterUsersByGroup } from "@/utils/filters";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputTextWithIcon,
} from "@/views/shared/ImsFormElements/Index";
import USER_ACTIONS from "./actions";
import { useTagsAndCategories } from "@/views/tagsAndCategoriesManager/store";
import useDebounce from "@/hooks/useDebounce";
import AddCategory from "@/views/tagsAndCategoriesManager/AddCategory";
import { TourStep } from "../../../components/Tour";
const OrganizationAssetForm = ({
  organization,
  processing,
  onSubmit,
  drawerView,
}) => {
  let { groups } = useContext(SuperGlobalContext);
  let viewContextData = useContext(ViewContext);
  let { users, lazyLoadUsers } = useUsers();
  let { authGlobalAccess } = useAccess();
  let { tagsAndCategories, searchTags } = useTagsAndCategories();
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const dataSet = organization
    ? mapToInformationAssetModel(organization)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          informationInventory: "",
          title: "",
          format: "",
          storageLocation: "",
          link: "",
          tagsAndCategories: "",
          owner: {
            value: null,
            label: "Select owner",
          },
          cost: 0,
        },
        errors: {},
      };

  // Validation rules ....
  const validationSchema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    informationInventory: IVal.string().label("Information inventory"),
    title: IVal.string().label("Title"),
    owner: IVal.object().keys({
      value: IVal.string().required().label("Owner"),
      label: IVal.label("Owner"),
    }),
    tagsAndCategories: IVal.label("Category"),
    format: IVal.string().label("Format"),
    storageLocation: IVal.string().label("Storage location"),
    link: IVal.string().label("Link"),
    cost: IVal.number().integer().min(0).label("Cost"),
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    validationSchema,
  );

  // submission logic to sever goes here ...

  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);

  let { data, errors } = dataModel;
  React.useEffect(() => {
    searchTags(searchString);
  }, [debouncedSearchString]);
  return (
    <Form
      action="/"
      className="form-horizontal"
      onSubmit={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
    >
      <TourStep stepId="create-information-form">
        <Row>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Title"
              name="title"
              mandatory
              value={data.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Title"
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              label={authGlobalAccess() ? "Business unit" : "Business unit"}
              name="group"
              value={data.group}
              isDisabled={organization ? true : false}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={groups.map((group) => ({
                value: group._id,
                label: group.name,
              }))}
            />
          </Col>

          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Information inventory"
              name="informationInventory"
              mandatory
              value={data.informationInventory}
              onChange={handleChange}
              error={errors.informationInventory}
              placeholder="e.g. Employee Records, Marketing Campaigns..."
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Format"
              name="format"
              mandatory
              value={data.format}
              onChange={handleChange}
              error={errors.format}
              placeholder="Format"
            />
          </Col>

          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Storage location"
              name="storageLocation"
              mandatory
              value={data.storageLocation}
              onChange={handleChange}
              error={errors.storageLocation}
              placeholder="Storage location"
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Link"
              name="link"
              mandatory
              value={data.link}
              onChange={handleChange}
              error={errors.link}
              placeholder="Link"
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              label="Owner"
              name="owner"
              mandatory={true}
              icon="icon-app"
              value={data.owner}
              className="react-select default"
              classNamePrefix="react-select"
              error={errors.owner}
              onChange={handleChange}
              options={users
                .filter((user) =>
                  filterUsersByGroup(
                    user.membership,
                    dataModel.data.group.value,
                  ),
                )
                .map((user) => ({ value: user._id, label: user.name }))}
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              name="tagsAndCategories"
              value={data.tagsAndCategories}
              vertical={true}
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
              sideBtn={<AddCategory />}
              className="react-select default"
              classNamePrefix="react-select"
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputTextWithIcon
              label="Cost"
              type="number"
              mandatory
              placeholder="Cost"
              icon="fas fa-pound-sign"
              name="cost"
              value={data.cost}
              onChange={handleChange}
              error={errors.cost}
            />
          </Col>
        </Row>
      </TourStep>
      <ImsButtonGroup>
        {organization ? (
          <>
            {!drawerView && (
              <Button
                name="cancel"
                className="btn-fill"
                color="danger"
                type="button"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            )}
            <Button
              name="update"
              onClick={(e) =>
                handleSubmit(
                  e,
                  () => {
                    onSubmit(dataModel.data);
                  },
                  false,
                )
              }
              disabled={
                validate()
                  ? true
                  : processing[USER_ACTIONS.UPDATE_ORGANIZATION].status
              }
              className="btn-fill"
              color="info"
              type="button"
            >
              {processing[USER_ACTIONS.UPDATE_ORGANIZATION].status
                ? "Processing..."
                : "Update"}
            </Button>
          </>
        ) : (
          <TourStep stepId={"create-information-form-button"}>
            <Button
              name="create"
              onClick={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
              disabled={
                validate()
                  ? true
                  : processing[USER_ACTIONS.CREATE_ORGANIZATION].status
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing[USER_ACTIONS.CREATE_ORGANIZATION].status
                ? "Processing..."
                : "Create"}
            </Button>
          </TourStep>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default OrganizationAssetForm;
