import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useDebounce from "@/hooks/useDebounce";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  Form,
  ImsInputDate,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { mapToHardwareAssetModel } from "@/services/inventoryServices";
import { filterUsersByGroup } from "@/utils/filters";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputTextWithIcon,
} from "@/views/shared/ImsFormElements/Index";
import { useTagsAndCategories } from "@/views/tagsAndCategoriesManager/store";
import USER_ACTIONS from "./actions";
import AddCategory from "@/views/tagsAndCategoriesManager/AddCategory";

const HardwareAssetForm = ({ drawerView, hardware, processing, onSubmit }) => {
  let { tagsAndCategories, searchTags } = useTagsAndCategories();
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);
  const dataSet = hardware
    ? mapToHardwareAssetModel(hardware)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          name: "",
          tag: "",
          owner: {
            value: null,
            label: "Select owner",
          },
          tagsAndCategories: "",
          returnDate: "",
          assignedDate: "",
          destructionDate: "",
          cost: 0,
        },
        errors: {},
      };
  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.string().required().label("Business unit"),
    }),
    name: IVal.string().required().label("Asset name"),
    tag: IVal.string().required().label("Asset Tag "),
    owner: IVal.object().keys({
      value: IVal.string().required().label("Owner"),
      label: IVal.string().required().label("Owner"),
    }),
    tagsAndCategories: IVal.label("Tag and Category"),
    assignedDate: IVal.label("Assigned date"),
    returnDate: IVal.label("Returned date"),
    destructionDate: IVal.label("Destruction date"),
    cost: IVal.number().integer().min(0).label("Cost"),
  };
  let { groups } = useContext(SuperGlobalContext);
  let viewContextData = useContext(ViewContext);
  let { users, lazyLoadUsers } = useUsers();
  let { authGlobalAccess } = useAccess();

  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );

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

  React.useEffect(() => {
    searchTags(searchString);
  }, [debouncedSearchString]);

  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" onSubmit={handleSubmit}>
      <Row>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputText
            label="Asset name"
            name="name"
            mandatory={true}
            value={data.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Asset name"
          />
        </Col>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputSelect
            label={authGlobalAccess() ? "Business unit" : "Business unit"}
            name="group"
            value={data.group}
            isDisabled={hardware ? true : false}
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
            label="Asset tag"
            mandatory={true}
            name="tag"
            value={data.tag}
            onChange={handleChange}
            error={errors.tag}
            placeholder="Asset tag"
          />
        </Col>
        <Col md={drawerView ? "12" : "6"}>
          {" "}
          <ImsInputSelect
            label="Owner"
            mandatory={true}
            name="owner"
            icon="icon-app"
            className="react-select default"
            classNamePrefix="react-select"
            error={errors.owner}
            value={data.owner}
            onChange={handleChange}
            options={users
              .filter((user) =>
                filterUsersByGroup(user.membership, dataModel.data.group.value)
              )
              .map((user) => ({ value: user._id, label: user.name }))}
          />
        </Col>

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

        <Col md={drawerView ? "12" : "6"}>
          <ImsInputDate
            label="Assigned date"
            name="assignedDate"
            value={data.assignedDate}
            onChange={handleChange}
            error={errors.assignedDate}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputDate
            label="Destruction date"
            name="destructionDate"
            value={data.destructionDate}
            onChange={handleChange}
            error={errors.destructionDate}
          />
        </Col>

        <Col md={drawerView ? "12" : "6"}>
          <ImsInputDate
            label="Returned date"
            name="returnDate"
            value={data.returnDate}
            onChange={handleChange}
            error={errors.returnDate}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputTextWithIcon
            label="Cost"
            type="number"
            placeholder="Cost"
            icon="fas fa-pound-sign"
            name="cost"
            value={data.cost}
            onChange={handleChange}
            error={errors.cost}
          />
        </Col>
      </Row>
      <ImsButtonGroup>
        {hardware ? (
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
              onClick={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
              disabled={
                validate()
                  ? true
                  : processing[USER_ACTIONS.UPDATE_HARDWARE].status
              }
              className="btn-fill"
              color="info"
              type="button"
            >
              {processing[USER_ACTIONS.UPDATE_HARDWARE].status
                ? "Processing..."
                : "Update"}
            </Button>
          </>
        ) : (
          <Button
            name="create"
            onClick={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
            disabled={
              validate()
                ? true
                : processing[USER_ACTIONS.CREATE_HARDWARE].status
            }
            className="btn-fill"
            color="primary"
            type="button"
          >
            {processing[USER_ACTIONS.CREATE_HARDWARE].status
              ? "Processing..."
              : "Create"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default HardwareAssetForm;
