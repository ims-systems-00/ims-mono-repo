import NotificationContext from "@/contexts/notificationContext";
import { Button, Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import { useContext, useState } from "react";
import { imsLogger } from "@/services/loggerService";
import { deleteAttendee } from "@/services/managementReviewServices";
import AttendeeForm from "./AttendeeForm";
import { ManagementReviewActionsContext } from "./context/ManagementReviewActionsContext";
const Attendee = ({ attendee }) => {
  let [editMode, setEditMode] = useState(false);
  let toggleEditMode = () => setEditMode((currentMode) => !currentMode);
  let { processing, setProcessing, refreshManagementReview, managementReview } =
    useContext(ManagementReviewActionsContext);
  let notify = useContext(NotificationContext);
  let handleDeleteAttendee = async (e) => {
    try {
      setProcessing({ action: "delete-attendee", id: attendee._id });
      let { data } = await deleteAttendee(managementReview._id, attendee._id);
      notify("Attendee deleted successfully", "success");
      refreshManagementReview(data.managementReview);
    } catch (ex) {
      imsLogger("Attendee", ex.response || ex);
      notify("Attendee delete failed,Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  return editMode ? (
    <AttendeeForm attendee={attendee} toggleEditMode={toggleEditMode} />
  ) : (
    <Row className="mt-4">
      <Col md="2">
        <div className="card-img"> </div>
      </Col>
      <Col md="10">
        <Card>
          <CardBody>
            <Row>
              <Col md="12" className="mb-4">
                <p>{attendee.name}</p>
              </Col>
            </Row>
            {/* <Button
              size='sm'
              className='btn-simple btn-info'
              onClick={() => toggleEditMode()}
            >
              Edit
            </Button> */}
            <Button
              disabled={
                processing.action === "delete-attendee" &&
                processing.id === attendee._id
              }
              size="sm"
              className="border border-0"
              outline
              color="danger"
              onClick={() => handleDeleteAttendee()}
            >
              {processing.action === "delete-attendee" &&
              processing.id === attendee._id
                ? "Deleting..."
                : "Delete"}
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Attendee;
