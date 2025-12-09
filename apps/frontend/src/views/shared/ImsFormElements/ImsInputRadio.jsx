import { Col, FormGroup, Input, Label, Row } from "@ims-systems-00/ims-ui-kit";

const ImsInputRadio = ({
  label,
  defaultChecked,
  onChange,
  md,
  values,
  isHorizontal,
  ...rest
}) => {
  return (
    <Row className="">
      <Label
        style={{
          fontSize: "16px",
        }}
        className="text-dark"
        sm="12"
      >
        {label}
      </Label>
      <Col
        className="checkbox-radios"
        md={isHorizontal ? `${md || "4"}` : "12"}
      >
        <FormGroup check className="form-check-radio">
          {values &&
            values.map((value, index) => (
              <Label
                style={{
                  fontSize: "16px",
                }}
                className="text-dark me-3"
                check
                key={value + index}
              >
                <Input
                  type="radio"
                  checked={value === defaultChecked}
                  onChange={(e) => onChange(e)}
                  value={value}
                  {...rest}
                />
                <span className="form-check-sign" />
                {value}
              </Label>
            ))}
        </FormGroup>
      </Col>
    </Row>
  );
};

export default ImsInputRadio;
