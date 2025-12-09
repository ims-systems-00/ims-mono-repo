import {
  Card,
  CardBody,
  Col,
  Progress,
  Row,
  Table,
} from "@ims-systems-00/ims-ui-kit";
import { Pie } from "react-chartjs-2";
import "../../../assets/scss/app/_complaince.scss";
import summaries from "../Summaries";

const Analytics = ({ overview, toolKit }) => {
  return (
    <>
      {toolKit && <div>
        <h4 className="fw-semibold">{toolKit}</h4>
        <div className="mt-4">
          {summaries.find((s) => s.toolKit === toolKit).summary}
        </div>
      </div>}
      <Row className="g-4">
        <Col md="6">
          <Card className="shadow-none rounded-3 h-100">
            <CardBody className="p-3">
              <Row className="g-4">
                <Col md="4">
                  <div className="chart-area">
                    <Pie
                      data={overview?.overall?.ComplianceVsNotCompliance.data}
                      options={{
                        ...overview?.overall?.ComplianceVsNotCompliance.options,
                        cutout: "70%",
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: false },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </Col>
                <Col md="8">
                  <div className="fw-bold text-dark d-flex align-items-center justify-content-between">
                    <p className="h5 fw-semibold card-category mb-2">
                      Overall compliance
                    </p>
                    <Card tag="span" className="p-2 rounded-3 mb-0">
                      <i class="fa-regular fa-clock analytics-clock-icon" />
                    </Card>
                  </div>
                  <div className="mt-4">
                    <p className="mb-3 text-secondary">Compliance Percentage</p>
                    <span className="h2 fw-bold mb-0">
                      {overview?.overall?.compliance}%
                    </span>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="shadow-none rounded-3 h-100">
            <CardBody className="p-3">
              <div className="icon-big text-center">
                <Card tag="span" className="p-2 rounded-3 mb-0">
                  <i className="fas fa-check-circle analytics-card-icon" />
                </Card>
              </div>
              <div className="mt-4">
                <p className="mb-3">Controls selected</p>
                <span className="h2 fw-bold text-dark mb-0">
                  {overview?.overall?.controlsSelected}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="shadow-none rounded-3 h-100">
            <CardBody className="p-3">
              <div className="icon-big text-center">
                <Card tag="span" className="p-2 rounded-3 mb-0">
                  <i className="fas fa-bullseye analytics-card-icon" />
                </Card>
              </div>
              <div className="mt-4">
                <p className="mb-3">Controls implemented</p>
                <span className="h2 fw-bold text-dark mb-0">
                  {overview?.overall?.controlsImplemented}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>

        {overview?.controls && (
          <Col md="12">
            <div className="card rounded-3 h-100 overflow-hidden">
              <Table responsive className="align-middle">
                <thead>
                  <tr>
                    <th className="analytics-section-header">Section</th>
                    <th className="text-center analytics-progress-cell">
                      Progress
                    </th>
                    <th className="text-right analytics-percentage-cell">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {overview?.controls.map((control, index) => (
                    <tr key={control._id}>
                      <td className="fw-medium text-dark">
                        {control?.control?.clause} {control?.control?.title}
                      </td>
                      <td>
                        <Progress
                          value={control?.compliancePercentage}
                          color="primary"
                          className="analytics-progress-bar"
                        />
                      </td>
                      <td className="text-right text-dark">
                        {control?.compliancePercentage ?? 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Analytics;
