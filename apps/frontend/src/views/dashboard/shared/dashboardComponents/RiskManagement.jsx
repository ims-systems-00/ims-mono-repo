import classNames from "classnames";
import Box from "@/components/Box/Index";
import ImsLineChart from "@/components/charts/ImsLineChart";
import { Button, ButtonGroup, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";

const RiskManagement = ({
  bigChartData,
  changeRiskDataTab,
  dataSet,
  HoS,
  unmappedData,
}) => {
  return (
    <React.Fragment>
      <Row>
        <Col lg="12">
          <Box>
            <h4>Risk Management</h4>
            <Row>
              <Col className="text-left" sm="6">
                <span className="font-size-subtitle-1">
                  <Link to="/admin/risks" className="module-link">
                    Risks raised over the last year
                  </Link>
                </span>
              </Col>
              <Col sm="6">
                <ButtonGroup
                  className="btn-group-toggle pull-right"
                  data-toggle="buttons"
                >
                  <Button
                    color="info"
                    id="4"
                    size="sm"
                    tag="label"
                    className={classNames("btn-simple", {
                      active: bigChartData === "data5",
                    })}
                    onClick={() => changeRiskDataTab("data5")}
                  >
                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                      Organisation
                    </span>
                    <span className="d-block d-sm-none">
                      <i className="fas fa-users" />
                    </span>
                  </Button>
                  <Button
                    color="info"
                    id="0"
                    size="sm"
                    tag="label"
                    className={classNames("btn-simple", {
                      active: bigChartData === "data1",
                    })}
                    onClick={() => changeRiskDataTab("data1")}
                  >
                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                      Hardware
                    </span>
                    <span className="d-block d-sm-none">
                      <i className="fas fa-server" />
                    </span>
                  </Button>
                  <Button
                    color="info"
                    id="1"
                    size="sm"
                    tag="label"
                    className={classNames("btn-simple", {
                      active: bigChartData === "data2",
                    })}
                    onClick={() => changeRiskDataTab("data2")}
                  >
                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                      Software
                    </span>
                    <span className="d-block d-sm-none">
                      <i className="tim-icons icon-laptop" />
                    </span>
                  </Button>
                  <Button
                    color="info"
                    id="2"
                    size="sm"
                    tag="label"
                    className={classNames("btn-simple", {
                      active: bigChartData === "data3",
                    })}
                    onClick={() => changeRiskDataTab("data3")}
                  >
                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                      People
                    </span>
                    <span className="d-block d-sm-none">
                      <i className="tim-icons icon-single-02" />
                    </span>
                  </Button>
                  <Button
                    color="info"
                    id="3"
                    size="sm"
                    tag="label"
                    className={classNames("btn-simple", {
                      active: bigChartData === "data4",
                    })}
                    onClick={() => changeRiskDataTab("data4")}
                  >
                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                      Premises
                    </span>
                    <span className="d-block d-sm-none">
                      <i className="far fa-building" />
                    </span>
                  </Button>

                  <Button
                    color="info"
                    id="4"
                    size="sm"
                    tag="label"
                    className={classNames("btn-simple", {
                      active: bigChartData === "data6",
                    })}
                    onClick={() => changeRiskDataTab("data6")}
                  >
                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                      Clinical
                    </span>
                    <span className="d-block d-sm-none">
                      <i className="tim-icons icon-simple-add" />
                    </span>
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
            <div
              style={{
                minHeight: "308px",
              }}
              className="chart-area"
            >
              <Line
                key={bigChartData}
                data={dataSet.riskOverTheYear[bigChartData]}
                options={dataSet.riskOverTheYear.options}
              />
            </div>
          </Box>
        </Col>
        <Col lg="6">
          <Box>
            <span className="font-size-subtitle-1">
              <Link to="/admin/risks" className="module-link">
                Open vs mitigated vs accepted vs escalated risks
              </Link>
            </span>
            <div
              className="chart-area"
              style={{
                minHeight: "180px",
              }}
            >
              <ImsLineChart
                data={dataSet.risksByStatus.data}
                options={dataSet.risksByStatus.options}
              />
              {/* <Line
                  data={dataSet.risksByStatus.data}
                  options={dataSet.risksByStatus.options}
                /> */}
            </div>
          </Box>
        </Col>
        {HoS ? (
          <Col md="6" className="me-auto">
            <Box minHeight={272}>
              <span className="font-size-subtitle-1 mb-4">
                <Link to="/admin/risks" className="module-link">
                  Risks overview
                </Link>
              </span>
              <Row>
                <Col xs="12">
                  <Row>
                    <Col lg="12" className="mb-3">
                      <h4 className="font-size-subtitle-1">
                        Total risks{" "}
                        {dataSet.risksOverview.totalRisksInThisSystemDates}
                      </h4>
                    </Col>
                    {/* <Col lg="12" className="mt-3">
                        <Row>
                          <Col xs="9">
                            <h3 className="ml-4 mb-1 font-size-subtitle-2 text-center mb-2">
                              Total risks within the current System Dates
                            </h3>
                          </Col>
                        </Row>
                      </Col> */}
                    <Col lg="6" className="mb-3 text-warning">
                      <Row>
                        <Col xs="3">
                          <div className="info-icon text-center icon-danger">
                            <i className="ims-icons-20 icon-icon-info-24" />
                          </div>
                        </Col>
                        <Col xs="9">
                          <div className="numbers">
                            <p className="font-size-subtitle-1 text-warning">
                              Open{" "}
                              {
                                dataSet.risksOverview
                                  .totalOpenedRisksInThisMonth
                              }
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="6" className="mb-3 text-success">
                      <Row>
                        <Col xs="3">
                          <div className="info-icon text-center icon-danger">
                            <i className="ims-icons-20 icon-icon-info-24" />
                          </div>
                        </Col>
                        <Col xs="9">
                          <div className="numbers">
                            <p className="font-size-subtitle-1 text-success">
                              Mitigated{" "}
                              {
                                dataSet.risksOverview
                                  .totalMitigatedRisksInThisMonth
                              }
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="6" className="mb-3  text-danger">
                      <Row>
                        <Col xs="3">
                          <div className="info-icon text-center icon-danger">
                            <i className="ims-icons-20 icon-icon-info-24" />
                          </div>
                        </Col>
                        <Col xs="9">
                          <div className="numbers">
                            <p className="font-size-subtitle-1  text-danger">
                              Escalated{" "}
                              {
                                dataSet.risksOverview
                                  .totalEscalatedRisksInThisMonth
                              }
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="6" className="mb-3 text-info">
                      <Row>
                        <Col xs="3">
                          <div className="info-icon text-center icon-danger">
                            <i className="ims-icons-20 icon-icon-info-24" />
                          </div>
                        </Col>
                        <Col xs="9">
                          <div className="numbers">
                            <p className="font-size-subtitle-1 text-info">
                              Accepted{" "}
                              {
                                dataSet.risksOverview
                                  .totalAcceptedRisksInThisMonth
                              }
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Box>
          </Col>
        ) : (
          <Col lg="6">
            <Box>
              <span className="font-size-subtitle-1">
                Business units with the most risks{" "}
              </span>

              <div
                className="chart-area"
                style={{
                  minHeight: "180px",
                }}
              >
                <ImsLineChart
                  data={dataSet.closedRisk.data}
                  options={dataSet.closedRisk.options}
                />
              </div>
            </Box>
          </Col>
        )}
      </Row>
    </React.Fragment>
  );
};

export default RiskManagement;
