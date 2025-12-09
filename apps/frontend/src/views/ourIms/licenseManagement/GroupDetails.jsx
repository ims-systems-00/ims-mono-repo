import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";

const GroupDetails = ({ group }) => {
  return (
    <div className="container">
      <h4 className="mb-3 text-primary fw-bold">Licence details</h4>
      <Row>
        <Col md="12">
          <DetailsSectionContent label="Name:" value={group?.name} />
        </Col>
        <Col md="12">
          <DetailsSectionContent label="Access type:" value={group.type} />
        </Col>
        <Col md="12">
          <DetailsSectionContent
            label="Responsibility:"
            value={group.responsibility}
          />
        </Col>
        <Col md="12">
          <DetailsSectionContent
            label="Operating location:"
            value={group?.details?.operatingLocation}
          />
        </Col>
        <Col md="12">
          <DetailsSectionContent
            label="Standard:"
            value={group?.details?.standards}
          />
        </Col>
        <Col md="12">
          <DetailsSectionContent
            label="Number of Staff:"
            value={group.totalMembers}
          />
        </Col>
        <Col md="12">
          <DetailsSectionContent
            label="Access policy:"
            value={group?.policy?.name}
          />
        </Col>
      </Row>
    </div>
  );
};

export default GroupDetails;
