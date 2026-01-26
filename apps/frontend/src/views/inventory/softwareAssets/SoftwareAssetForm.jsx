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
import { mapToSoftwareAssetModel } from "@/services/inventoryServices";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
  ImsInputTextWithIcon,
} from "@/views/shared/ImsFormElements/Index";
import USER_ACTIONS from "./actions";
import { useSoftwareAssets } from "./store";
import useDebounce from "@/hooks/useDebounce";
import { useTagsAndCategories } from "@/views/tagsAndCategoriesManager/store";
import AddCategory from "@/views/tagsAndCategoriesManager/AddCategory";
import { TourStep } from "../../../components/Tour";

// default dataSet for form fields

const SoftwareAssetForm = ({ drawerView, software, processing, onSubmit }) => {
  const { searchTags, tagsAndCategories } = useTagsAndCategories();
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);
  const dataSet = software
    ? mapToSoftwareAssetModel(software)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          name: "",
          tagsAndCategories: "",
          numberOfLicenses: 0,
          numberOfInstalls: 0,
          cost: 0,
          docs: [],
        },
        errors: {},
      };

  // Validation rules ....
  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    name: IVal.string().required().label("Software name"),
    numberOfLicenses: IVal.number()
      .integer()
      .min(0)
      .label("Number Of licenses"),
    numberOfInstalls: IVal.number()
      .integer()
      .min(0)
      .label("Number Of installs"),
    cost: IVal.number().integer().min(0).label("Cost"),
    docs: IVal.label("Documents"),
    tagsAndCategories: IVal.label("Category"),
  };

  let { groups } = useContext(SuperGlobalContext);
  let viewContextData = useContext(ViewContext);
  let { authGlobalAccess } = useAccess();
  const { dataModel, handleChange, handleSubmit, validate, handleFileChange } =
    useForm(dataSet, schema);

  // submission logic to sever goes here ...

  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  let { data, errors } = dataModel;

  React.useEffect(() => {
    searchTags(searchString);
  }, [debouncedSearchString]);

  return (
    <Form action="/" className="form-horizontal">
      <TourStep stepId="create-software-asset-form">
        <Row>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Software name"
              mandatory={true}
              name="name"
              value={data.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Software name"
            />
          </Col>

          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              label={authGlobalAccess() ? "Business unit" : "Business unit"}
              name="group"
              isDisabled={software ? true : false}
              value={data.group}
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
          <TourStep stepId="create-software-asset-licenses">
            <Col md={drawerView ? "12" : "6"}>
              <ImsInputText
                label="Number of licences"
                name="numberOfLicenses"
                value={data.numberOfLicenses}
                onChange={handleChange}
                error={errors.numberOfLicenses}
              />
            </Col>
            <Col md={drawerView ? "12" : "6"}>
              <ImsInputText
                label="Number of installs"
                name="numberOfInstalls"
                value={data.numberOfInstalls}
                onChange={handleChange}
                error={errors.numberOfInstalls}
              />
            </Col>
          </TourStep>
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
        <ImsInputDropZone
          label="Documents"
          clearAll={!data.docs.length}
          name="inventory_software_attachments"
          onLoad={(files) => handleFileChange(files, "docs")}
        />
      </TourStep>
      <ImsButtonGroup>
        {software ? (
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
                  : processing[USER_ACTIONS.UPDATE_SOFTWARE].status
              }
              className="btn-fill"
              color="info"
              type="button"
            >
              {processing[USER_ACTIONS.UPDATE_SOFTWARE].status
                ? "Processing..."
                : "Update"}
            </Button>
          </>
        ) : (
          <TourStep stepId="create-software-form-button">
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
                  : processing[USER_ACTIONS.CREATE_SOFTWARE].status
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing[USER_ACTIONS.CREATE_SOFTWARE].status
                ? "Processing..."
                : "Create"}
            </Button>
          </TourStep>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default SoftwareAssetForm;
