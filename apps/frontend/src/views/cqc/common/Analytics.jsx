import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Progress,
  Row,
  Table,
} from "@ims-systems-00/ims-ui-kit";
import { Pie } from "react-chartjs-2";
import useCQC from "../hooks/useCqc";
const Analytics = ({ dataSet, overview }) => {
  const { getRatingClasses, getComplianceColors } = useCQC();
  return (
    <div className="content">
      <Row>
        <Col md="6" className="mb-4">
          <Table>
            <thead className="text-primary">
              <tr>
                <th>Section</th>
                <th className="text-right">Ratings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="">Safe</th>
                <th
                  className={`${getRatingClasses(
                    overview.safe.rating
                  )} text-right`}
                >
                  {overview.safe.rating}
                </th>
              </tr>
              <tr>
                <th className="">Effective</th>
                <th
                  className={`${getRatingClasses(
                    overview.effective.rating
                  )} text-right`}
                >
                  {overview.effective.rating}
                </th>
              </tr>
              <tr>
                <th className="">Caring</th>
                <th
                  className={`${getRatingClasses(
                    overview.caring.rating
                  )} text-right`}
                >
                  {overview.caring.rating}
                </th>
              </tr>
              <tr>
                <th className="">Responsive</th>
                <th
                  className={`${getRatingClasses(
                    overview.responsive.rating
                  )} text-right`}
                >
                  {overview.responsive.rating}
                </th>
              </tr>
              <tr>
                <th className="">Well Led</th>
                <th
                  className={`${getRatingClasses(
                    overview.wellLed.rating
                  )} text-right`}
                >
                  {overview.wellLed.rating}
                </th>
              </tr>
              <tr>
                <th className="">Overall</th>
                <th
                  className={`${getRatingClasses(
                    overview.overall.rating
                  )} text-right`}
                >
                  {overview.overall.rating}
                </th>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md="6" className="mb-4">
          <Table>
            <thead className="text-primary">
              <tr>
                <th>Section</th>
                <th className="text-center">Progress</th>
                <th className="text-right">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="">Safe</th>
                <th className="">
                  <Progress
                    color={getComplianceColors(
                      overview.safe.compliancePercentage
                    )}
                    value={overview.safe.compliancePercentage}
                  />
                </th>
                <th
                  className={getComplianceColors(
                    overview.safe.compliancePercentage,
                    "text-component"
                  )}
                >{`${overview.safe.compliancePercentage}%`}</th>
              </tr>
              <tr>
                <th className="">Effective</th>
                <th className="">
                  <Progress
                    color={getComplianceColors(
                      overview.effective.compliancePercentage
                    )}
                    value={overview.effective.compliancePercentage}
                  />
                </th>
                <th
                  className={getComplianceColors(
                    overview.effective.compliancePercentage,
                    "text-component"
                  )}
                >{`${overview.effective.compliancePercentage}%`}</th>
              </tr>
              <tr>
                <th className="">Caring</th>
                <th className="">
                  <Progress
                    color={getComplianceColors(
                      overview.caring.compliancePercentage
                    )}
                    value={overview.caring.compliancePercentage}
                  />
                </th>
                <th
                  className={getComplianceColors(
                    overview.caring.compliancePercentage,
                    "text-component"
                  )}
                >{`${overview.caring.compliancePercentage}%`}</th>
              </tr>
              <tr>
                <th className="">Responsive</th>
                <th className="">
                  <Progress
                    color={getComplianceColors(
                      overview.responsive.compliancePercentage
                    )}
                    value={overview.responsive.compliancePercentage}
                  />
                </th>
                <th
                  className={getComplianceColors(
                    overview.responsive.compliancePercentage,
                    "text-component"
                  )}
                >{`${overview.responsive.compliancePercentage}%`}</th>
              </tr>
              <tr>
                <th className="">Well Led</th>
                <th className="">
                  <Progress
                    color={getComplianceColors(
                      overview.wellLed.compliancePercentage
                    )}
                    value={overview.wellLed.compliancePercentage}
                  />
                </th>
                <th
                  className={getComplianceColors(
                    overview.wellLed.compliancePercentage,
                    "text-component"
                  )}
                >{`${overview.wellLed.compliancePercentage}%`}</th>
              </tr>
              <tr>
                <th className="">Overall</th>
                <th className="">
                  <Progress
                    color={getComplianceColors(
                      overview.overall.compliancePercentage
                    )}
                    value={overview.overall.compliancePercentage}
                  />
                </th>
                <th
                  className={getComplianceColors(
                    overview.overall.compliancePercentage,
                    "text-component"
                  )}
                >{`${overview.overall.compliancePercentage}%`}</th>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md="6">
          <h4 className="text-primary">Complaints Overview</h4>
          <Card className="card-chart card-chart-pie">
            <CardHeader>
              <h5 className="card-category">
                Open complaints vs closed complaints
              </h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="6">
                  <div className="chart-area">
                    <Pie
                      data={dataSet.complaintsOpenVsSignOff.data}
                      options={dataSet.complaintsOpenVsSignOff.options}
                    />
                  </div>
                </Col>
                <Col md="6">
                  <CardTitle tag="h4">
                    <i className="tim-icons icon-alert-circle-exc text-success" />{" "}
                    Open complaints {dataSet.complaints.open}
                  </CardTitle>
                  <p className="category">
                    Signed off complaints {dataSet.complaints.signedOff}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <h4 className="text-primary">Significant event Overview</h4>
          <Card className="card-chart card-chart-pie">
            <CardHeader>
              <h5 className="card-category">
                Open significant event vs closed significant event
              </h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="6">
                  <div className="chart-area">
                    <Pie
                      data={dataSet.SignificantEventsOpenVsSignOff.data}
                      options={dataSet.SignificantEventsOpenVsSignOff.options}
                    />
                  </div>
                </Col>
                <Col md="6">
                  <CardTitle tag="h4">
                    <i className="tim-icons icon-alert-circle-exc text-success" />{" "}
                    Open significant event {dataSet.significantEvents.open}
                  </CardTitle>
                  <p className="category">
                    Signed off significant event{" "}
                    {dataSet.significantEvents.signedOff}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <h4 className="text-primary">Whistleblowing Overview</h4>
          <Card className="card-chart card-chart-pie">
            <CardHeader>
              <h5 className="card-category">
                Open Whistleblowings vs closed Whistleblowings
              </h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="6">
                  <div className="chart-area">
                    <Pie
                      data={dataSet.whistleBlowsVsSignOff.data}
                      options={dataSet.whistleBlowsVsSignOff.options}
                    />
                  </div>
                </Col>
                <Col md="6">
                  <CardTitle tag="h4">
                    <i className="tim-icons icon-alert-circle-exc text-success" />{" "}
                    Open Whistleblowings {dataSet.whistleBlows.open}
                  </CardTitle>
                  <p className="category">
                    Signed off Whistleblowings {dataSet.whistleBlows.signedOff}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <h4 className="text-primary">Safeguarding Overview</h4>
          <Card className="card-chart card-chart-pie">
            <CardHeader>
              <h5 className="card-category">
                Open safeguarding vs closed safeguarding
              </h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="6">
                  <div className="chart-area">
                    <Pie
                      data={dataSet.SafeGuardingsVsSignOff.data}
                      options={dataSet.SafeGuardingsVsSignOff.options}
                    />
                  </div>
                </Col>
                <Col md="6">
                  <CardTitle tag="h4">
                    <i className="tim-icons icon-alert-circle-exc text-success" />{" "}
                    Open safeguarding {dataSet.safeGuardings.open}
                  </CardTitle>
                  <p className="category">
                    Signed off safeguarding {dataSet.safeGuardings.signedOff}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
