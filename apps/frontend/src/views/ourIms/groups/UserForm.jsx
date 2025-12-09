import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import { addUserToGroup } from "@/services/userServices";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputSelect,
} from "@/views/shared/ImsFormElements/Index";
import LOADERS from "./LoadingActions";
import { filterUsersByGroup } from "@/utils/filters";
const UserForm = ({
  group,
  addToMembersTable,
  processing,
  dispatch,
  reload,
}) => {
  let { users, lazyLoadUsers } = useUsers();
  let notify = React.useContext(NotificationContext);
  let dataSet = {
    data: {
      group: {
        value: group._id,
        label: group.name,
      },
      user: {
        value: null,
        label: "Select user",
      },
    },
    errors: {},
  };

  const schema = {
    group: IVal.object().keys({
      value: IVal.string().required().label("Group"),
      label: IVal.label("Group"),
    }),
    user: IVal.object().keys({
      value: IVal.string().required().label("User"),
      label: IVal.label("User"),
    }),
  };

  let doSubmit = async () => {
    try {
      dispatch({
        [LOADERS.ADD_MEMBERS]: { status: true, error: false, id: null },
      });
      let { data } = await addUserToGroup(dataModel.data);
      notify("User added successfully ", "success");
      addToMembersTable && addToMembersTable(data.user);
      reload && reload();
      dispatch({
        [LOADERS.ADD_MEMBERS]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADERS.ADD_MEMBERS]: { status: false, error: true, id: null },
      });
      imsLogger("UserForm", ex.response);
      notify(
        (ex.response && ex.response.data.message) ||
          "User add failed. Unknown error occurred",
        "danger"
      );
    }
  };

  // initializig hooks requried hooks...
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );

  let { data, errors } = dataModel;

  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);

  return (
    <Form
      action="/"
      className="form-horizontal"
      onSubmit={(e) => handleSubmit(e, doSubmit)}
    >
      <ImsInputSelect
        label="User"
        name="user"
        value={data.user}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={users
          .filter((user) => !filterUsersByGroup(user.membership, group._id))
          .map((user) => ({
            value: user._id,
            label: `${user.name} (${user.email})`,
          }))}
      />
      <ImsButtonGroup>
        <Button
          disabled={validate() ? true : processing[LOADERS.ADD_MEMBERS].status}
          onClick={(e) => handleSubmit(e, doSubmit)}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing[LOADERS.ADD_MEMBERS].status ? "Processing" : "Confirm"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default UserForm;
