import useForm from "@/hooks/useForm";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import IVal from "@/validations/validator";
import { ImsInputDropZone } from "@/views/shared/ImsFormElements/Index";
const AddRevisionForm = ({ onSubmit = () => {} }) => {
  const dataSet = {
    data: {
      storageInfo: null,
    },
    errors: {},
  };

  const schema = {
    storageInfo: IVal.object().label("Storage information"),
  };

  const { dataModel, isBusy, handleSubmit, validate, handleFileChange } =
    useForm(dataSet, schema);
  let { data } = dataModel;
  return (
    <Form>
      <ImsInputDropZone
        label="Revised version"
        name="general"
        onLoad={(files) => {
          if (files.length) {
            handleFileChange(files[0], "storageInfo");
          }
        }}
      />
      <Button
        disabled={validate() ? true : isBusy}
        className="btn-block"
        color="primary"
        size="sm"
        onClick={(e) => {
          handleSubmit(e, () => {
            onSubmit(data);
          });
        }}
      >
        {isBusy ? "... ..." : "Add revision for review"}
      </Button>
    </Form>
  );
};

export default AddRevisionForm;
