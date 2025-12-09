import Loading from "@/components/Loader/Loading";
import ImsBarChart from "@/components/charts/ImsBarChart";
import useAccess from "@/hooks/useAccess";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  DrawerRight,
  ImsCarousel,
  Modal,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { useClipboard } from "@ims-systems-00/ims-react-hooks";
import React from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { useApplication } from "@/stores/applicationStore";
import imspartnershipbadge from "../../assets/img/ims-partnership-badge.png";
import OrganisationsTable from "./OrganisationsTable";
import { usePartnershipDB } from "./store";

const Partnership = () => {
  const { currentUserData, tokenPair, switchIntoOrganisation } =
    useApplication();
  const user = currentUserData;
  const { authUser, entityAccessControl } = useAccess();
  const { partnershipAnalytics, organisation } = usePartnershipDB();
  const history = useHistory();
  const {
    copyPlainTextToClipBoard: copyPartnerCodeToClipBoard,
    copySuccess: copyCodeSuccess,
  } = useClipboard();
  const {
    copyPlainTextToClipBoard: copyPartnerLinkToClipBoard,
    copySuccess: copyLinkSuccess,
  } = useClipboard();

  // shift from end

  const partnershiplink =
    process.env.REACT_APP_CLIENT_URL +
    "/auth/onboard/organisation?partnerCode=" +
    tokenPair?.accessTokenData?.user?.partnershipProgramId;

  return (
    <div className="content px-0 bg-light">
      {!tokenPair.accessTokenData.user.partnershipProgramId ? (
        <Card className="rounded-3 shadow-sm border mx-5">
          <CardBody>
            <p>
              You are not a iMS Systems partner.{" "}
              <Link to="/auth/onboard/partner">
                Join iMS partnership programme.
              </Link>
            </p>
          </CardBody>
        </Card>
      ) : (
        <React.Fragment>
          {!organisation ? (
            <Loading />
          ) : (
            <Container>
              <Row>
                <Col md="4" lg="4">
                  <Card className="rounded-3 shadow-sm border">
                    <CardBody>
                      <div>
                        <img
                          className="d-block mx-auto"
                          alt="..."
                          src={imspartnershipbadge}
                        />
                      </div>
                      <h4 className="text-dark text-center font-weight-bold p-1">
                        iMS Technologies
                      </h4>
                      <p className="text-primary text-center mb-3">
                        Official partner
                      </p>
                      <p>Partner code</p>
                      <div className="border border-opacity-50 rounded-3 my-2 p-4">
                        <span className="text-primary">
                          {
                            tokenPair?.accessTokenData?.user
                              ?.partnershipProgramId
                          }
                        </span>
                        <Button
                          onClick={() =>
                            copyPartnerCodeToClipBoard(
                              tokenPair?.accessTokenData?.user
                                ?.partnershipProgramId
                            )
                          }
                          size="sm"
                          block
                          className="border-0 mt-3"
                        >
                          Copy partner code{" "}
                          {copyCodeSuccess ? (
                            <i className="ims-icons-20 icon-icon-check-24" />
                          ) : (
                            <i className="ims-icons-20 icon-icon-copy-24" />
                          )}
                        </Button>
                      </div>
                      <p>Signup url with partner code</p>
                      <div className="border border-opacity-50 rounded-3 my-2 p-4">
                        <span className="text-primary">{partnershiplink}</span>
                        <Button
                          onClick={() =>
                            copyPartnerLinkToClipBoard(partnershiplink)
                          }
                          size="sm"
                          block
                          className="border-0 mt-3"
                        >
                          Copy sign-up link with partner code{" "}
                          {copyLinkSuccess ? (
                            <i className="ims-icons-20 icon-icon-check-24" />
                          ) : (
                            <i className="ims-icons-20 icon-icon-copy-24" />
                          )}
                        </Button>
                        <Button
                          onClick={() => window.open(partnershiplink)}
                          size="sm"
                          block
                          color="primary"
                          className="border-0 m-0 mt-2"
                        >
                          Create an iMS with partner code{" "}
                          <i className="ims-icons-20 icon-icon-arrowright-24" />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="8">
                  <Row>
                    <Col md="12" className="p-2 d-flex justify-content-between">
                      <div>
                        <h3 className="font-weight-bold">
                          Partnership dashboard
                        </h3>
                      </div>
                      {(authUser({
                        service: IMS_SERVICES.USERS,
                        action: ACTIONS.CREATE,
                        effect: EFFECTS.ALLOW,
                      }) ||
                        user?._id === currentUserData?._id) && (
                        <div className="float-right">
                          <Button
                            color="primary"
                            size="md"
                            className="shadow-sm--hover"
                            onClick={() =>
                              history.push(
                                `/admin/users/${currentUserData._id}`
                              )
                            }
                          >
                            <i className="ims-icons-20 icon-icon-user-24" /> My
                            profile
                          </Button>
                          <Button
                            color="primary"
                            outline
                            size="md"
                            className="shadow-sm--hover"
                            onClick={() => history.push("/admin/organisation")}
                          >
                            <i className="ims-icons-20 icon-icon-users-24" />{" "}
                            Organisation(s)
                          </Button>
                        </div>
                      )}
                    </Col>
                    <Col md="12">
                      <ImsCarousel slidesPerView={3} navigation>
                        <Card className="card-stats py-3 px-2 rounded-3">
                          <CardBody>
                            <Row>
                              <Col xs="5">
                                <div className="info-icon text-center icon-warning">
                                  <i className="ims-icons-20 icon-icon-buildings-24" />
                                </div>
                              </Col>
                              <Col xs="7">
                                <div className="numbers">
                                  <p className="card-category">Organisations</p>
                                  <CardTitle tag="h3">
                                    {partnershipAnalytics?.organisations}
                                  </CardTitle>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        <Card className="card-stats py-3 px-2 rounded-3">
                          <CardBody>
                            <Row>
                              <Col xs="5">
                                <div className="info-icon text-center icon-primary">
                                  <i className="ims-icons-20 icon-icon-users-24" />
                                </div>
                              </Col>
                              <Col xs="7">
                                <div className="numbers">
                                  <p className="card-category">
                                    Business units
                                  </p>
                                  <CardTitle tag="h3">
                                    {partnershipAnalytics?.totalAllocatedGroups}
                                  </CardTitle>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        <Card className="card-stats py-3 px-2 rounded-3">
                          <CardBody>
                            <Row>
                              <Col xs="5">
                                <div className="info-icon text-center icon-success">
                                  <i className="ims-icons-20 icon-icon-user-24" />
                                </div>
                              </Col>
                              <Col xs="7">
                                <div className="numbers">
                                  <p className="card-category">Users</p>
                                  <CardTitle tag="h3">
                                    {partnershipAnalytics?.totalAllocatedUsers}
                                  </CardTitle>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        <Card className="card-stats py-3 px-2 rounded-3">
                          <CardBody>
                            <Row>
                              <Col xs="5">
                                <div className="info-icon text-center icon-danger">
                                  <i className="ims-icons-20 icon-icon-userplus-24" />
                                </div>
                              </Col>
                              <Col xs="7">
                                <div className="numbers">
                                  <p className="card-category">Super users</p>
                                  <CardTitle tag="h3">
                                    {
                                      partnershipAnalytics?.totalAllocatedSuperUsers
                                    }
                                  </CardTitle>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        <Card className="card-stats py-3 px-2 rounded-3">
                          <CardBody>
                            <Row>
                              <Col xs="5">
                                <div className="info-icon text-center icon-primary">
                                  <i className="ims-icons-20 icon-icon-handshake-24" />
                                </div>
                              </Col>
                              <Col xs="7">
                                <div className="numbers">
                                  <p className="card-category">CRM</p>
                                  <CardTitle tag="h3">
                                    {partnershipAnalytics?.additionalModules?.find(
                                      (m) => m._id === "CRM"
                                    )?.count || 0}
                                  </CardTitle>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </ImsCarousel>
                    </Col>
                    <Col md="12">
                      <Card className="rounded-3 shadow-sm border">
                        <CardBody>
                          <div className="chart-area">
                            {partnershipAnalytics && (
                              <ImsBarChart
                                data={partnershipAnalytics?.complianceTools.map(
                                  (data, i) => ({
                                    name: data._id,
                                    count: data.count,
                                  })
                                )}
                                options={{
                                  xKey: "name",
                                  barKeys: ["count"],
                                  colors: ["#439EED"],
                                  width: 570,
                                  height: 250,
                                }}
                              />
                            )}
                          </div>
                        </CardBody>
                      </Card>
                      <Card className="rounded-3 shadow-sm border">
                        <CardBody>
                          <OrganisationsTable />
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <DrawerRight drawerId="edit-organizaion-form">
                {/* <UserFormContainer /> */}
              </DrawerRight>
            </Container>
          )}
          <Modal title="Profile photo"></Modal>
        </React.Fragment>
      )}
    </div>
  );
};

export default Partnership;
