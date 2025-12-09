// nodejs library that concatenates classes
// react plugin used to create charts
import { Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";

import Loading from "@/components/Loader/IMSLoading";
import DigitalMaturity from "../shared/DigitalMaturity";
import Greetings from "../shared/Greetings";

import Box from "@/components/Box/Index";
import useAccess from "@/hooks/useAccess";
import useUsers from "@/hooks/useUsers";
import { useEffect } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import USER_ACTIONS from "../actions";
import AuditInspection from "../shared/dashboardComponents/AuditInspection";
import AvgResolutionTime from "../shared/dashboardComponents/AvgResolutionTime";
import CIPManagement from "../shared/dashboardComponents/CIPManagement";
import CRMManagement from "../shared/dashboardComponents/CRMManagement";
import ComplianceManagement from "../shared/dashboardComponents/ComplianceManagement";
import CriticalArea from "../shared/dashboardComponents/CriticalArea";
import DashboardCarousel from "../shared/dashboardComponents/DashboardCarousel";
import IncidentManagement from "../shared/dashboardComponents/IncidentManagement";
import InventoryManagement from "../shared/dashboardComponents/InventoryManagement";
import ManagementReview from "../shared/dashboardComponents/ManagementReview";
import OrgState from "../shared/dashboardComponents/OrgState";
import RiskManagement from "../shared/dashboardComponents/RiskManagement";
import SupplierManagement from "../shared/dashboardComponents/SupplierManagement";
import TaskManagement from "../shared/dashboardComponents/TaskManagement";
import { useDashboard } from "../store";

const Dashboard = () => {
  let {
    processing,
    dataSetSA: dataSet,
    bigChartData,
    changeRiskDataTab,
    getComplianceColors,
    unmappedData,
  } = useDashboard();
  let { authUser, authAdditionalModulesLicense } = useAccess();
  const { users, lazyLoadUsers } = useUsers();
  useEffect(() => {
    lazyLoadUsers();
  }, []);
  const staff = users?.filter(
    (user) =>
      user.emailVerified?.status === "varified" && user.type === "Internal"
  );
  const staffRemote = users?.filter(
    (user) =>
      user.type === "Internal" &&
      user.emailVerified?.status === "varified" &&
      user.workPlace === "Remote"
  );

  return (
    <>
      {processing[USER_ACTIONS.LOAD_SA_DASHBOARD].status ? (
        <div className="content">
          <Row style={{ marginTop: 200 }}>
            <Col xs="4" />{" "}
            <Col xs="4">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <Loading />
                <span className="mt-2">Analysing your data...</span>
              </div>
            </Col>
            <Col xs="4" />
          </Row>
        </div>
      ) : (
        dataSet && (
          <>
            <div className="content">
              <Row>
                <Col className="dashboard-scroll" xl="9">
                  <Greetings data={dataSet} />
                  {/* Top Carousel of Cards */}
                  <DashboardCarousel
                    dataSet={dataSet}
                    staff={staff}
                    staffRemote={staffRemote}
                  />
                  {/* 
              Critical Area, Organisational State, Digital Maturity */}
                  <Row>
                    <Col xl={4} className="mb-2">
                      {/* Critical Area */}
                      <CriticalArea dataSet={dataSet} />
                      {/* Organisational State */}
                      <OrgState dataSet={dataSet} />
                    </Col>
                    {/* Digital Maturity */}
                    <Col xl={8}>
                      <Box minHeight={320}>
                        <DigitalMaturity
                          digitalMaturity={dataSet.digitalMaturity}
                          digitalMaturityScore={dataSet.digitalMaturityScore}
                          unmappedData={unmappedData}
                        />
                      </Box>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      {authUser({
                        service: IMS_SERVICES.COMPLIANCE_TOOL,
                        action: ACTIONS.READ,
                      }) && (
                        <ComplianceManagement
                          dataSet={dataSet}
                          getComplianceColors={getComplianceColors}
                          authUser={authUser}
                        />
                      )}
                    </Col>
                    <Col md="8">
                      {authUser({
                        service: IMS_SERVICES.INCIDENT_MANAGEMENT,
                        action: ACTIONS.READ,
                        effect: EFFECTS.ALLOW,
                      }) && <AvgResolutionTime dataSet={dataSet} />}
                    </Col>
                    {authUser({
                      service: IMS_SERVICES.INCIDENT_MANAGEMENT,
                      action: ACTIONS.READ,
                      effect: EFFECTS.ALLOW,
                    }) && (
                      <Col md="12">
                        <IncidentManagement
                          dataSet={dataSet}
                          unmappedData={unmappedData}
                        />
                      </Col>
                    )}
                  </Row>

                  {authUser({
                    service: IMS_SERVICES.AUDIT,
                    action: ACTIONS.READ,
                    effect: EFFECTS.ALLOW,
                  }) && (
                    <AuditInspection
                      dataSet={dataSet}
                      unmappedData={unmappedData}
                    />
                  )}

                  {/* Risk Management */}
                  {authUser({
                    service: IMS_SERVICES.RISK_MANAGEMENT,
                    action: ACTIONS.READ,
                    effect: EFFECTS.ALLOW,
                  }) && (
                    <RiskManagement
                      unmappedData={unmappedData}
                      dataSet={dataSet}
                      bigChartData={bigChartData}
                      changeRiskDataTab={changeRiskDataTab}
                    />
                  )}
                  {/* Inventory Management */}
                  {authUser({
                    service: IMS_SERVICES.INVENTORY,
                    action: ACTIONS.READ,
                    effect: EFFECTS.ALLOW,
                  }) && (
                    <InventoryManagement
                      dataSet={dataSet}
                      unmappedData={unmappedData}
                    />
                  )}
                  {/* Supplier Management */}
                  {authUser({
                    service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
                    action: ACTIONS.READ,
                    effect: EFFECTS.ALLOW,
                  }) && (
                    <SupplierManagement
                      dataSet={dataSet}
                      unmappedData={unmappedData}
                    />
                  )}

                  {/* Continual Improvement */}
                  {authUser({
                    service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
                    action: ACTIONS.READ,
                    effect: EFFECTS.ALLOW,
                  }) && (
                    <CIPManagement
                      dataSet={dataSet}
                      unmappedData={unmappedData}
                    />
                  )}
                  {/* Compliance */}

                  {/* CRM */}
                  {authAdditionalModulesLicense(IMS_SERVICES.CRM) && (
                    <CRMManagement
                      dataSet={dataSet}
                      unmappedData={unmappedData}
                    />
                  )}
                </Col>
                {/* Todo List on Right */}
                <Col xl="3">
                  <Card className="quick-access-box border-0 rounded-3">
                    <CardBody className="d-flex flex-column justify-content-between">
                      {authUser({
                        service: IMS_SERVICES.TASK_MANAGER,
                        action: ACTIONS.READ,
                        effect: EFFECTS.ALLOW,
                      }) && <TaskManagement dataSet={dataSet} />}
                      {authUser({
                        service: IMS_SERVICES.MANAGEMENT_REVIEW,
                        action: ACTIONS.READ,
                        effect: EFFECTS.ALLOW,
                      }) && <ManagementReview dataSet={dataSet} />}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </>
        )
      )}
    </>
  );
};

export default Dashboard;
