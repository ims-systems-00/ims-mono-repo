import { Col, FormGroup, Input, Row } from "@ims-systems-00/ims-ui-kit";

const ImsCommentBox = ({
  label,
  type = "text",
  mandatory = false,
  error,
  onChange,
  isHorizontal,
  ...rest
}) => {
  return (
    <>
      <Row>
        <Col sm={isHorizontal ? "12" : "10"}>
          <FormGroup>
            <Input onChange={(e) => onChange(e)} type={type} {...rest} />
            {error && <label className="text-danger">{error}</label>}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default ImsCommentBox;
