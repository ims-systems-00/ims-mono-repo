import Box from "@/components/Box/Index";
import ImsBarChart from "@/components/charts/ImsBarChart";
import { Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Link } from "react-router-dom";

const CIPManagement = ({ dataSet, HoS, unmappedData }) => {
  return (
    <React.Fragment>
      {HoS ? (
        <Row>
          <Col lg="6">
            <Box>
              <span className="font-size-subtitle-1">
                <Link to="/admin/cip" className="module-link">
                  Improvements identified
                </Link>
              </span>
              <ImsBarChart
                data={dataSet.improvementsOpen.data}
                options={dataSet.improvementsOpen.options}
              />
            </Box>
          </Col>
          <Col lg="6">
            <Box>
              <span className="font-size-subtitle-1">
                <Link to="/admin/cip" className="module-link">
                  Improvements implemented
                </Link>
              </span>

              <div className="chart-area">
                <ImsBarChart
                  data={dataSet.improvementsImplemented.data}
                  options={dataSet.improvementsImplemented.options}
                />
              </div>
            </Box>
          </Col>
        </Row>
      ) : (
        <Box>
          <h4>Continual Improvement</h4>
          <Row>
            <Col md={6}>
              <span className="font-size-subtitle-1">
                <Link to="/admin/cip" className="module-link">
                  Improvements identified
                </Link>
              </span>
              <div
                style={{
                  minHeight: "308px",
                }}
                className="chart-area"
              >
                <ImsBarChart
                  data={dataSet.opportunities.data}
                  options={dataSet.opportunities.options}
                />
              </div>
            </Col>
            <Col md={6}>
              <span className="font-size-subtitle-1">
                <Link to="/admin/cip" className="module-link">
                  Improvements implemented
                </Link>
              </span>
              <div
                style={{
                  minHeight: "308px",
                }}
                className="chart-area"
              >
                <ImsBarChart
                  data={dataSet.improvements.data}
                  options={dataSet.improvements.options}
                />
              </div>
            </Col>
          </Row>
        </Box>
      )}
    </React.Fragment>
  );
};

export default CIPManagement;
