import { Col, FormGroup, Label, Row } from "@ims-systems-00/ims-ui-kit";

const ImsFormSectionDevider = ({ label, deviderText, isHorizontal }) => {
  return (
    <>
      {/* <hr></hr> */}
      <Row>
        <Label
          sm={"12"}
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
        >
          {label}
        </Label>
        <Col sm={isHorizontal ? "12" : "10"}>
          <FormGroup>
            <span className="form-control border-0 text-warning">
              {deviderText}
            </span>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default ImsFormSectionDevider;
