import NotificationContext from "@/contexts/notificationContext";
import { Button, Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { useContext, useState } from "react";
import { getCurrentSessionData } from "@/services/authService";
import { deleteToolComment } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { ToolActionsContext } from "./context/ToolActionsContext";
import ToolCommentForm from "./ToolCommentForm";

const Comment = ({ comment }) => {
  let [editMode, setEditMode] = useState(false);
  let toggleEditMode = () => setEditMode((currentMode) => !currentMode);
  let { processing, setProcessing, refreshControl, toolControl } =
    useContext(ToolActionsContext);
  let notify = useContext(NotificationContext);
  let handleDeleteComment = async (e) => {
    try {
      setProcessing({ action: "delete-comment", id: comment._id });
      let { data } = await deleteToolComment(toolControl._id, comment._id);
      refreshControl(data.control);
      notify("Comment deleted successfully", "success");
    } catch (ex) {
      imsLogger("CQCSitesToolComments", ex.response || ex);
      notify("Comment delete failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  return editMode ? (
    <ToolCommentForm
      editableComment={comment}
      toggleEditMode={toggleEditMode}
    />
  ) : (
    <Row className="">
      <Col md="2">
       
      </Col>
      <Col md="10">
        <Card className="card-timeline">
          <CardBody className="card-timeline">
            <p>
              <span className="text-info">
                {comment.created.by && comment.created.by.name}{" "}
              </span>
              on{" "}
              <span className="text-secondary">
                {moment(comment.created.on).format("DD/MM/YYYY HH:mm")}
              </span>
            </p>
            <p>
              {processing.action === "updating-comment" &&
              processing.id === comment._id
                ? "Saving..."
                : comment.value}
            </p>
            {comment.created.by &&
              comment.created.by._id === getCurrentSessionData().user?._id && (
                <>
                  <Button
                    size="sm"
                    className="btn-text btn-info"
                    onClick={() => toggleEditMode()}
                  >
                    Edit
                  </Button>
                  <Button
                    disabled={
                      processing.action === "delete-comment" &&
                      processing.id === comment._id
                    }
                    size="sm"
                    // className="btn-text btn-danger"
                    color="danger"
                    onClick={() => handleDeleteComment()}
                  >
                    {processing.action === "delete-comment" &&
                    processing.id === comment._id
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </>
              )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Comment;
