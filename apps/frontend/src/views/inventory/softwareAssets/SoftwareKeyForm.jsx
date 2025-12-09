import useForm from "@/hooks/useForm";
import { Button, Form, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { mapToSoftwareKeysModel } from "@/services/inventoryServices";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import USER_ACTIONS from "./actions";

const SoftwareKeyForm = ({
  softwareKey,
  processing,
  onSubmit,
  drawerView,
  onCancel,
}) => {
  const dataSet = softwareKey
    ? mapToSoftwareKeysModel(softwareKey)
    : {
        data: {
          key: "",
        },
        errors: {},
      };

  const schema = {
    key: IVal.string().required().label("Key"),
  };

  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );

  // submission logic to sever goes here ...

  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal mt-5" method="get">
      <ImsInputText
        label={"Add keys"}
        placeholder="Add key"
        name="key"
        value={data.key}
        onChange={handleChange}
        error={errors.key}
      />
      <ImsButtonGroup>
        {softwareKey && softwareKey._id ? (
          <>
            <Button
              size="sm"
              className="btn-simple btn-primary"
              color="primary"
              type="button"
              disabled={
                validate()
                  ? true
                  : processing[USER_ACTIONS.ADD_SOFTWARE_KEY].status
              }
              onClick={(e) => {
                handleSubmit(
                  e,
                  () => {
                    onSubmit && onSubmit(dataModel.data);
                  },
                  false
                );
              }}
            >
              {processing[USER_ACTIONS.ADD_SOFTWARE_KEY] &&
              processing[USER_ACTIONS.ADD_SOFTWARE_KEY].id === softwareKey._id
                ? "Saving..."
                : "Update"}
            </Button>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              type="button"
              onClick={() => onCancel()}
            >
              cancel
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
                : processing[USER_ACTIONS.ADD_SOFTWARE_KEY].status
            }
            onClick={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
          >
            {processing[USER_ACTIONS.ADD_SOFTWARE_KEY].status
              ? "Saving..."
              : "Add"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default SoftwareKeyForm;
