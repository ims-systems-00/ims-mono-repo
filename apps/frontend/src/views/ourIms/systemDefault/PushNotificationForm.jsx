import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import { createNotification } from "@/services/notificationService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";

import ACTIONS from "./actions";

const audiences = [
  {
    value: "All users",
    label: "All users",
  },
  {
    value: "Head of services",
    label: "Heads of service",
  },
];

const PushNotificationForm = ({
  processing,
  dispatch,
  addToPushNotificationTable,
}) => {
  let notify = React.useContext(NotificationContext);
  const dataSet = {
    data: {
      audience: {
        value: audiences[0].value,
        label: audiences[0].label,
      },
      message: "",
    },
    errors: {},
  };
  const schema = {
    message: IVal.string().required().max(150).label("Message"),
    audience: IVal.object().keys({
      value: IVal.string().required().label("Audience"),
      label: IVal.string().required().label("Audience"),
    }),
  };
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "confirm": {
          dispatch({
            [ACTIONS.ADD_NOTIFICATION]: {
              status: true,
              error: false,
              id: null,
            },
          });
          let { data } = await createNotification(dataModel.data);
          addToPushNotificationTable &&
            addToPushNotificationTable(data.notification);
          notify("Notification sent successfully", "success");
          dispatch({
            [ACTIONS.ADD_NOTIFICATION]: {
              status: false,
              error: false,
              id: null,
            },
          });
          break;
        }
      }
    } catch (ex) {
      dispatch({
        [ACTIONS.ADD_NOTIFICATION]: { status: false, error: true, id: null },
      });
      imsLogger("PushNotificationForm", ex.response || ex);
      notify("Notification send failed", "danger");
    }
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  return (
    <div>
      <Form action="/" className="form-horizontal" onSubmit={handleSubmit}>
        <ImsInputText
          label="Message"
          name="message"
          type="textarea"
          rows="3"
          placeholder="Message"
          value={data.message}
          onChange={handleChange}
          error={errors.message}
        />

        <ImsInputSelect
          placeholder="Selelect audience"
          name="audience"
          label="Audience"
          icon="icon-app"
          className="react-select default"
          classNamePrefix="react-select"
          error={errors.audience}
          value={data.audience}
          onChange={handleChange}
          options={audiences.map((item) => ({
            value: item.value,
            label: item.label,
          }))}
        />

        <ImsButtonGroup>
          <Button
            name="confirm"
            onClick={(e) => handleSubmit(e, doSubmit)}
            disabled={
              validate() ? true : processing[ACTIONS.ADD_NOTIFICATION].status
            }
            className="btn-fill"
            color="primary"
            type="button"
          >
            {processing[ACTIONS.ADD_NOTIFICATION].status
              ? "Processing"
              : "Confirm"}
          </Button>
        </ImsButtonGroup>
      </Form>
    </div>
  );
};

export default PushNotificationForm;
