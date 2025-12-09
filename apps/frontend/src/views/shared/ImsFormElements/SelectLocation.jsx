import { Col, FormGroup, Label, Row } from "@ims-systems-00/ims-ui-kit";
import Select from "react-select";
import usePlacesAutocomplete from "use-places-autocomplete";

const SelectLocation = ({
  label,
  error,
  name,
  lableCol = "2",
  inputCol,
  vertical = false,
  mandatory = false,
  isHorizontal,
  onChange = () => {},
  ...rest
}) => {
  const {
    setValue,
    suggestions: { status, data },
  } = usePlacesAutocomplete();
  const handleChange = (changes) => {
    if (!changes) {
      let currentTarget = {
        name,
        value: "",
      };
      onChange({ currentTarget });
    } else {
      let currentTarget = {
        name,
        value: changes.value,
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
          <Label
            style={{
              fontSize: "16px",
            }}
            className="text-dark"
            sm={lableCol}
          >
            {label} {mandatory ? <span className="text-danger">*</span> : ""}
          </Label>
          <Col sm={isHorizontal ? "10" : "12"}>
            <FormGroup>
              <Select
                placeholder={"Search location"}
                className="react-select default"
                classNamePrefix="react-select"
                onChange={(e) => {
                  handleChange(e);
                }}
                onInputChange={(value) => {
                  setValue(value);
                }}
                options={
                  status === "OK"
                    ? data.map((place) => ({
                        value: place.description,
                        label: place.description,
                      }))
                    : []
                }
              />
            </FormGroup>
          </Col>
        </Row>
      )}
    </>
  );
};

export default SelectLocation;
