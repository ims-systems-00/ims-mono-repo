import Box from "@/components/Box/Index";
import ImsBarChart from "@/components/charts/ImsBarChart";
import ImsCircularProgressChart from "@/components/charts/ImsCircularProgressChart";
import ImsPaddingPieChart from "@/components/charts/ImsPaddingPieChart";
import { CardTitle, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Link } from "react-router-dom";

const AuditInspection = ({ dataSet, HoS }) => {
  return (
    <React.Fragment>
      {HoS ? (
        <Row>
          <Col lg="8" md="8">
            <Box>
              <Link to="/admin/audits/internal">
                <h4>Audits overview</h4>
              </Link>
              <ImsBarChart
                data={dataSet.internalAudits.data}
                options={dataSet.internalAudits.options}
              />
            </Box>
          </Col>
          <Col className="me-auto" lg="4">
            <Box>
              <Row>
                <Col xs="12" className="mb-5 mt-4 text-center">
                  <ImsCircularProgressChart
                    data={dataSet.sheduledAuditVsCompletedAudit.data}
                    options={dataSet.sheduledAuditVsCompletedAudit.options}
                  />
                </Col>
                <Col xs="12">
                  <CardTitle tag="h4" className="text-center">
                    <i className="ims-icons-20 icon-icon-trophy-24 text-success" />{" "}
                    Completed {dataSet.audits.completed}
                  </CardTitle>
                  <p className="category text-center">
                    Scheduled {dataSet.audits.inCompleted}
                  </p>
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xl="8">
            <Box minHeight={400}>
              <Link to="/admin/audits/internal">
                <h4
                  style={{
                    fontSize: "20px",
                  }}
                >
                  Non-conformities
                </h4>
              </Link>

              <Row className="mt-5 ">
                <Col md="6" className="mb-xl-0 mb-5">
                  <div className="chart-area">
                    <ImsPaddingPieChart
                      data={dataSet.nonConformitiesVsConformities.data}
                      options={dataSet.nonConformitiesVsConformities.options}
                    />
                  </div>
                </Col>
                <Col md="6" className="">
                  <h4
                    style={{
                      fontSize: "20px",
                    }}
                    className="text-secondary"
                  >
                    Top business units
                  </h4>
                  <p className="category my-3">
                    <i class="fa-solid fa-circle me-3"></i>{" "}
                    {dataSet.nonConformities.businessFunctionNames[0]}{" "}
                    {dataSet.nonConformities.amount[0]}
                  </p>
                  <p className="category my-3">
                    <i class="fa-solid fa-circle me-3"></i>{" "}
                    {dataSet.nonConformities.businessFunctionNames[1]}{" "}
                    {dataSet.nonConformities.amount[1]}
                  </p>
                  <p className="category my-3">
                    <i class="fa-solid fa-circle me-3"></i>{" "}
                    {dataSet.nonConformities.businessFunctionNames[2]}{" "}
                    {dataSet.nonConformities.amount[2]}
                  </p>
                  <p className="category my-3">
                    <i class="fa-solid fa-circle me-3"></i>{" "}
                    {dataSet.nonConformities.businessFunctionNames[3]}{" "}
                    {dataSet.nonConformities.amount[3]}
                  </p>
                </Col>
              </Row>
            </Box>
          </Col>
          <Col xl="4">
            <Box minHeight={400}>
              <Row>
                <Col
                  xs="12"
                  className="mb-5 mt-4 d-flex justify-content-center align-items-center"
                >
                  <ImsCircularProgressChart
                    data={dataSet.sheduledAuditVsCompletedAudit.data}
                    options={dataSet.sheduledAuditVsCompletedAudit.options}
                  />
                </Col>
                <Col xs="12">
                  <CardTitle tag="h4" className="text-center">
                    <i className="ims-icons-20 icon-icon-trophy-24 text-success" />{" "}
                    Completed {dataSet.audits.completed}
                  </CardTitle>
                  <p className="category text-center">
                    Scheduled {dataSet.audits.inCompleted}
                  </p>
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
};

export default AuditInspection;
