import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import {
  CreateInvoice,
  sendInvoice,
  updateInvoice,
} from "@/services/invoicesServices";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputText,
} from "@/views/shared/CustomFormElements";
import USER_ACTIONS from "./actions";

const SaveAndSend = ({
  customer = {},
  resetInvoice = () => {},
  invoice,
  addToTable,
  dispatch,
  processing,
  refreshInvoice,
  savedInvoice,
}) => {
  const dataSet = {
    data: {
      name: customer.primaryContact,
      email: customer.email,
    },
    errors: {},
  };
  const schema = {
    name: IVal.string().required().label("Name"),
    email: IVal.string().email().required().label("Email"),
  };
  let notify = React.useContext(NotificationContext);
  const { dataModel, handleChange, handleSubmit, validate, handleFileChange } =
    useForm(dataSet, schema);
  let { data, errors } = dataModel;

  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      dispatch({
        [USER_ACTIONS.SAVE_AND_SEND]: {
          status: true,
          error: false,
          id: null,
        },
      });
      switch (submissionType) {
        case "create": {
          let { data } = await CreateInvoice({
            ...invoice,
            emails: [{ ...dataModel.data }],
          });
          await sendInvoice(data.invoice._id);
          addToTable && addToTable(data.invoice);
          notify(
            `Invoice saved and sent to ${dataModel.data.email}`,
            "success"
          );
          resetInvoice();
          break;
        }
        case "update": {
          let { data } = await updateInvoice(savedInvoice._id, {
            ...invoice,
            emails: [{ ...dataModel.data }],
          });
          let sentResponse = await sendInvoice(data.invoice._id);
          refreshInvoice && refreshInvoice(data.invoice);
          notify(
            `Invoice saved and sent to ${dataModel.data.email}`,
            "success"
          );
          break;
        }
        default:
          break;
      }
      dispatch({
        [USER_ACTIONS.SAVE_AND_SEND]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      notify("Unknown server error occurred", "danger");
      dispatch({
        [USER_ACTIONS.SAVE_AND_SEND]: {
          status: false,
          error: true,
          id: null,
        },
      });
      // dispatch({
      //   [USER_ACTIONS.ADD_CUSTOMER]: { status: false, error: false, id: null },
      // });
    }
  };
  return (
    <Form action="/" className="form-horizontal" method="get">
      <ImsInputText
        label="Name"
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.title}
        placeholder="Name"
      />
      <ImsInputText
        label="Email"
        name="email"
        value={data.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Email"
      />
      <ImsButtonGroup>
        <Button
          name={savedInvoice ? "update" : "create"}
          onClick={(e) => handleSubmit(e, doSubmit)}
          //   disabled={validate() ? true : processing.action === "create"}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing[USER_ACTIONS.SAVE_AND_SEND].status
            ? "Processing..."
            : "Send"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default SaveAndSend;
