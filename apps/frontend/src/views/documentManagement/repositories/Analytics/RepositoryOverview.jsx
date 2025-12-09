import Loading from "@/components/Loader/Loading";
import { Button, Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import { useRepositories } from "../store";
const RepositoryOverview = () => {
  const { overview, isLoadingOverview } = useRepositories();
  let history = useHistory();
  return (
    <div className="content">
      {isLoadingOverview() ? (
        <Loading />
      ) : (
        <React.Fragment>
          <h4 className="ml-2 mb-3">Repositories overview</h4>
          <Row>
            <Col md="3" sm="12">
              <Card
                variant="gradient"
                color="primary"
                style={{
                  minHeight: "400px",
                }}
              >
                <CardBody className="d-flex flex-column justify-content-center align-items-center text-center p-0">
                  <div>
                    <h5>Overall Total</h5>
                    <h1 className="mt-3 text-primary">
                      {overview?.totalDocuments +
                        overview?.totalStandaredOperatingProcedures +
                        overview?.totalPolicies +
                        overview?.totalProcesses +
                        overview?.totalLegal +
                        overview?.totalMiscellaneous}
                    </h1>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="9">
              <Row>
                <Col md="4">
                  <Card
                    variant="light"
                    style={{
                      minHeight: "184px",
                    }}
                  >
                    <CardBody className="d-flex flex-column justify-content-between text-center p-0">
                      <div>
                        <p
                          style={{
                            color: "#152536",
                          }}
                        >
                          Documents
                        </p>
                        <h1
                          style={{
                            color: "#17A2B8",
                          }}
                          className="mt-3"
                        >
                          {overview?.totalDocuments}
                        </h1>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card
                    variant="light"
                    style={{
                      minHeight: "184px",
                    }}
                  >
                    <CardBody className="d-flex flex-column justify-content-between text-center p-0">
                      <div>
                        <p
                          style={{
                            color: "#152536",
                          }}
                        >
                          SOPs
                        </p>
                        <h1
                          style={{
                            color: "#9999ff",
                          }}
                          className="mt-3"
                        >
                          {overview?.totalStandaredOperatingProcedures}
                        </h1>
                        <Button
                          color="link"
                          onClick={() => {
                            history.push(
                              `/admin/document-repositories/document-overview/${"Standard operating procedure"}`
                            );
                          }}
                        >
                          View SOPs
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card
                    variant="light"
                    style={{
                      minHeight: "184px",
                    }}
                  >
                    <CardBody className="d-flex flex-column justify-content-between text-center p-0">
                      <div>
                        <p
                          style={{
                            color: "#152536",
                          }}
                        >
                          Policies
                        </p>
                        <h1
                          style={{
                            color: "#7ebaeb",
                          }}
                          className="mt-3"
                        >
                          {overview?.totalPolicies}
                        </h1>
                        <Button
                          color="link"
                          onClick={() => {
                            history.push(
                              `/admin/document-repositories/document-overview/${"Policy"}`
                            );
                          }}
                        >
                          View policies
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col md="4">
                  <Card
                    variant="light"
                    style={{
                      minHeight: "184px",
                    }}
                  >
                    <CardBody className="d-flex flex-column justify-content-between text-center p-0">
                      <div>
                        <p
                          style={{
                            color: "#152536",
                          }}
                        >
                          Processes
                        </p>
                        <h1
                          style={{
                            color: "#76b3a6",
                          }}
                          className="mt-3"
                        >
                          {overview?.totalProcesses}
                        </h1>
                        <Button
                          color="link"
                          onClick={() => {
                            history.push(
                              `/admin/document-repositories/document-overview/${"Process"}`
                            );
                          }}
                        >
                          View processes
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col md="4">
                  <Card
                    variant="light"
                    style={{
                      minHeight: "184px",
                    }}
                  >
                    <CardBody className="d-flex flex-column justify-content-between text-center p-0">
                      <div>
                        <p
                          style={{
                            color: "#152536",
                          }}
                        >
                          Legal
                        </p>
                        <h1
                          style={{
                            color: "#fed141",
                          }}
                          className="mt-3"
                        >
                          {overview?.totalLegal}
                        </h1>
                        <Button
                          color="link"
                          onClick={() => {
                            history.push(
                              `/admin/document-repositories/document-overview/${"Legal"}`
                            );
                          }}
                        >
                          View legal documents
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card
                    variant="light"
                    style={{
                      minHeight: "184px",
                    }}
                  >
                    <CardBody className="d-flex flex-column justify-content-between text-center p-0">
                      <div>
                        <p
                          style={{
                            color: "#152536",
                          }}
                        >
                          Miscellaneous
                        </p>
                        <h1
                          style={{
                            color: "#ccad6b",
                          }}
                          className="mt-3"
                        >
                          {overview?.totalMiscellaneous}
                        </h1>
                        <Button
                          color="link"
                          onClick={() => {
                            history.push(
                              `/admin/document-repositories/document-overview/${"Miscellaneous"}`
                            );
                          }}
                        >
                          View Miscellaneous
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </React.Fragment>
      )}
    </div>
  );
};

export default RepositoryOverview;
