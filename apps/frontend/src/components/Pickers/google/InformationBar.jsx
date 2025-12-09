import { Col, Row } from "@ims-systems-00/ims-ui-kit";

const InformationBar = ({ resultentInfo }) => {
  return (
    <Row className="mb-2">
      <Col sm="6">
        <p className="text-bold">
          Distance{" "}
          <span className="text-secondary">
            {((resultentInfo.distance.value / 1000) * 0.621371).toFixed(2)} mile
          </span>
        </p>
      </Col>
      <Col sm="6">
        <p className="text-bold">
          Duration{" "}
          <span className="text-secondary">{resultentInfo.duration.text}</span>
        </p>
      </Col>
    </Row>
  );
};
export default InformationBar;
