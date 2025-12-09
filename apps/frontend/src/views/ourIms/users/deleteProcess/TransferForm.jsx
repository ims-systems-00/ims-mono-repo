import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, ImsInputSelect } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import IVal from "@/validations/validator";

const TransferForm = ({ user, onSubmit = () => {} }) => {
  const dataSet = {
    data: {
      destinationUser: {
        value: null,
        label: "Select owner",
      },
    },
    errors: {},
  };
  const schema = {
    destinationUser: IVal.object().keys({
      value: IVal.string().required().label("Target user"),
      label: IVal.label("Target user"),
    }),
  };
  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema
  );
  const { users, lazyLoadUsers } = useUsers();
  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);
  let { data, errors } = dataModel;
  return (
    <div className="form-horizontal">
      <ImsInputSelect
        placeholder="Select a user"
        label="Trasfer to"
        name="destinationUser"
        value={data.destinationUser}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={users
          /**
           * user who is going to be transfered also have to be a member of BU
           */
          .filter((u) => u._id !== user?._id)
          .map((user) => ({ value: user._id, label: user.name }))}
      />
      <Button
        block
        name="confirm"
        className="btn-primary"
        color="primary"
        type="button"
        disabled={validate() ? true : isBusy}
        onClick={(e) => handleSubmit(e, () => onSubmit(data), false)}
      >
        {isBusy ? "Transfering data..." : "Confirm"}
      </Button>
    </div>
  );
};

export default TransferForm;
