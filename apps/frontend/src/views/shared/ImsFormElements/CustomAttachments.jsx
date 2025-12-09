import { Col, Label, Row } from "@ims-systems-00/ims-ui-kit";

const CustomAttachments = ({ label, isHorizontal, attachments = [] }) => {
  return (
    <>
      <Row>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
          //  sm={isHorizontal ? "2" : "12"}
          sm="2"
        >
          {label}
        </Label>
        <Col
          // sm={isHorizontal ? "10" : "12"}
          sm="10"
        >
          {attachments.map((data) => (
            <h6 className="my-3" key={data._id}>
              {data.key || data.Key}
            </h6>
          ))}
        </Col>
      </Row>
    </>
  );
};

export default CustomAttachments;
