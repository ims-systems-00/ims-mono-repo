import {
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "@ims-systems-00/ims-ui-kit";

const CustomIconInputGroup = ({
  label,
  onChange,
  icon,
  type = "text",
  options,
  error,
  defaultOpt,
  selectedVal,
  isHorizontal,
  ...props
}) => {
  return (
    <Row>
      {label && (
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
          sm={isHorizontal ? "12" : "2"}
        >
          {label}
        </Label>
      )}
      <Col sm={label && "10"}>
        <InputGroup>
          <InputGroupText>
            <i className={`tim-icons ${icon}`} />
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
            <Input type={type} onChange={(e) => onChange(e)} {...props} />
          )}
        </InputGroup>
        {error && <label className="text-danger">{error}</label>}
      </Col>
    </Row>
  );
};

export default CustomIconInputGroup;
