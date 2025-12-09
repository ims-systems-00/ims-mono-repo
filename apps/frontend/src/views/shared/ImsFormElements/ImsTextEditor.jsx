import {
  Col,
  FormGroup,
  Label,
  Row,
  TextEditor,
} from "@ims-systems-00/ims-ui-kit";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";

const ImsTextEditor = ({
  label,
  error,
  name,
  onChange = () => {},

  placeholder,
  ...rest
}) => {
  const { isHorizontal = false } = rest || {};
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
            {label}
          </Label>
        </Col>
      )}
      <Col sm={isHorizontal && label ? "10" : "12"}>
        <FormGroup>
          <TextEditor
            onDataStructureChange={(draftDataStructure) =>
              onChange({ currentTarget: { name, value: draftDataStructure } })
            }
            mediaLinkGeneratorFn={linkGenerator}
            onEachFileSelection={handleUpload}
            placeholder={placeholder}
            {...rest}
          />
          {error && <label className="text-danger">{error}</label>}
        </FormGroup>
      </Col>
    </Row>
  );
};

export default ImsTextEditor;
