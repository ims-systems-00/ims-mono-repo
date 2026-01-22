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
import { mapToPremiseAssetModel } from "@/services/inventoryServices";
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
const PremiseAssetForm = ({ premise, processing, onSubmit, drawerView }) => {
  let { groups } = useContext(SuperGlobalContext);
  let viewContextData = useContext(ViewContext);
  let { authGlobalAccess } = useAccess();
  let { tagsAndCategories, searchTags } = useTagsAndCategories();
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);
  let dataSet = premise
    ? mapToPremiseAssetModel(premise)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          name: "",
          address: "",
          location: "",
          tagsAndCategories: "",
          cost: 0,
        },
        errors: {},
      };
  // Validation rules ....
  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    name: IVal.string().required().label("Building name"),
    address: IVal.string().required().label("Address"),
    location: IVal.string().required().label("Postal code"),
    tagsAndCategories: IVal.label("Category"),
    cost: IVal.number().required().integer().min(0).label("Cost"),
  };

  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  // submission logic to sever goes here ...

  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  let { data, errors } = dataModel;
  React.useEffect(() => {
    searchTags(searchString);
  }, [debouncedSearchString]);
  return (
    <>
      <Form action="/" className="form-horizontal" onSubmit={handleSubmit}>
        <Row>
          <TourStep data-tour-step="create-premise-form">
            <Col md={drawerView ? "12" : "6"}>
              <ImsInputText
                label="Building name"
                name="name"
                value={data.name}
                mandatory={true}
                onChange={handleChange}
                error={errors.name}
                placeholder="Building name"
              />
            </Col>
            <Col md={drawerView ? "12" : "6"}>
              <ImsInputSelect
                label={authGlobalAccess() ? "Business unit" : "Business unit"}
                name="group"
                value={data.group}
                isDisabled={premise ? true : false}
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
                label="Address"
                mandatory={true}
                name="address"
                value={data.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Address"
              />
            </Col>
            <Col md={drawerView ? "12" : "6"}>
              <ImsInputText
                label="Postal code"
                mandatory={true}
                name="location"
                value={data.location}
                onChange={handleChange}
                error={errors.location}
                placeholder="Postal code"
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
                mandatory={true}
                placeholder="Cost"
                icon="fas fa-pound-sign"
                name="cost"
                value={data.cost}
                onChange={handleChange}
                error={errors.cost}
              />
            </Col>
          </TourStep>
        </Row>
        <ImsButtonGroup>
          {premise ? (
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
                    false
                  )
                }
                disabled={
                  validate()
                    ? true
                    : processing[USER_ACTIONS.UPDATE_PREMISE].status
                }
                className="btn-fill"
                color="info"
                type="button"
              >
                {processing[USER_ACTIONS.UPDATE_PREMISE].status
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
                  : processing[USER_ACTIONS.CREATE_PREMISE].status
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing[USER_ACTIONS.CREATE_PREMISE].status
                ? "Processing..."
                : "Create"}
            </Button>
          )}
        </ImsButtonGroup>
      </Form>
    </>
  );
};

export default PremiseAssetForm;
