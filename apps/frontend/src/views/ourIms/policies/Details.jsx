import React from "react";
import { Badge, Col, Row } from "@ims-systems-00/ims-ui-kit";
import { imsLogger } from "@/services/loggerService";
const Details = ({ policy }) => {
  {
    policy.statement.map((statement) => {
      imsLogger("PolicyDetail", statement.service);
    });
  }
  return (
    <React.Fragment>
      <Row>
        <Col md="6" className="mb-4">
          <p className="text-primary font-size-subtitle-1">Type</p>
          <p>{policy.type}</p>
        </Col>
        <Col md="6" className="mb-4">
          <p className="text-primary font-size-subtitle-1">Access scope</p>
          <p> {policy.accessScope}</p>
        </Col>
        <Col md="12" className="mb-4">
          <p className="text-primary font-size-subtitle-1">
            Features and functionalities
          </p>
          <Row>
            {policy.statement &&
              policy.statement.map((statement, index) => (
                <Col md="3">
                  <p className="font-weight-bold">
                    {index + 1}. {statement.service}
                    <br />
                  </p>
                  <span>
                    Allowed actions:{" "}
                    {statement.actions.map((action) => (
                      <Badge color="primary" key={action}>
                        {action}{" "}
                      </Badge>
                    ))}
                    <br></br>
                    Permission status:{" "}
                    <span className="text-secondary">{statement.effect}</span>
                  </span>
                </Col>
              ))}
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Details;
