import { Button, Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import { useState } from "react";
import { CUSTOMIZABLE_SERVICES } from "@/rolesAndPermissions";
import { imsLogger } from "@/services/loggerService";
import Statement from "./Statement";

const Statements = ({
  statement,
  deleteStatement,
  processing,
  setProcessing,
}) => {
  let [editMode, setEditMode] = useState(false);
  let toggleEditMode = () => setEditMode((currentMode) => !currentMode);

  let handleDelete = async (e) => {
    try {
      setProcessing({ action: "delete-statement", id: statement.service });
      deleteStatement(statement);
    } catch (ex) {
      imsLogger("Statements", ex.response || ex);
    }
    setProcessing({ action: null, id: null });
  };
  return editMode ? (
    <Statement
      statement={statement}
      toggleEditMode={toggleEditMode}
      setProcessing={setProcessing}
      processing={processing}
    />
  ) : Object.values(CUSTOMIZABLE_SERVICES).includes(statement.service) ? (
    <Row className="mt-4">
      <Col md="2">
        <div className="card-img"> </div>
      </Col>
      <Col md="10">
        <Card>
          <CardBody>
            <Row>
              <Col md="4" className="mb-4">
                <h4 className="text-primary">Service</h4>
                <p>{statement.service}</p>
              </Col>
              <Col md="8" className="mb-4">
                <h4 className="text-primary">Permissions</h4>
                {statement.actions.map((action) => (
                  <span key={action}>{action} </span>
                ))}
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
                processing.action === "delete-statement" &&
                processing.id === statement.service
              }
              size="sm"
              className="btn-fill"
              color="danger"
              onClick={() => handleDelete()}
            >
              {processing.action === "delete-statement" &&
              processing.id === statement.service
                ? "Deleting..."
                : "Delete"}
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  ) : null;
};

export default Statements;
