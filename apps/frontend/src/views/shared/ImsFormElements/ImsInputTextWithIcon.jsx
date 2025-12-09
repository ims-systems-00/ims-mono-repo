import React from "react";
import {
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "@ims-systems-00/ims-ui-kit";

const ImsInputTextWithIcon = ({
  label,
  onChange,
  icon,
  type = "text",
  mandatory = false,
  options,
  error,
  defaultOpt,
  selectedVal,
  isHorizontal,
  ...props
}) => {
  return (
    <Row className="">
      {label && (
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
      )}
      <Col sm={isHorizontal && label ? "10" : "12"}>
        <InputGroup>
          <InputGroupText>
            <i className={`${icon}`} />
          </InputGroupText>
          {options ? (
            <Input type="select" onChange={(e) => onChange(e)} {...props}>
              <option value={"undefined"}>{defaultOpt}</option>
              {options &&
                options.map((item, i) => (
                  <option key={item.value} value={item.value}>
                    {item.placeHolder}
                  </option>
                ))}
            </Input>
          ) : (
            <Input
              className="input-field-icon"
              type={type}
              onChange={(e) => onChange(e)}
              {...props}
            />
          )}
        </InputGroup>
        {error && <label className="text-danger">{error}</label>}
      </Col>
    </Row>
  );
};

export default ImsInputTextWithIcon;
