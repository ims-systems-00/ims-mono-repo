import useAccess from "@/hooks/useAccess";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
} from "@ims-systems-00/ims-ui-kit";
import { Bar, HorizontalBar, Line } from "react-chartjs-2";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { numberFormatter } from "@/utils/inputFormats";
import InteractionAnalytics from "../InteractionAnalytics";
import { useCRM } from "../store";
import USER_ACTIONS from "../actions";
import Loading from "@/components/Loader/Loading";

const MyCustomerOverview = () => {
  let { dataSet, overview, processing } = useCRM();
  let { authUser } = useAccess();
  let averageValue = (customers) => {
    let average = customers.find((customer) => customer._id.stage === "Live");
    return average ? numberFormatter(average.contractValue / average.count) : 0;
  };
  let totalLiveContractValue = (customers) => {
    let totalValue = customers.find(
      (customer) => customer._id.stage === "Live"
    );
    return totalValue ? numberFormatter(totalValue.contractValue) : 0;
  };
  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_OVERVIEW].status ? (
        <Loading />
      ) : (
        <React.Fragment>
          {authUser({
            service: IMS_SERVICES.CRM,
            action: ACTIONS.READ,
            effect: EFFECTS.ALLOW,
          }) &&
          overview &&
          overview.customerAnalysis.length ? (
            <>
              {dataSet && (
                <React.Fragment>
                  <h4 className="ml-2">Customer overview</h4>
                  <Row>
                    <Col md="3">
                      <Card className="card-stats">
                        <CardHeader>
                          <div className="">Contract started this month</div>
                          <hr />
                        </CardHeader>
                        <CardBody>
                          <Row>
                            <Col xs="2">
                              <div className="info-icon text-center icon-primary">
                                <i className="ims-icons-20 icon-icon-play-24"></i>
                              </div>
                            </Col>
                            <Col xs="10">
                              <div className="numbers">
                                <p className="card-category">Number</p>
                                <CardTitle tag="h4">
                                  {overview.contractStartedThisMonth}
                                </CardTitle>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="3">
                      <Card className="card-stats">
                        <CardHeader>
                          <div className="">Contract ending this month</div>
                          <hr />
                        </CardHeader>
                        <CardBody>
                          <Row>
                            <Col xs="2">
                              <div className="info-icon text-center icon-danger">
                                <i className="ims-icons-20 icon-icon-stop-24"></i>
                              </div>
                            </Col>
                            <Col xs="10">
                              <div className="numbers">
                                <p className="card-category">Number</p>
                                <CardTitle tag="h4">
                                  {overview.contractEndingThisMonth}
                                </CardTitle>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="3">
                      <Card className="card-stats">
                        <CardHeader>
                          <div className="">Contract review this month</div>
                          <hr />
                        </CardHeader>
                        <CardBody>
                          <Row>
                            <Col xs="2">
                              <div className="info-icon text-center icon-warning">
                                <i className="ims-icons-20 icon-icon-review-24"></i>
                              </div>
                            </Col>
                            <Col xs="10">
                              <div className="numbers">
                                <p className="card-category">Number</p>
                                <CardTitle tag="h4">
                                  {overview.contractReviewThisMonth}
                                </CardTitle>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="3">
                      <Card className="card-stats">
                        <CardHeader>
                          <div className="">Highest contract value</div>
                          <hr />
                        </CardHeader>
                        <CardBody>
                          <Row>
                            <Col xs="2">
                              <div className="info-icon text-center icon-success">
                                <i className="ims-icons-20 icon-icon-trophy-24"></i>
                              </div>
                            </Col>
                            <Col xs="10">
                              <div className="numbers">
                                <p className="card-category font-size-subtitle-1">
                                  {overview.highestValueCustomer.name}-{" "}
                                  <span className="text-secondary font-size-subtitle-2">
                                    {overview.highestValueCustomer.stage}
                                  </span>
                                </p>
                                <CardTitle tag="h4">
                                  £
                                  {numberFormatter(
                                    overview.highestValueCustomer.value
                                  )}{" "}
                                </CardTitle>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg="12">
                      <h4 className="ml-2">Live customers</h4>
                      <Row>
                        <Col md="3">
                          <Card className="card-stats">
                            <CardHeader>
                              <div className="">Total contract value</div>
                              <hr />
                            </CardHeader>
                            <CardBody>
                              <Row>
                                <Col xs="2">
                                  <div className="info-icon text-center icon-info">
                                    <i className="ims-icons-20 icon-icon-hexagon-24"></i>
                                  </div>
                                </Col>
                                <Col xs="10">
                                  <div className="numbers">
                                    <p className="card-category">Amount</p>
                                    <CardTitle tag="h4">
                                      £
                                      {totalLiveContractValue(
                                        overview.customerAnalysis
                                      )}
                                    </CardTitle>
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="3">
                          <Card className="card-stats">
                            <CardHeader>
                              <div className="">Highest contract value</div>
                              <hr />
                            </CardHeader>
                            <CardBody>
                              <Row>
                                <Col xs="2">
                                  <div className="info-icon text-center icon-success">
                                    <i className="ims-icons-20 icon-icon-trophy-24"></i>
                                  </div>
                                </Col>
                                <Col xs="10">
                                  <div className="numbers">
                                    <p className="card-category">
                                      {overview.mostValuedLiveCustomer.name}
                                    </p>
                                    <CardTitle tag="h4">
                                      £
                                      {numberFormatter(
                                        overview.mostValuedLiveCustomer.value
                                      )}
                                    </CardTitle>
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="3">
                          <Card className="card-stats">
                            <CardHeader>
                              <div className="">Average contract value</div>
                              <hr />
                            </CardHeader>
                            <CardBody>
                              <Row>
                                <Col xs="2">
                                  <div className="info-icon text-center icon-info">
                                    <i className="ims-icons-20 icon-icon-record-24"></i>
                                  </div>
                                </Col>
                                <Col xs="10">
                                  <div className="numbers">
                                    <p className="card-category">Amount</p>
                                    <CardTitle tag="h4">
                                      £{averageValue(overview.customerAnalysis)}
                                    </CardTitle>
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="3">
                          <Card className="card-stats">
                            <CardHeader>
                              <div className="">Lowest contract value</div>
                              <hr />
                            </CardHeader>
                            <CardBody>
                              <Row>
                                <Col xs="2">
                                  <div className="info-icon text-center icon-danger">
                                    <i className="ims-icons-20 icon-icon-caretcircledown-24"></i>
                                  </div>
                                </Col>
                                <Col xs="10">
                                  <div className="numbers">
                                    <p className="card-category">
                                      {overview.lessValuedLiveCustomer.name}
                                    </p>
                                    <CardTitle tag="h4">
                                      £
                                      {numberFormatter(
                                        overview.lessValuedLiveCustomer.value
                                      )}
                                    </CardTitle>
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col lg="3"></Col>
                      </Row>
                    </Col>
                    <Col lg="6">
                      <Card className="card-chart">
                        <CardHeader>
                          <span className="card-category font-size-subtitle-2">
                            Contract values
                          </span>
                        </CardHeader>
                        <CardBody>
                          <div className="chart-area">
                            <HorizontalBar
                              data={dataSet.crmContractValue.data}
                              options={dataSet.crmContractValue.options}
                            />
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg="6">
                      {overview.customerAnalysis && (
                        <Col md="12">
                          <Table>
                            <thead className="text-primary">
                              <tr>
                                <th>Category</th>
                                <th className="text-right">
                                  Number of customers
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {overview.customerAnalysis.map((analysis) => (
                                <tr key={analysis._id.stage}>
                                  <td className="">{analysis._id.stage}</td>
                                  <td className="text-right">
                                    {analysis.count}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      )}
                    </Col>

                    <Col lg="6">
                      <Card className="card-chart">
                        <CardHeader>
                          <span className="card-category text-center font-size-subtitle-2">
                            Number of invoices this month
                          </span>
                        </CardHeader>
                        <CardBody>
                          <div className="chart-area">
                            <Bar
                              data={dataSet.crmInvoicesCount.data}
                              options={dataSet.crmInvoicesCount.options}
                            />
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg="6">
                      <Card className="card-chart">
                        <CardHeader>
                          <span className="card-category text-center font-size-subtitle-2">
                            Invoiced this month
                          </span>
                        </CardHeader>
                        <CardBody>
                          <div className="chart-area">
                            <HorizontalBar
                              data={dataSet.crmInvoicesAmount.data}
                              options={dataSet.crmInvoicesAmount.options}
                            />
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="12">
                      <InteractionAnalytics
                        interactions={overview.interactions}
                      />
                    </Col>
                    <Col lg="12">
                      <h4 className="ml-2">Email campaign</h4>
                      <Row>
                        <Col md="6">
                          <Row>
                            <Col md="6">
                              <Card className="card-stats">
                                <CardHeader>
                                  <div className="">Active campaign</div>
                                  <hr />
                                </CardHeader>
                                <CardBody>
                                  <Row>
                                    <Col xs="2">
                                      <div className="info-icon text-center icon-info">
                                        <i className="ims-icons-20 icon-icon-intersect-24"></i>
                                      </div>
                                    </Col>
                                    <Col xs="10">
                                      <div className="numbers">
                                        <p className="card-category">Number</p>
                                        <CardTitle tag="h4">
                                          {overview.activeCampaign}
                                        </CardTitle>
                                      </div>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                            <Col md="6">
                              <Card className="card-stats">
                                <CardHeader>
                                  <div className="">Closed campaign</div>
                                  <hr />
                                </CardHeader>
                                <CardBody>
                                  <Row>
                                    <Col xs="2">
                                      <div className="info-icon text-center icon-danger">
                                        <i className="ims-icons-20 icon-icon-stop-24"></i>
                                      </div>
                                    </Col>
                                    <Col xs="10">
                                      <div className="numbers">
                                        <p className="card-category">Number</p>
                                        <CardTitle tag="h4">
                                          {overview.closedCampaign}
                                        </CardTitle>
                                      </div>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                            <Col md="12">
                              <Card className="card-stats">
                                <CardHeader>
                                  <div className="">Latest campaign</div>
                                  <hr />
                                </CardHeader>
                                <CardBody>
                                  <Row>
                                    <Col xs="2">
                                      <div className="info-icon text-center icon-secondary">
                                        <i className="ims-icons-20 icon-latest-campaign-regular"></i>
                                      </div>
                                    </Col>
                                    <Col xs="10">
                                      <div className="numbers">
                                        <p className="card-category">Name</p>
                                        <CardTitle tag="h4">
                                          {overview.latestCampaign}
                                        </CardTitle>
                                      </div>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg="6">
                          <Card className="card-chart">
                            <CardHeader>
                              <span className="card-category font-size-subtitle-2">
                                Campaign conducted last 6 months
                              </span>
                            </CardHeader>
                            <CardBody>
                              <div className="chart-area">
                                <Line
                                  data={dataSet.campaignPerMonth.data}
                                  options={dataSet.campaignPerMonth.options}
                                />
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </React.Fragment>
              )}
            </>
          ) : (
            <h4 className="text-primary text-center">
              You have no analytics at this moment
            </h4>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default MyCustomerOverview;
