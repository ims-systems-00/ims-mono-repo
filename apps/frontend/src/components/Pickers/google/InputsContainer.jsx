import { Button, Col, FormGroup, Row } from "@ims-systems-00/ims-ui-kit";
import PlacesAutoComplete from "./PlacesAutoComplete";
const InputContainer = ({
  onOriginChange = () => {},
  onDestinationChange = () => {},
  onSearch = () => {},
}) => {
  return (
    <div className="maps-toolbar">
      <Row>
        <Col md="4">
          <FormGroup>
            <PlacesAutoComplete onSelected={(e) => onOriginChange(e.value)} />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <PlacesAutoComplete
              onSelected={(e) => onDestinationChange(e.value)}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Button onClick={onSearch} size="sm" className="btn-primary ">
              Calculate route
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};
export default InputContainer;
