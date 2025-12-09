import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { mapToExpenseModel } from "@/services/wallet/expenseReportServices";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
} from "@/views/shared/ImsFormElements/Index";
import USER_ACTIONS from "../actions";
import { useExpenseReport } from "../store";

const ExpenseForm = ({ expense }) => {
  let { users, lazyLoadUsers } = useUsers();
  const dataSet = expense
    ? mapToExpenseModel(expense)
    : {
        data: {
          type: "",
          cost: 0,
          description: "",
          attachments: [],
        },
        errors: {},
      };
  const schema = {
    type: IVal.string().required().label("Type"),
    description: IVal.string().required().label("Description"),
    cost: IVal.number().required().label("Cost"),
    attachments: IVal.label("Attachments"),
  };
  const {
    confirmation,
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
  } = useForm(dataSet, schema);
  let { data, errors } = dataModel;
  let { processing, toggleEditMode, handleAddExpense, handleUpdateExpense } =
    useExpenseReport();
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);
  return (
    <div className="form-horizontal mb-3">
      <ImsInputText
        placeholder="Type"
        name="type"
        mandatory={true}
        value={data.type.value}
        onChange={handleChange}
        error={errors.type}
      />
      <ImsInputText
        label="Description"
        placeholder="Description"
        name="description"
        type="textarea"
        rows="3"
        value={data.description}
        onChange={handleChange}
        error={errors.description}
      />

      <ImsInputText
        label="Cost"
        placeholder="Cost"
        name="cost"
        type="number"
        mandatory={true}
        value={data.cost}
        onChange={handleChange}
        error={errors.cost}
      />
      <ImsInputDropZone
        label="Attachments"
        clearAll={!data.attachments.length}
        name="staffwallet"
        onLoad={(files) => handleFileChange(files, "attachments")}
      />
      <ImsButtonGroup>
        {expense && expense._id ? (
          <>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              disabled={
                validate()
                  ? true
                  : processing[USER_ACTIONS.AMEND_EXPENSE].status
              }
              onClick={(e) => {
                handleSubmit(
                  e,
                  handleUpdateExpense(expense._id, dataModel.data),
                  false
                );
              }}
            >
              {processing[USER_ACTIONS.AMEND_EXPENSE].status &&
              processing[USER_ACTIONS.AMEND_EXPENSE].status.id === expense._id
                ? "Saving..."
                : "Update"}
            </Button>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              type="button"
              onClick={() => toggleEditMode && toggleEditMode()}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            className="btn-simple btn-primary"
            color="primary"
            type="button"
            disabled={
              validate()
                ? true
                : processing[USER_ACTIONS.INCLUDE_EXPENSE].status
            }
            onClick={(e) => handleSubmit(e, handleAddExpense(dataModel.data))}
          >
            {processing[USER_ACTIONS.INCLUDE_EXPENSE].status
              ? "Saving..."
              : "Add"}
          </Button>
        )}
      </ImsButtonGroup>
    </div>
  );
};

export default ExpenseForm;
