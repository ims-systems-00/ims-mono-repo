import DirectionPicker from "@/components/Pickers/google/DirectionPicker";
import React from "react";
import { Col, FormGroup, Label, Row } from "@ims-systems-00/ims-ui-kit";

const ImsDirectionPicker = ({
  label,
  travelMode,
  onChange,
  error,
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
        sm={isHorizontal ? "2" : "12"}
      >
        {label}
      </Label>
      <Col sm={isHorizontal ? "10" : "12"}>
        <FormGroup>
          <DirectionPicker
            travelMode={travelMode}
            onDirectionsPicked={(e) => onChange(e)}
            {...rest}
          />
          {error && <label className="text-danger">{error}</label>}
        </FormGroup>
      </Col>
    </Row>
  );
};

export default ImsDirectionPicker;
