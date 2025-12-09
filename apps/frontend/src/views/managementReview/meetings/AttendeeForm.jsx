import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { imsLogger } from "@/services/loggerService";
import {
  addAttendee,
  mapToAttendeeModel,
} from "@/services/managementReviewServices";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { ManagementReviewActionsContext } from "./context/ManagementReviewActionsContext";
const AttendeeForm = ({ attendee, toggleEditMode }) => {
  const dataSet = attendee
    ? mapToAttendeeModel(attendee)
    : {
        data: {
          name: "",
        },
        errors: {},
      };
  const schema = {
    name: IVal.string().required().label("comment"),
  };
  const {
    managementReview,
    processing,
    setProcessing,
    refreshManagementReview,
  } = useContext(ManagementReviewActionsContext);
  const notify = useContext(NotificationContext);
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  let handleAddAttendee = async (e) => {
    try {
      setProcessing({ action: "add-attendee", id: null });
      let { data } = await addAttendee(managementReview._id, dataModel.data);
      notify("Attendee added successfully ", "success");
      refreshManagementReview(data.managementReview);
    } catch (ex) {
      imsLogger("AttendeeForm", ex.response || ex);
      notify("Attendee add failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  let handleUpdateAttendee = async (e) => {
    try {
    } catch (ex) {
      imsLogger("AttendeeForm", ex.response || ex);
      notify("Operation failed", "danger");
    }
    toggleEditMode();
    setProcessing({ action: null, id: null });
  };

  return (
    <Form action="/" className="form-horizontal mt-5" method="get">
      <ImsInputText
        label={"Add attendee"}
        placeholder="Name/email"
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
      />
      <ImsButtonGroup>
        {attendee && attendee._id ? (
          <>
            <Button
              size="sm"
              className="btn-simple btn-primary"
              color="primary"
              type="button"
              disabled={
                validate() ? true : processing.action === "update-attendee"
              }
              onClick={(e) => {
                handleSubmit(e, handleUpdateAttendee, false);
              }}
            >
              {processing.action === "update-attendee" &&
              processing.id === attendee._id
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
              cancel
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            className="btn-simple btn-primary"
            color="primary"
            type="button"
            disabled={validate() ? true : processing.action === "add-attendee"}
            onClick={(e) => handleSubmit(e, handleAddAttendee)}
          >
            {processing.action === "add-attendee" ? "Saving..." : "Add"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default AttendeeForm;
