// import Box from "@/components/Box/Index";
import classNames from "classnames";
import {
  Row,
  Col,
  DrawerOpener,
  PopoverBody,
  UncontrolledPopover,
  Button,
  Table,
} from "@ims-systems-00/ims-ui-kit";
import greetingBottomDown from "@/assets/img/greeting-bottom-down.svg";
import topRightGraphic from "@/assets/img/dashboard-card-top-graphics.png";
import addIcon from "@/assets/img/add-button.svg";
import arrowIcon from "@/assets/img/arrow-button.svg";
import threeDotRoundIcon from "@/assets/img/three-dot-round.svg";
import squareThreeDot from "@/assets/img/square-three-dot.svg";
import building from "@/assets/img/Buildings.png";
import clipboard from "@/assets/img/ClipboardText.png";
import usersIcon from "@/assets/img/Users.png";
import StaffRemoteList from "../shared/dashboardComponents/StaffRemoteList";
import coimgSoon from "@/assets/img/dashboard-placeholder.svg";
import useDashboardStore from "../store/useDashboardStore";
import Loading from "@/components/Loader/IMSLoading";
import { useApplication } from "@/stores/applicationStore";
import moment from "moment";
import greetings from "@/utils/getGreetings";
import { useTask } from "@/views/taskManagement/store";
import { Link } from "react-router-dom";
import useUsers from "@/hooks/useUsers";
import { useEffect } from "react";
import StaffList from "../shared/dashboardComponents/StaffList";
import Box from "../shared/dashboardComponents/Box";
import IconContainerSquare from "../shared/dashboardComponents/IconContainerSquare";
import { truncate } from "@/utils/truncate";
import USER_ACTIONS from "@/views/taskManagement/actions";
import DigitalMaturityBar from "../shared/dashboardComponents/DigitalMaturity/DigitalMaturityBar";
import NavigationTabs from "@/components/NavigationTabs";
import NonConformitiesBox from "./components/non-conformities-box";
import ConformitiesBox from "./components/conformities-box";
import IncidentManagementBox from "./components/incident-management-box";
import AuditProgressBox from "./components/audit-progress-box";
import RiskManagementBox from "./components/risk-management-box";
import StatusVsBox from "./components/status-vs-box";
import AssetsExpenditureBox from "./components/assets-expenditure-amount";
import BusinessUnitsChart from "./components/business-units-chart";
import LegendItem from "./components/legend-item";
import VerticalChart from "./components/vertical-chart";
import SupplierManagementBox from "./components/supplier-management-box";
import ProcurementValueBox from "./components/procurement-value-box";
import SupplierIncidentsBox from "./components/supplier-incidents-box";
import ContinualImprovementBox from "./components/continual-improvement-box";
import CrmBox from "./components/crm-box";
import ContractValuesChart from "./components/contract-values-chart";
import InvoiceChart from "./components/invoice-chart";
import InteractionOverview from "./components/interaction-overview";
import IncidentManagementBar from "./components/incident-management-bar";
import Skeleton from "./Skeleton";
import AssetsExpenditureAmount from "./components/assets-expenditure-amount";
import AssetsExpenditureCost from "./components/assets-expenditure-cost";
import { MdOutlineDataExploration } from "react-icons/md";
import VerticalChartCrm from "./components/vertical-chart-crm";

const OrganizationalDashboardNew = () => {
  const {
    globalStats,
    isGlobalStatsLoading,
    digitalMaturity,
    isDigitalMaturityLoading,
    complianceStats,
    isComplianceStatsLoading,
    auditStats,
    isAuditStatsLoading,
    riskStats,
    isRiskStatsLoading,
    incidentStats,
    isIncidentStatsLoading,
    inventoryStats,
    isInventoryStatsLoading,
    supplierStats,
    isSupplierStatsLoading,
    cipStats,
    isCipStatsLoading,
    crmStats,
    isCrmStatsLoading,
  } = useDashboardStore();
  const { tokenPair } = useApplication();
  const {
    handleCompleteTask,
    alert,
    warningWithConfirmMessage,
    handleDeleteTask,
    setTask,
    processing,
    todoLists,
  } = useTask();

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

  // Dynamically generate tabs from digitalMaturity data
  const digitalMaturityTabs = (digitalMaturity || []).map((bu) => ({
    id: bu.businessUnitId,
    text: bu.businessUnit,
    component: (
      <Box padding={2} height="270px" className="overflow-y-scroll w-100">
        {Object.entries(bu.percentages).map(([key, value]) => (
          <DigitalMaturityBar
            key={key}
            label={key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
            value={value}
          />
        ))}
      </Box>
    ),
  }));

  if (!digitalMaturityTabs.length) {
    digitalMaturityTabs.push({
      id: "no-data",
      text: "No Data",
      component: (
        <Box padding={2} height="320px" className="overflow-y-scroll w-100">
          <div className="p-4 text-center text-muted">No data</div>
        </Box>
      ),
    });
  }

  const topBusinessFunctions = riskStats?.topBusinessFunctionsWithRisks || {
    businessFunctionNames: [],
    totalRisks: [],
  };
  const businessUnitsChartData = (
    topBusinessFunctions.businessFunctionNames || []
  ).map((name, i) => ({
    name,
    pv: topBusinessFunctions.totalRisks?.[i] ?? 0,
  }));

  return (
    <>
      {alert}

      <div className="dashboard-new">
        {/* greeting section */}

        <Row className="g-4 ">
          {isGlobalStatsLoading ? (
            <Col md={8}>
              <Skeleton width="100%" height="205px" />
            </Col>
          ) : (
            <Col md={8}>
              <Box
                height="205px"
                className="overflow-hidden position-relative "
              >
                <div className="d-flex flex-column justify-content-between h-100 ">
                  <div>
                    <h3>
                      {" "}
                      {greetings()} {tokenPair?.accessTokenData?.user?.name}{" "}
                    </h3>
                    <p className="text-muted mt-2 fs-5">
                      Accurate as of{" "}
                      {globalStats?.accurateAs
                        ? moment(globalStats.accurateAs).format(
                            "DD-MM-YYYY HH:mm"
                          )
                        : ""}
                    </p>
                  </div>
                  <div className="d-flex align-items-start gap-4">
                    <div className="d-flex flex-column gap-1">
                      <span className=" fs-5">{globalStats?.criticalArea}</span>

                      <span>
                        {" "}
                        <i class="text-danger fa-solid fa-circle me-2"></i>{" "}
                        Critical area
                      </span>
                    </div>
                    <div className="vr my-2" />
                    <div className="d-flex flex-column gap-1">
                      <span className=" fs-5">
                        {globalStats?.organizationalState}
                      </span>
                      <span>
                        {" "}
                        <i class="text-warning fa-solid fa-circle me-2"></i>{" "}
                        Organizational State
                      </span>
                    </div>
                  </div>
                </div>
                <img
                  src={greetingBottomDown}
                  alt="greeting-bottom-down"
                  className="position-absolute bottom-0 end-0"
                />
              </Box>
            </Col>
          )}
          {isGlobalStatsLoading ? (
            <Col md={2}>
              <Skeleton width="100%" height="205px" />
            </Col>
          ) : (
            <Col md={2}>
              <Box height="205px" className="position-relative">
                {/* <h3 className="text-center">Business Unit</h3> */}

                <img
                  src={topRightGraphic}
                  alt="top-right-graphic"
                  className="position-absolute top-0 end-0"
                />

                <div className="d-flex flex-column justify-content-between h-100">
                  <IconContainerSquare className="rounded-3">
                    <img src={building} alt="business-unit" />
                  </IconContainerSquare>
                  <div className="">
                    <h3>{globalStats?.businessUnit}</h3>
                    <p>Business Unit</p>
                  </div>
                </div>
              </Box>
            </Col>
          )}

          {isGlobalStatsLoading ? (
            <Col md={2}>
              <Skeleton width="100%" height="205px" />
            </Col>
          ) : (
            <Col md={2}>
              <Box height="205px" className="position-relative">
                <img
                  src={topRightGraphic}
                  alt="top-right-graphic"
                  className="position-absolute top-0 end-0"
                />

                <div className="d-flex flex-column justify-content-between h-100">
                  <IconContainerSquare className="rounded-3">
                    <img src={usersIcon} alt="staff" />
                  </IconContainerSquare>
                  <div>
                    <h3>{globalStats?.numberOfStaffs}</h3>
                    <div className="d-flex justify-content-between ">
                      <p> Staff</p>
                      <StaffList staff={staff} />
                    </div>
                  </div>
                </div>
              </Box>
            </Col>
          )}

          {/* digital maturity section */}
          {isDigitalMaturityLoading ? (
            <Col md={8}>
              <Skeleton width="100%" height="410px" />
            </Col>
          ) : (
            <Col md={8}>
              <Box height="100%">
                <div className=" d-flex justify-content-between align-items-center">
                  <h3 className="fw-bold mb-0">Digital Maturity</h3>
                  <div className="circle-progress">
                    <svg width="48" height="48">
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        fill="none"
                        stroke="#E9F0FB"
                        strokeWidth="4"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        fill="none"
                        stroke="#0052CC"
                        strokeWidth="4"
                        strokeDasharray={138}
                        strokeDashoffset={40}
                      />
                    </svg>
                    <div className="circle-progress-label">
                      14
                      <br />
                      28
                    </div>
                  </div>
                </div>
                <Box
                  maxHeight="310px"
                  padding={0}
                  rounded={0}
                  className="overflow-auto"
                >
                  <Box padding={0} rounded={0} className="  ">
                    <NavigationTabs navigations={digitalMaturityTabs} />
                  </Box>
                </Box>
              </Box>
            </Col>
          )}

          {isGlobalStatsLoading ? (
            <Col md={4}>
              <Skeleton width="100%" height="410px" />
            </Col>
          ) : (
            <Col md={4}>
              <Row className="g-4 ">
                <Col md={6}>
                  <Box height="205px" className="position-relative">
                    <img
                      src={topRightGraphic}
                      alt="top-right-graphic"
                      className="position-absolute top-0 end-0"
                    />

                    <div className="d-flex flex-column justify-content-between h-100">
                      <IconContainerSquare className="rounded-3">
                        <img src={clipboard} alt="staff" />
                      </IconContainerSquare>
                      <div className="">
                        <h3>{globalStats?.complianceBodies}</h3>
                        <p>Compliance Bodies</p>
                      </div>
                    </div>
                  </Box>
                </Col>
                <Col md={6}>
                  <Box height="205px" className="position-relative">
                    <img
                      src={topRightGraphic}
                      alt="top-right-graphic"
                      className="position-absolute top-0 end-0"
                    />

                    <div className="d-flex flex-column justify-content-between h-100">
                      <IconContainerSquare className="rounded-3">
                        <img src={usersIcon} alt="remote-staff" />
                      </IconContainerSquare>
                      <div className="">
                        <h3>{globalStats?.numberOfStaffsRemote}</h3>
                        <div className="d-flex justify-content-between ">
                          <p>Remote Staff</p>
                          <StaffRemoteList staffRemote={staffRemote} />
                        </div>
                      </div>
                    </div>
                  </Box>
                </Col>
                <Col md={12}>
                  <Box height="205px">
                    {/* <h3 className="text-center">Organisational Level</h3> */}
                    <div className="d-flex flex-column justify-content-between h-100">
                      <div className="d-flex flex-column flex-start">
                        <h4 className="fw-bold">
                          {globalStats?.organizationalConfidence}%
                        </h4>
                        <span className="fs-5">Organisation Level</span>
                      </div>
                      {/*  progress bar */}
                      <div className="w-100" style={{ height: 26 }}>
                        <div
                          className="bg-light rounded-pill w-100"
                          style={{ height: 26, position: "relative" }}
                        >
                          <div
                            className="bg-primary rounded-2 h-100"
                            style={{
                              width: `${globalStats?.organizationalConfidence}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Box>
                </Col>
              </Row>
            </Col>
          )}

          {/* todo and average time section */}
          <Col md={8}>
            {processing[USER_ACTIONS.LOAD_TODOLISTS].status ? (
              <Skeleton width="100%" height="532px" />
            ) : (
              <Box className="h-100">
                <div className="d-flex justify-content-between align-items-center position-sticky top-0 bg-white mb-3">
                  <h4>To-do list</h4>
                  <div className="d-flex gap-2">
                    <DrawerOpener drawerId="create-task">
                      <button className="btn-icon">
                        <img src={addIcon} alt="add" />
                      </button>
                    </DrawerOpener>
                    <Link to="/admin/tasks">
                      <button className="btn-icon">
                        <img src={arrowIcon} alt="arrow" />
                      </button>
                    </Link>
                  </div>
                </div>

                {processing[USER_ACTIONS.LOAD_TODOLISTS]?.status && <Loading />}

                {!processing[USER_ACTIONS.LOAD_TODOLISTS]?.status &&
                todoLists.length === 0 ? (
                  <div
                    className="flex-grow-1 d-flex flex-column align-items-center justify-content-center w-100 h-100 gap-4"
                    style={{ minHeight: 200 }}
                  >
                    <MdOutlineDataExploration size={64} color="#0040a3" />
                    <p className="fs-5 mb-0 text-primary">No data available</p>
                  </div>
                ) : (
                  <div className="todo-list overflow-y-scroll">
                    {todoLists.map((item, i) => (
                      <div className="d-flex align-items-center mb-3" key={i}>
                        {/* Date/Time */}
                        <div className="d-flex gap-2 align-items-center">
                          <div className="d-flex flex-column">
                            <span className="day">
                              {moment(item.created.on).format("MMMM DD")}
                            </span>
                            <span className="time">
                              {moment(item.created.on).format("hh:mm A")}
                            </span>
                          </div>
                        </div>

                        {/* Main content */}
                        <div className="bg-secondary-extra-light flex-grow-1 d-flex align-items-center justify-content-between bg-gray-700 rounded-3 px-4 py-3 ms-3">
                          <span className="fs-5 text-secondary">
                            {truncate(item.name, 45)}
                          </span>

                          <div className="d-flex gap-2 align-items-center">
                            <DrawerOpener drawerId="task-detail">
                              <button
                                className="fs-5 text-secondary btn btn-link border-0 py-1 px-2"
                                onClick={(e) => {
                                  setTask(item);
                                }}
                              >
                                View Details
                              </button>
                            </DrawerOpener>
                            <UncontrolledPopover
                              placement="bottom"
                              trigger="hover"
                              target={`task-dropdown-${item?._id}`}
                            >
                              <PopoverBody
                                style={{
                                  minWidth: "200px",
                                }}
                                className="shadow rounded p-0 border"
                              >
                                <div className="px-3 pt-3">
                                  <Table borderless className="table-sm">
                                    <tbody className="pb-0">
                                      <tr>
                                        <td>Reference</td>
                                        <td>{item.reference}</td>
                                      </tr>
                                      <tr>
                                        <td>Title</td>
                                        <td>{item.name}</td>
                                      </tr>
                                      <tr>
                                        <td>Owner</td>
                                        <td>{item?.created?.by?.name}</td>
                                      </tr>
                                      <tr>
                                        <td>Date</td>
                                        <td>
                                          {moment(item.created.on).format(
                                            "MMMM DD, YYYY hh:mm A"
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </div>
                                <hr />
                                <div className="px-3 pb-3 d-flex justify-content-between">
                                  <div>
                                    <DrawerOpener drawerId="edit-task-form">
                                      <Button
                                        size="sm"
                                        outline
                                        className="border-0 rounded"
                                        onClick={(e) => {
                                          setTask(item);
                                        }}
                                      >
                                        <i className="ims-icons-20 icon-icon-pencil-24"></i>
                                      </Button>
                                    </DrawerOpener>
                                    <Button
                                      size="sm"
                                      outline
                                      color="danger"
                                      className="border-0 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        warningWithConfirmMessage(
                                          "This task will be deleted",
                                          async () => {
                                            await handleDeleteTask(item?._id);
                                            window.location.reload();
                                          }
                                        );
                                      }}
                                    >
                                      <i className="ims-icons-20 icon-icon-trash-24"></i>
                                    </Button>
                                  </div>
                                  <div>
                                    <Button
                                      size="sm"
                                      outline
                                      color="primary"
                                      className="rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        warningWithConfirmMessage(
                                          "This task will be completed. No one else will be able to amend it later",
                                          async () => {
                                            await handleCompleteTask(item?._id);
                                            window.location.reload();
                                            // await loadTodoLists();
                                          }
                                        );
                                      }}
                                    >
                                      Complete Task
                                    </Button>
                                  </div>
                                </div>
                              </PopoverBody>
                            </UncontrolledPopover>
                            <button
                              className="btn-icon btn-more"
                              id={`task-dropdown-${item?._id}`}
                            >
                              <img
                                src={threeDotRoundIcon}
                                alt="three-dot-round"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Box>
            )}
          </Col>

          {/* average resolution time section */}
          <Col md={4}>
            {isGlobalStatsLoading ? (
              <Skeleton width="100%" height="532px" />
            ) : (
              <Box height="532px" className="d-flex flex-column">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>Average Resolution time</h4>
                  <button className="btn-icon">
                    <img src={squareThreeDot} alt="menu" />
                  </button>
                </div>
                {/* Resolution time cards */}
                <div className="flex-grow-1 d-flex flex-column gap-3">
                  {Object.entries(
                    globalStats?.incidentResolutionTimes || {}
                  ).map(([key, value], idx) => (
                    <div
                      key={idx}
                      className="bg-secondary-extra-light rounded-3 px-4 py-3 d-flex   "
                    >
                      <Box
                        className={`bg-${
                          value.alert ? "danger" : "success"
                        } me-3`}
                        padding={0}
                        width={2}
                        rounded={3}
                      />

                      <div>
                        <p
                          className="text-secondary mb-2 fs-5"
                          style={{ fontWeight: 500 }}
                        >
                          Resolution time {key}
                        </p>
                        <h4
                          className={`fw-bold fs-5 text-${
                            value.alert ? "danger" : "success"
                          }`}
                          style={{ letterSpacing: 1 }}
                        >
                          {value.time}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </Box>
            )}
          </Col>

          {/* non-conformities section */}
          <Col md={8}>
            {isAuditStatsLoading ? (
              <Skeleton width="100%" height="205px" />
            ) : (
              <NonConformitiesBox stats={auditStats} />
            )}
          </Col>

          {/* conformities section */}
          <Col md={4}>
            {isComplianceStatsLoading ? (
              <Skeleton width="100%" height="205px" />
            ) : (
              <ConformitiesBox stats={complianceStats} />
            )}
          </Col>

          {/* incident management section */}
          <Col md={8}>
            {isIncidentStatsLoading ? (
              <Skeleton width="100%" height="500px" />
            ) : (
              <IncidentManagementBox
                incidentStats={incidentStats?.incidentStats}
              />
            )}
          </Col>

          {/* audit progress section */}
          <Col md={4}>
            {isAuditStatsLoading ? (
              <Skeleton width="100%" height="500px" />
            ) : (
              <AuditProgressBox stats={auditStats} />
            )}
          </Col>

          {/* risk management section */}
          <Col md={12}>
            {isRiskStatsLoading ? (
              <Skeleton width="100%" height="205px" />
            ) : (
              <RiskManagementBox riskByType={riskStats?.riskByType} />
            )}
          </Col>

          {/* status vs risk section */}
          <Col md={8}>
            {isRiskStatsLoading ? (
              <Skeleton width="100%" height="205px" />
            ) : (
              <StatusVsBox riskByStatus={riskStats?.riskByStatus} />
            )}
          </Col>

          {/* assets expenditure amount section */}
          <Col md={4}>
            {isInventoryStatsLoading ? (
              <Skeleton width="100%" height="205px" />
            ) : (
              <AssetsExpenditureAmount stats={inventoryStats} />
            )}
          </Col>

          {/* business units with the most risks section */}
          <Col md={8}>
            {isRiskStatsLoading ? (
              <Skeleton width="100%" height="205px" />
            ) : (
              <Box
                height={`100%`}
                minHeight={`205px`}
                border="none"
                className="position-relative"
              >
                <div className=" d-flex flex-column gap-4">
                  <div className=" d-flex flex-column " style={{ gap: "12px" }}>
                    <p className=" fs-5">Business units with the most risks</p>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <BusinessUnitsChart data={businessUnitsChartData} />
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <LegendItem color="#0040A3" label="Accepted" />
                    </div>
                  </div>
                </div>
              </Box>
            )}
          </Col>

          {/* assets expenditure cost section */}
          <Col md={4}>
            {isInventoryStatsLoading ? (
              <Skeleton width="100%" height="205px" />
            ) : (
              <AssetsExpenditureCost stats={inventoryStats} />
            )}
          </Col>

          {/* supplier management section */}
          <Col md={8}>
            <Row>
              <Col md={7}>
                {isSupplierStatsLoading ? (
                  <Skeleton width="100%" height="205px" />
                ) : (
                  <SupplierManagementBox stats={supplierStats} />
                )}
              </Col>
              <Col md={5}>
                {isSupplierStatsLoading ? (
                  <Skeleton width="100%" height="205px" />
                ) : (
                  <ProcurementValueBox stats={supplierStats} />
                )}
              </Col>
            </Row>
          </Col>

          {/* supplier incidents section */}
          <Col md={4}>
            {isSupplierStatsLoading ? (
              <Skeleton width="100%" height="205px" />
            ) : (
              <SupplierIncidentsBox stats={supplierStats} />
            )}
          </Col>

          {/* continual improvement section */}
          <Col md={12}>
            {isCipStatsLoading ? (
              <Skeleton width="100%" height="205px" />
            ) : (
              <ContinualImprovementBox stats={cipStats?.cipStats} />
            )}
          </Col>

          {/*  need to further deployment  */}
          {isCrmStatsLoading ? (
            <Col md={8}>
              <Skeleton width="100%" height="205px" />
            </Col>
          ) : (
            <Col md={8}>
              {/* <CrmBox /> */}
              <CrmBox stats={crmStats?.crmStats} />
            </Col>
          )}

          {isCrmStatsLoading ? (
            <Col md={4}>
              <Skeleton width="100%" height="205px" />
            </Col>
          ) : (
            <Col md={4}>
              <Box height={`100%`} border="none" className="position-relative">
                <div className=" d-flex flex-column gap-4">
                  <div className=" d-flex align-items-center justify-content-between gap-4">
                    <p className=" fs-5">Number of customers</p>
                    <div className="d-flex align-items-center justify-content-between gap-1">
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "2px",
                          background: "#0040A3",
                        }}
                      ></div>
                      <p style={{ fontSize: "12px" }}>Customers</p>
                    </div>
                  </div>

                  <VerticalChartCrm stats={crmStats?.crmStats} />
                </div>
              </Box>
            </Col>
          )}

          {/* <Col md={7}>
            <Box
              height={`100%`}
              minHeight={`205px`}
              border="none"
              className="position-relative"
            >
              <div className=" d-flex flex-column gap-4">
                <div className=" d-flex align-items-center justify-content-between gap-4">
                  <h4>Contract values</h4>
                  <LegendItem
                    color="#0040A3"
                    label="Amount"
                    className="justify-content-between"
                  />
                </div>

                <Row>
                  <Col md={7}>
                    <ContractValuesChart />
                  </Col>
                  <Col md={5}>
                    <div className=" h-100 d-flex flex-column align-items-center justify-content-center gap-2">
                      <p className="fs-5">Demo one</p>
                      <p className="fs-5">Demo one</p>
                      <p className="fs-5">Demo one</p>
                      <p className="fs-5">Demo one</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Box>
          </Col> */}

          {isCrmStatsLoading ? (
            <Col md={12}>
              <Skeleton width="100%" height="205px" />
            </Col>
          ) : (
            <Col md={12}>
              <Box
                height={`100%`}
                minHeight={`205px`}
                border="none"
                className="position-relative"
              >
                <div className=" d-flex flex-column gap-4">
                  <div className=" d-flex flex-column gap-3">
                    <div className="d-flex align-items-center justify-content-between gap-4">
                      <h4>Invoice</h4>
                    </div>
                  </div>
                  <Row>
                    <Col md={6}>
                      <InvoiceChart
                        title="Number of invoices"
                        stats={crmStats?.crmStats?.invoiceStatsByMonth}
                        dataKey="invoiceCount"
                      />
                    </Col>
                    <Col md={6}>
                      <InvoiceChart
                        title="Invoice Amount"
                        stats={crmStats?.crmStats?.invoiceStatsByMonth}
                        dataKey="totalAmount"
                      />
                    </Col>
                  </Row>
                </div>
              </Box>
            </Col>
          )}
          {/* <Col md={12}>
            <InteractionOverview />
          </Col>
          <Col md={12}>
            <Box
              height={`100%`}
              minHeight={`205px`}
              border="none"
              className="position-relative"
            >
              <div className=" d-flex flex-column gap-4">
                <div className=" d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-between gap-4">
                    <h4>CRM</h4>
                  </div>
                  <p className=" fs-5">Interaction conducted last 12 months</p>
                </div>

                <IncidentManagementBar />
              </div>
            </Box>
          </Col> */}
        </Row>
      </div>
    </>
  );
};

export default OrganizationalDashboardNew;
