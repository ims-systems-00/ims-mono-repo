import classNames from "classnames";
import Box from "@/components/Box/Index";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { truncate } from "@/utils/truncate";

const InteractionAnalytics = ({ interactions }) => {
  let [interactionDuration, setInteractionDuration] = React.useState("Weekly");
  return (
    <Row>
      <Col xs="12">
        <Box>
          <Row className="mb-2">
            <Col className="text-left" sm="6">
              <h4>{interactionDuration} interaction overview</h4>
            </Col>
            <Col sm="6">
              <Button
                size="sm"
                color="primary"
                outline
                className={classNames("inline-block mx-2 pull-right", {
                  active: interactionDuration === "Weekly",
                })}
                onClick={() => setInteractionDuration("Weekly")}
              >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                  Weekly
                </span>
                <span className="d-block d-sm-none">
                  <i className="fas fa-server" />
                </span>
              </Button>
              <Button
                size="sm"
                color="primary"
                outline
                className={classNames("inline-block pull-right", {
                  active: interactionDuration === "Monthly",
                })}
                onClick={() => setInteractionDuration("Monthly")}
              >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                  Monthly
                </span>
                <span className="d-block d-sm-none">
                  <i className="tim-icons icon-laptop" />
                </span>
              </Button>
            </Col>
          </Row>
          {interactionDuration === "Weekly" ? (
            <Row>
              <Col xl="5">
                <Row>
                  <Col lg="12" md="12">
                    <div style={{ height: "195px" }}>
                      <div className="">
                        <i class="fa-solid fa-circle text-primary me-3"></i>{" "}
                        Total interaction
                      </div>
                      <hr />
                      <Row>
                        <Col xs="10">
                          <div className="numbers">
                            <h1>{interactions.weekly?.totalInteractions}</h1>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col lg="12" md="12">
                    <div style={{ height: "195px" }}>
                      <div className="">
                        <i class="fa-solid fa-circle text-danger me-3"></i>{" "}
                        <span className="mx-2">Customer engaged</span>
                      </div>
                      <hr />
                      <Row>
                        <Col xs="10">
                          <div className="numbers">
                            <h1>{interactions.weekly?.customersEngaged}</h1>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xl="7">
                <Card>
                  <span className="card-category font-size-subtitle-2">
                    Top customers engaged
                  </span>
                  <CardBody>
                    <Table>
                      <thead className="text-primary">
                        <tr key={"1"}>
                          <th className="">Customer name</th>
                          <th className="text-right">Number of interactions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {interactions.weekly?.topCustomersEngaged.map(
                          (interaction) => (
                            <tr key={interaction._id}>
                              <td className="">
                                {truncate(interaction.name, 13)}
                              </td>
                              <td className=" text-right">
                                {interaction.interactionCount}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col xl="5">
                <Row>
                  <Col lg="12" md="12">
                    <Card style={{ height: "195px" }}>
                      <CardBody>
                        <div className="">
                          <i
                            style={{
                              width: "8px",
                              height: "8px",
                            }}
                            class="fa-solid fa-circle text-primary me-3"
                          ></i>{" "}
                          Total interaction
                        </div>
                        <hr />

                        <CardBody>
                          <Row>
                            <Col xs="10">
                              <div className="numbers">
                                <h1>
                                  {interactions.monthly?.totalInteractions}
                                </h1>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col lg="12" md="12">
                    <Card style={{ height: "195px" }}>
                      <CardBody>
                        <div className="">
                          <i
                            style={{
                              width: "8px",
                              height: "8px",
                            }}
                            class="fa-solid fa-circle text-danger me-3"
                          ></i>{" "}
                          Customer engaged
                        </div>
                        <hr />
                        <CardBody>
                          <Row>
                            <Col xs="10">
                              <div className="numbers">
                                <h1>
                                  {interactions.monthly?.customersEngaged}
                                </h1>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col xl="7">
                <Card>
                  <CardHeader>
                    <span className="card-category">Top customers engaged</span>
                  </CardHeader>
                  <CardBody>
                    <Table>
                      <thead className="text-primary">
                        <tr key={"1"}>
                          <th className="">Customer name</th>
                          <th className="text-right">Number of interactions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {interactions.monthly?.topCustomersEngaged.map(
                          (interaction) => (
                            <tr key={interaction._id}>
                              <td className="">
                                {truncate(interaction.name, 13)}
                              </td>
                              <td className=" text-right">
                                {interaction.interactionCount}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </Box>
      </Col>
    </Row>
  );
};

export default InteractionAnalytics;
{
}
