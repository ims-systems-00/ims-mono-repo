// nodejs library that concatenates classes
// react plugin used to create charts
import { Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";

import Loading from "@/components/Loader/IMSLoading";
import DigitalMaturity from "../shared/DigitalMaturity";
import Greetings from "../shared/Greetings";

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
import OrgState from "../shared/dashboardComponents/OrgState";
import RiskManagement from "../shared/dashboardComponents/RiskManagement";
import SupplierManagement from "../shared/dashboardComponents/SupplierManagement";
import TaskManagement from "../shared/dashboardComponents/TaskManagement";
import { useDashboard } from "../store";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import React from "react";
import useAccess from "@/hooks/useAccess";
import { TaskContextProvider } from "@/views/taskManagement/store";
import ManagementReview from "../shared/dashboardComponents/ManagementReview";
import authCompliance from "@/utils/complianceAuthCheck";
import useUsers from "@/hooks/useUsers";
import { useEffect } from "react";
import { getCurrentSessionData } from "@/services/authService";
import Box from "@/components/Box/Index";
const Dashboard = () => {
  let {
    processing,
    dataSetHOS: dataSet,
    bigChartData,
    changeRiskDataTab,
    getComplianceColors,
  } = useDashboard();
  let { authUser } = useAccess();
  const { users, lazyLoadUsers } = useUsers();
  useEffect(() => {
    lazyLoadUsers();
  }, []);
  const getBusinessUnitUsers = users?.filter((user) =>
    user.accessPolicies.some(
      (policy) =>
        policy.group === getCurrentSessionData()?.user?.current?.group?._id
    )
  );
  const staff = getBusinessUnitUsers?.filter(
    (user) =>
      user.emailVerified?.status === "varified" && user.type === "Internal"
  );
  const staffRemote = getBusinessUnitUsers?.filter(
    (user) =>
      user.type === "Internal" &&
      user.emailVerified?.status === "varified" &&
      user.workPlace === "Remote"
  );
  return (
    <>
      {processing[USER_ACTIONS.LOAD_HOS_DASHBOARD].status ? (
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
          <div className="content">
            <Row>
              {/* Scrollable list of left */}
              <Col className="dashboard-scroll" xl="9">
                <Greetings data={dataSet} />
                <DashboardCarousel
                  dataSet={dataSet}
                  HoS={true}
                  staff={staff}
                  staffRemote={staffRemote}
                />
                <Row>
                  <Col xl={4}>
                    <CriticalArea dataSet={dataSet} />
                    <OrgState dataSet={dataSet} />
                  </Col>

                  <Col xl={8}>
                    <Box minHeight={320}>
                      <DigitalMaturity
                        digitalMaturity={dataSet.digitalMaturity}
                        digitalMaturityScore={dataSet.digitalMaturityScore}
                      />
                    </Box>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    {authUser(authCompliance()) && (
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
                      <IncidentManagement dataSet={dataSet} HoS={true} />
                    </Col>
                  )}
                </Row>

                {authUser({
                  service: IMS_SERVICES.AUDIT,
                  action: ACTIONS.READ,
                  effect: EFFECTS.ALLOW,
                }) && <AuditInspection dataSet={dataSet} HoS={true} />}
                {authUser({
                  service: IMS_SERVICES.RISK_MANAGEMENT,
                  action: ACTIONS.READ,
                  effect: EFFECTS.ALLOW,
                }) && (
                  <RiskManagement
                    dataSet={dataSet}
                    bigChartData={bigChartData}
                    changeRiskDataTab={changeRiskDataTab}
                    HoS={true}
                  />
                )}
                {authUser({
                  service: IMS_SERVICES.INVENTORY,
                  action: ACTIONS.READ,
                  effect: EFFECTS.ALLOW,
                }) && <InventoryManagement dataSet={dataSet} HoS={true} />}
                {authUser({
                  service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
                  action: ACTIONS.READ,
                  effect: EFFECTS.ALLOW,
                }) && <SupplierManagement dataSet={dataSet} />}
                {authUser({
                  service: IMS_SERVICES.CONTINUAL_IMPROVEMENT_PLAN,
                  action: ACTIONS.READ,
                  effect: EFFECTS.ALLOW,
                }) && <CIPManagement dataSet={dataSet} HoS={true} />}

                {authUser({
                  service: IMS_SERVICES.CRM,
                  action: ACTIONS.READ,
                  effect: EFFECTS.ALLOW,
                }) && <CRMManagement dataSet={dataSet} />}
              </Col>
              <Col xl="3">
                <Card className="quick-access-box border-0 rounded-3">
                  <CardBody className="d-flex flex-column justify-content-between">
                    {authUser({
                      service: IMS_SERVICES.TASK_MANAGER,
                      action: ACTIONS.READ,
                      effect: EFFECTS.ALLOW,
                    }) && (
                      <TaskContextProvider>
                        <TaskManagement dataSet={dataSet} />
                      </TaskContextProvider>
                    )}
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
        )
      )}
    </>
  );
};

export default Dashboard;
