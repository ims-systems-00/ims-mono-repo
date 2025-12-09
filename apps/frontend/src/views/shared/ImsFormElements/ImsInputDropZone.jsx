import FileDropZone from "@/components/CustomUpload/FileDropZone";
import { Col, FormGroup, Label, Row } from "@ims-systems-00/ims-ui-kit";

const ImsInputDropZone = ({
  label,
  error,
  clearAll = false,
  onLoad,
  name,
  onChange,
  noMultiple,
  isHorizontal,
  ...rest
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

      <Col sm={isHorizontal ? "10" : "12"}>
        <FormGroup>
          <FileDropZone
            {...rest}
            name={name}
            clearAll={clearAll}
            noMultiple={noMultiple}
            onLoad={(files) => onLoad(files)}
          />
        </FormGroup>
      </Col>
    </Row>
  );
};

export default ImsInputDropZone;
