import useForm from "@/hooks/useForm";
import { Button, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import IVal from "@/validations/validator";

const DeleteForm = ({ user, onSubmit = () => {} }) => {
  const dataSet = {
    data: {
      deleteMessage: "",
    },
    errors: {},
  };
  const schema = {
    deleteMessage: IVal.string()
      .required()
      .valid("delete")
      .label("Target user"),
  };
  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  return (
    <div className="form-horizontal mt-3">
      <div className="border-bottom border-danger pb-1 mb-2">
        <h4 className="text-danger">
          <i className="fa-solid fa-skull"></i> Danger zone
        </h4>
      </div>
      <ImsInputText
        placeholder="i.e. 'delete'"
        label={`Type delete to confirm removal of ${user.name} from the system.`}
        name="deleteMessage"
        value={data.deleteMessage}
        onChange={handleChange}
      />
      <Button
        block
        name="confirm"
        className="btn-danger"
        color="primary"
        type="button"
        disabled={validate() ? true : isBusy}
        onClick={(e) => handleSubmit(e, () => onSubmit(data), false)}
      >
        {isBusy ? "Deleting data..." : "Confirm"}
      </Button>
    </div>
  );
};

export default DeleteForm;
