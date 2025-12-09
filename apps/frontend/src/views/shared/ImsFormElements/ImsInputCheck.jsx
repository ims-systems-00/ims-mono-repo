import { Col, FormGroup, Input, Label, Row } from "@ims-systems-00/ims-ui-kit";

const ImsInputCheck = ({ label, onChange, isHorizontal = false, ...rest }) => {
  return (
    <>
      <Row>
        <Col md={"12"}>
          <FormGroup check>
            <Label
              style={{
                fontSize: "16px",
              }}
              className="text-dark mb-3"
              check
            >
              <Input type="checkbox" onChange={(e) => onChange(e)} {...rest} />
              <span className="form-check-sign" />
              {label}
            </Label>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default ImsInputCheck;
