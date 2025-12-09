import React from "react";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
const Details = ({ group }) => {
  return (
    <React.Fragment>
      <Row>
        <Col md="12">
          <DetailsSectionContent
            label="Responsibility:"
            value={group.responsibility}
          />
        </Col>
        <Col md="12">
          <DetailsSectionContent label="Access type:" value={group.type} />
        </Col>

        {group?.details?.operatingLocation && (
          <Col md="12">
            <DetailsSectionContent
              label="Operating location:"
              value={group?.details?.operatingLocation}
            />
          </Col>
        )}
        {group?.details?.standards && (
          <Col md="12">
            <DetailsSectionContent
              label="Standard:"
              value={group?.details?.standards}
            />
          </Col>
        )}
        <Col md="12">
          <DetailsSectionContent
            label="Number of individuals:"
            value={group.totalMembers}
          />
        </Col>
        <Col md="12">
          <DetailsSectionContent
            label="Toolkits:"
            value={group.userLicenses.complianceTools.map((tool, i) => (
              <p key={tool}>
                {i + 1}. {tool}{" "}
              </p>
            ))}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Details;
