import React from "react";
import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  Form,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { mapToPeopleAssetModel } from "@/services/inventoryServices";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import USER_ACTIONS from "./actions";
import { useTagsAndCategories } from "@/views/tagsAndCategoriesManager/store";
import useDebounce from "@/hooks/useDebounce";
import AddCategory from "@/views/tagsAndCategoriesManager/AddCategory";
import { TourStep } from "../../../components/Tour";

const PeopleAssetForm = ({ people, processing, drawerView, onSubmit }) => {
  let { groups } = useContext(SuperGlobalContext);
  let viewContextData = useContext(ViewContext);
  let { authGlobalAccess } = useAccess();
  let { tagsAndCategories, searchTags } = useTagsAndCategories();
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  const dataSet = people
    ? mapToPeopleAssetModel(people)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          name: "",
          role: "",
          tagsAndCategories: "",
          responsibility: "",
          skill: "",
        },
        errors: {},
      };

  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    name: IVal.string().label("Staff name"),
    role: IVal.string().label("Role"),
    responsibility: IVal.string().label("Responsibility"),
    skill: IVal.string().label("Skill"),
    tagsAndCategories: IVal.label("Category"),
  };

  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema,
  );

  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  let { data, errors } = dataModel;

  React.useEffect(() => {
    searchTags(searchString);
  }, [debouncedSearchString]);

  return (
    <Form action="/" className="form-horizontal" onSubmit={handleSubmit}>
      <TourStep stepId="create-people-form">
        <Row>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Staff name"
              name="name"
              value={data.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Staff name"
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              label={authGlobalAccess() ? "Business unit" : "Business unit"}
              name="group"
              value={data.group}
              isDisabled={people ? true : false}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={groups.map((group) => ({
                value: group._id,
                label: group.name,
              }))}
            />
          </Col>
        </Row>
        <ImsInputText
          label="Role"
          name="role"
          value={data.role}
          onChange={handleChange}
          error={errors.role}
          placeholder="Role"
        />
        <ImsInputText
          label="Responsibility"
          name="responsibility"
          value={data.responsibility}
          onChange={handleChange}
          error={errors.responsibility}
          placeholder="Responsibility"
        />
        <ImsInputText
          label="Skill"
          name="skill"
          value={data.skill}
          onChange={handleChange}
          error={errors.skill}
          placeholder="Skill"
        />
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
      </TourStep>
      <ImsButtonGroup>
        {people ? (
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
                  : processing[USER_ACTIONS.UPDATE_PEOPLE].status
              }
              className="btn-fill"
              color="info"
              type="button"
            >
              {processing[USER_ACTIONS.UPDATE_PEOPLE].status
                ? "Processing..."
                : "Update"}
            </Button>
          </>
        ) : (
          <TourStep stepId="people-create">
            <Button
              name="create"
              onClick={(e) =>
                handleSubmit(e, () => {
                  onSubmit(dataModel.data);
                })
              }
              disabled={
                validate()
                  ? true
                  : processing[USER_ACTIONS.CREATE_PEOPLE].status
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing[USER_ACTIONS.CREATE_PEOPLE].status
                ? "Processing..."
                : "Create"}
            </Button>
          </TourStep>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default PeopleAssetForm;
