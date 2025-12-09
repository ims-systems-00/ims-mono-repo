import useForm from "@/hooks/useForm";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import IVal from "@/validations/validator";
import ImsInputText from "@/views/shared/ImsFormElements/ImsInputText";
const FolderForm = ({ node, onSubmit = function () {} }) => {
  const dataSet = node
    ? {
        data: {
          nodeId: node._id,
          name: node.name,
        },
        errors: {},
      }
    : {
        data: {
          nodeId: null,
          name: "",
        },
        errors: {},
      };
  const schema = {
    nodeId: IVal.label("id"),
    name: IVal.string().required().label("Name"),
  };
  const { dataModel, isBusy, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  return (
    <Form>
      <ImsInputText
        label="Name"
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Name"
      />
      <Button
        className="btn-block"
        color="primary"
        disabled={validate() ? true : isBusy}
        onClick={(e) => {
          handleSubmit(e, () => onSubmit(data));
        }}
      >
        {isBusy ? "... ..." : node ? "Rename folder" : "Create Folder"}
      </Button>
    </Form>
  );
};

export default FolderForm;
