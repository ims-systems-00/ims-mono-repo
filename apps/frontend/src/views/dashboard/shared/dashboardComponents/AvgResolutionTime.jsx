import Box from "@/components/Box/Index";
import { Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";

const AvgResolutionTime = ({ dataSet }) => {
  return (
    dataSet && (
      <React.Fragment>
        <Box minHeight={325}>
          <h4 className="mb-4">Average resolution time</h4>
          <Row>
            <Col md="6" sm="6">
              <Box varient="secondary-extra-light" noShadow>
                <div className="m-2">
                  <p className="pb-0">Resolution time P1</p>
                  <h4
                    className={
                      dataSet.incidents.p1AvgResolutionTime.alert
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {dataSet.incidents.p1AvgResolutionTime.time}
                  </h4>
                </div>
              </Box>
            </Col>
            <Col md="6" sm="6">
              <Box varient="secondary-extra-light" noShadow>
                <div className="m-2">
                  <p className="">Resolution time P2</p>
                  <h4
                    className={
                      dataSet.incidents.p2AvgResolutionTime.alert
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {dataSet.incidents.p2AvgResolutionTime.time}
                  </h4>
                </div>
              </Box>
            </Col>
            <Col md="6" sm="6">
              <Box varient="secondary-extra-light" noShadow>
                <div className="m-2">
                  <p className="">Resolution time P3</p>
                  <h4
                    className={
                      dataSet.incidents.p3AvgResolutionTime.alert
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {dataSet.incidents.p3AvgResolutionTime.time}
                  </h4>
                </div>
              </Box>
            </Col>
            <Col md="6" sm="6">
              <Box varient="secondary-extra-light" noShadow>
                <div className="m-2">
                  <p className="">Resolution time P4</p>
                  <h4
                    className={
                      dataSet.incidents.p4AvgResolutionTime.alert
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {dataSet.incidents.p4AvgResolutionTime.time}
                  </h4>
                </div>
              </Box>
            </Col>
          </Row>
        </Box>
      </React.Fragment>
    )
  );
};

export default AvgResolutionTime;
