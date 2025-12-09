import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import { Button, Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { useContext, useState } from "react";
import { deleteSignificantEvenAction } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { SignificantEventActionsContext } from "./context/SignificantEventActionsContext";
import EventActionForm from "./EventActionForm";

const EventActions = ({ action }) => {
  let [editMode, setEditMode] = useState(false);
  let toggleEditMode = () => setEditMode((currentMode) => !currentMode);
  let { processing, setProcessing, refreshSignificantEvent, significantEvent } =
    useContext(SignificantEventActionsContext);
  let { authUser, authSuperUser, entityAccessControl } = useAccess();
  let notify = useContext(NotificationContext);
  let handleDeleteComment = async (e) => {
    try {
      setProcessing({ action: "delete-comment", id: action._id });
      let { data } = await deleteSignificantEvenAction(
        significantEvent._id,
        action._id
      );
      refreshSignificantEvent(data.significantEvent);
      notify("Action deleted successfully", "success");
    } catch (ex) {
      imsLogger("CQCEventActions", ex.response || ex);
      notify("Action delete failed.Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  return editMode ? (
    <EventActionForm editableComment={action} toggleEditMode={toggleEditMode} />
  ) : (
    <Row className="">
      <Col md="2"></Col>
      <Col md="10">
        <Card className="card-timeline">
          <CardBody>
            <p className="">
              <span className="text-info">{action.assigned.to.name} </span>
              on{" "}
              <span className="text-secondary">
                {moment(action.assigned.on).format("DD/MM/YYYY HH:mm")}
              </span>
            </p>
            <p className="">
              {processing.action === "updating-comment" &&
              processing.id === action._id
                ? "Saving..."
                : action.value}
            </p>
            <p className="text-secondary">
              {processing.action === "updating-comment" &&
              processing.id === action._id
                ? "Saving..."
                : `Assigned to ${action.assigned.to.name}`}
            </p>
            {entityAccessControl({
              users: [action.created.by && action.created.by._id],
              effect: "Allow",
            }) && (
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
                    processing.id === action._id
                  }
                  size="sm"
                  // className="btn-text btn-danger"
                  color="danger"
                  onClick={() => handleDeleteComment()}
                >
                  {processing.action === "delete-comment" &&
                  processing.id === action._id
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

export default EventActions;
