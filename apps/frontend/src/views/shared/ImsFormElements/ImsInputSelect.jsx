import { Col, FormGroup, Label, Row } from "@ims-systems-00/ims-ui-kit";
import Select from "react-select";

const ImsInputSelect = ({
  label,
  error,
  name,
  onChange = () => {},
  lableCol = "2",
  inputCol = "10",
  isHorizontal = false,
  vertical = false,
  mandatory = false,
  ...rest
}) => {
  const handleChange = (changes) => {
    if (!changes) {
      let currentTarget = {
        name,
        value: [],
      };
      onChange({ currentTarget });
    } else if (Array.isArray(changes)) {
      let currentTarget = {
        name,
        value: changes, //changes.map(item => item.value)
      };
      onChange({ currentTarget });
    } else {
      let currentTarget = {
        name,
        value: changes, //changes.value
      };
      onChange({ currentTarget });
    }
  };
  return (
    <>
      {vertical ? (
        <Select {...rest} onChange={handleChange} />
      ) : (
        <Row className="">
          {label && (
            <Col sm={isHorizontal ? "2" : "12"}>
              <Label
                style={{
                  fontSize: "16px",
                }}
                className="text-dark"
              >
                {label}{" "}
                {mandatory ? <span className="text-danger">*</span> : ""}
              </Label>
            </Col>
          )}

          <Col md={isHorizontal ? `${inputCol || "4"}` : "12"}>
            <FormGroup>
              <Select {...rest} onChange={handleChange} />
              {error && <label className="text-danger">{error}</label>}
            </FormGroup>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ImsInputSelect;
