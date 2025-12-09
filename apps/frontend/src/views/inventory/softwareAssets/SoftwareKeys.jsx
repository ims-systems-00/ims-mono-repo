import { Button, Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import USER_ACTIONS from "./actions";

const SoftwareKeys = ({ softwareKey, processing, canDelete, onSubmit }) => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col md="12" className=" d-flex align-items-center">
            <p className="font-weight-bold text-wrap word-wrap ">
              {softwareKey.value}
            </p>
            {canDelete && (
              <Button
                disabled={
                  processing[USER_ACTIONS.DELETE_SOFTWARE_KEY] &&
                  processing[USER_ACTIONS.DELETE_SOFTWARE_KEY]?.id ===
                    softwareKey._id
                }
                size="sm"
                color="danger"
                outline
                className="ml-3 mb-2 border border-0"
                onClick={() => onSubmit()}
              >
                {processing[USER_ACTIONS.DELETE_SOFTWARE_KEY] &&
                processing[USER_ACTIONS.DELETE_SOFTWARE_KEY]?.id ===
                  softwareKey._id
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SoftwareKeys;
