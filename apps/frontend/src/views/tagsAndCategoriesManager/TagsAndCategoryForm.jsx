import useForm from "@/hooks/useForm";
import React from "react";
import IVal from "@/validations/validator";
import { mapToTagsAndCategoryModel } from "@/services/tagsAndCategories";
import {
  Button,
  Form,
  ImsInputSelect,
  ImsInputText,
} from "@ims-systems-00/ims-ui-kit";
import NotificationContext from "@/contexts/notificationContext";
import tagsModules from "./applicableModules";

const TagsAndCategoryForm = ({
  visitingTagAndCategory,
  onSubmit = () => {},
}) => {
  const dataSet = visitingTagAndCategory
    ? mapToTagsAndCategoryModel(visitingTagAndCategory)
    : {
        data: {
          applicableModules: [],
          name: "",
          description: "",
        },
        errors: {},
      };
  const schema = {
    name: IVal.string().required().label("Name"),
    description: IVal.string().required().label("Description"),
    applicableModules: IVal.array().min(1).label("Applicable Modules"),
  };
  let notify = React.useContext(NotificationContext);
  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema
  );

  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      <ImsInputText
        label="Name"
        name="name"
        placeholder="Name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
      />
      <ImsInputText
        label="Description"
        name="description"
        type="textarea"
        value={data.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Description"
      />
      <ImsInputSelect
        label={"Applicable modules"}
        name="applicableModules"
        isMulti
        value={data.applicableModules}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={tagsModules.map((tag) => ({
          value: tag.value,
          label: tag.label,
        }))}
      />
      {!visitingTagAndCategory ? (
        <Button
          onClick={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
          name="create"
          disabled={validate() ? true : isBusy}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {isBusy ? "Processing" : "Add"}
        </Button>
      ) : (
        <>
          <Button
            name="update"
            onClick={(e) =>
              handleSubmit(e, () => onSubmit(dataModel.data), false)
            }
            disabled={validate() ? true : isBusy}
            className="btn-fill"
            color="primary"
            type="button"
          >
            {isBusy ? "Processing" : "Update"}
          </Button>
        </>
      )}
    </Form>
  );
};

export default TagsAndCategoryForm;
