import { Col, FormGroup, Label, Row } from "@ims-systems-00/ims-ui-kit";
import ReactDatetime from "react-datetime";

const ImsInputTime = ({
  label,
  name,
  value,
  inputCol,
  onChange,
  error,
  disabled,
  isHorizontal,
}) => {
  return (
    <Row className="">
      <Col sm={isHorizontal ? "2" : "12"}>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
        >
          {label}
        </Label>
      </Col>

      <Col sm={isHorizontal && label ? "10" : "12"}>
        <FormGroup>
          <ReactDatetime
            dateFormat={false}
            timeIntervals={30}
            timeFormat="HH:mm"
            inputProps={{
              disabled,
              className: "form-control",
              placeholder: "Select a time",
              value,
              name,
              // this onchange is direct input ...
              onChange,
              autoComplete: "off",
            }}
            // this onchange is for calender ...
            onChange={(e) => {
              if (typeof e === "object") {
                let currentTarget = { name, value: e.format("HH:mm") };
                onChange({ currentTarget });
              }
            }}
            className="text-dark"
          />
          {error && <label className="text-danger">{error}</label>}
        </FormGroup>
      </Col>
    </Row>
  );
};

export default ImsInputTime;
