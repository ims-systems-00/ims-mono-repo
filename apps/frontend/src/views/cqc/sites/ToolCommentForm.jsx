import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { addToolComment, updateToolComment } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { ToolActionsContext } from "./context/ToolActionsContext";
const CommentBox = ({ editableComment, toggleEditMode }) => {
  const dataSet = {
    data: {
      comment: editableComment ? editableComment.value : "",
    },
    errors: {},
  };
  const schema = {
    comment: IVal.string().required().label("Comment"),
  };
  const { toolControl, processing, setProcessing, refreshControl } =
    useContext(ToolActionsContext);
  const notify = useContext(NotificationContext);
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  let handleAddComment = async (e) => {
    try {
      setProcessing({ action: "add-comment", id: null });
      let { data } = await addToolComment(toolControl._id, dataModel.data);
      refreshControl(data.control);
      notify("Comment added successfully ", "success");
    } catch (ex) {
      imsLogger("CQCSitesToolCommentForm", ex.response || ex);
      notify("Comment add failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  let handleUpdateComment = async (e) => {
    try {
      setProcessing({ action: "update-comment", id: editableComment._id });
      let { data } = await updateToolComment(
        toolControl._id,
        editableComment._id,
        dataModel.data
      );
      refreshControl(data.control);
    } catch (ex) {
      imsLogger("CQCSitesToolCommentForm", ex.response || ex);
      notify("Operation failed", "danger");
    }
    toggleEditMode();
    setProcessing({ action: null, id: null });
  };

  return (
    <Form action="/" className="form-horizontal mt-5" method="get">
      <ImsInputText
        label={editableComment ? "Update comment" : "New comment"}
        cols="80"
        rows="2"
        placeholder="Comment"
        type="textarea"
        name="comment"
        value={data.comment}
        onChange={handleChange}
        error={errors.comment}
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
              outline
              className="border border-0"
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

export default CommentBox;
