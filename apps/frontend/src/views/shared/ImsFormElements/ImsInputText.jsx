import { Col, FormGroup, Input, Label, Row } from "@ims-systems-00/ims-ui-kit";

const ImsInputText = ({
  label,
  type = "text",
  mandatory = false,
  error,
  onChange,
  isHorizontal = false,
  ...rest
}) => {
  return (
    <>
      <Row>
        <Col sm={isHorizontal ? "2" : "12"}>
          <Label
            style={{
              fontSize: "16px",
            }}
            className="text-dark"
          >
            {label} {mandatory ? <span className="text-danger">*</span> : ""}
          </Label>
        </Col>
        <Col sm={isHorizontal ? "10" : "12"}>
          <FormGroup>
            <Input onChange={(e) => onChange(e)} type={type} {...rest} />
            {error && <label className="text-danger">{error}</label>}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default ImsInputText;
