import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import {
  addSignificantEventAction,
  mapToSignificantEventActionModel,
  UpdateSignificantEventAction,
} from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputSelect,
  ImsInputText,
} from "@/views/shared/CustomFormElements";
import { SignificantEventActionsContext } from "./context/SignificantEventActionsContext";

const EventActionForm = ({ editableComment, toggleEditMode }) => {
  let { users, lazyLoadUsers } = useUsers();
  const dataSet = editableComment
    ? mapToSignificantEventActionModel(editableComment)
    : {
        data: {
          action: "",
          assignedTo: {
            value: null,
            label: "Select assignee",
          },
        },
        errors: {},
      };
  const schema = {
    action: IVal.string().required().label("Action"),
    assignedTo: IVal.object().keys({
      value: IVal.string().required().label("Assignee"),
      label: IVal.label("Assignee"),
    }),
  };
  const {
    significantEvent,
    setProcessing,
    processing,
    refreshSignificantEvent,
  } = useContext(SignificantEventActionsContext);
  const notify = useContext(NotificationContext);
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  let handleAddComment = async (e) => {
    try {
      setProcessing({ action: "add-comment", id: null });
      let { data } = await addSignificantEventAction(
        significantEvent._id,
        dataModel.data
      );
      refreshSignificantEvent(data.significantEvent);
      notify("Action added successfully ", "success");
    } catch (ex) {
      imsLogger("EventActionForm", ex.response || ex);
      notify("Action add failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  let handleUpdateComment = async (e) => {
    try {
      setProcessing({ action: "update-comment", id: editableComment._id });
      let { data } = await UpdateSignificantEventAction(
        significantEvent._id,
        editableComment._id,
        dataModel.data
      );
      refreshSignificantEvent(data.significantEvent);
      notify("Action updated successfully ", "success");
    } catch (ex) {
      imsLogger("CQCEventActionForm", ex.response || ex);
      notify("Operation failed", "danger");
    }
    toggleEditMode();
    setProcessing({ action: null, id: null });
  };

  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  return (
    <Form action="/" className="form-horizontal mt-5" method="get">
      <ImsInputText
        label={editableComment ? "Update action" : "New action"}
        cols="80"
        rows="2"
        placeholder="Plan of action"
        type="textarea"
        name="action"
        value={data.action}
        onChange={handleChange}
        error={errors.action}
      />
      <ImsInputSelect
        label="Assign to"
        name="assignedTo"
        icon="icon-app"
        isDisabled={editableComment && editableComment.assigned.to._id}
        value={data.assignedTo}
        className="react-select default"
        classNamePrefix="react-select"
        error={errors.assignedTo}
        onChange={handleChange}
        options={users.map((user) => ({
          value: user._id,
          label: user.name,
        }))}
      />
      <ImsButtonGroup>
        {editableComment && editableComment._id ? (
          <>
            <Button
              size="sm"
              className="btn-text btn-primary"
              color="primary"
              type="button"
              disabled={
                validate() ? true : processing.action === "update-comment"
              }
              onClick={(e) => {
                handleSubmit(e, handleUpdateComment, false);
              }}
            >
              {processing.action === "update-comment" &&
              processing.id === editableComment._id
                ? "Saving..."
                : "Update"}
            </Button>
            <Button
              size="sm"
              // className="btn-text btn-danger"
              color="danger"
              // color="primary"
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
            disabled={validate() ? true : processing.action === "add-comment"}
            onClick={(e) => handleSubmit(e, handleAddComment)}
          >
            {processing.action === "add-comment" ? "Saving..." : "Add"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default EventActionForm;
