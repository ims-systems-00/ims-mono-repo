import { Col, FormGroup, Label, Row } from "@ims-systems-00/ims-ui-kit";
import ReactDatetime from "react-datetime";

const ImsInputDate = ({
  label,
  name,
  value,
  onChange,
  error,
  mandatory = false,
  disabled,
  lableCol = "2",
  inputCol = "10",
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
          {label} {mandatory ? <span className="text-danger">*</span> : ""}
        </Label>
      </Col>

      <Col sm={isHorizontal ? "10" : "12"}>
        <FormGroup>
          <ReactDatetime
            inputProps={{
              disabled,
              placeholder: "Select date",
              className: "form-control",
              value,
              name,
              // this onchange is direct input ...
              onChange,
              autoComplete: "off",
            }}
            // this onchange is for calender ...
            onChange={(e) => {
              if (typeof e === "object") {
                let currentTarget = { name, value: e.format("D/M/YYYY") };
                onChange({ currentTarget });
              }
            }}
            timeFormat={false}
            dateFormat={"D/M/YYYY"}
          />
          {error && <label className="text-danger">{error}</label>}
        </FormGroup>
      </Col>
    </Row>
  );
};

export default ImsInputDate;
