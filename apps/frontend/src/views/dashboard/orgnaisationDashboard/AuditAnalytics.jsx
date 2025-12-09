import React from "react";
import { Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "@ims-systems-00/ims-ui-kit";

const AuditAnalytics = ({
  nonConformitiesVsConformities,
  nonConformities,
  sheduledAuditVsCompletedAudit,
  audits,
}) => {
  return (
    <Row>
      <Col className="ml-auto" md="6">
        <Card className="card-chart card-chart-pie shadow">
          <CardHeader>
            <span className="card-category font-size-subtitle-1">
              <Link to="/admin/audits/internal" className="module-link">
                Business unit with the most non-conformities
              </Link>
            </span>
          </CardHeader>

          <CardBody>
            <Row>
              <Col xs="6">
                <div className="chart-area">
                  <Pie
                    data={nonConformitiesVsConformities.data}
                    options={nonConformitiesVsConformities.options}
                  />
                </div>
              </Col>
              <Col xs="6">
                <CardTitle tag="h4">
                  <i className="tim-icons icon-trophy text-success" /> Top
                  business units
                </CardTitle>
                <p className="category">
                  {nonConformities.businessFunctionNames[0]}{" "}
                  {nonConformities.amount[0]}
                </p>
                <p className="category">
                  {nonConformities.businessFunctionNames[1]}{" "}
                  {nonConformities.amount[1]}
                </p>
                <p className="category">
                  {nonConformities.businessFunctionNames[2]}{" "}
                  {nonConformities.amount[2]}
                </p>
                <p className="category">
                  {nonConformities.businessFunctionNames[3]}{" "}
                  {nonConformities.amount[3]}
                </p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col className="me-auto" md="6">
        <Card className="card-chart card-chart-pie shadow">
          <CardHeader>
            <span className="card-category font-size-subtitle-1">
              <Link to="/admin/audits/internal" className="module-link">
                Audits
              </Link>
            </span>
          </CardHeader>

          <CardBody>
            <Row>
              <Col xs="6">
                <div className="chart-area">
                  <Pie
                    data={sheduledAuditVsCompletedAudit.data}
                    options={sheduledAuditVsCompletedAudit.options}
                  />
                </div>
              </Col>
              <Col xs="6">
                <CardTitle tag="h4">
                  <i className="tim-icons icon-trophy text-success" /> Completed{" "}
                  {audits.completed}
                </CardTitle>
                <p className="category">Scheduled {audits.inCompleted}</p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AuditAnalytics;
