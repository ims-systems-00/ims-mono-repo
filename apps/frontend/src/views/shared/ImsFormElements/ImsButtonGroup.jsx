import { Col, Label, Row } from "@ims-systems-00/ims-ui-kit";

const ImsButtonGroup = ({ children, isHorizontal }) => {
  return (
    <Row className="">
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm={"12"}
      ></Label>
      <Col sm={"12"}>{children}</Col>
    </Row>
  );
};

export default ImsButtonGroup;
