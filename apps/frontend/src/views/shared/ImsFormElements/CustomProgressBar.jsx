import { Col, Label, Progress, Row } from "@ims-systems-00/ims-ui-kit";

const CustomProgressBar = ({ isHorizontal, ...rest }) => {
  return (
    <>
      <Row>
        <Label sm={isHorizontal ? "12" : "2"}></Label>
        <Col sm={isHorizontal ? "12" : "10"}>
          <Progress {...rest} />
        </Col>
      </Row>
    </>
  );
};

export default CustomProgressBar;
