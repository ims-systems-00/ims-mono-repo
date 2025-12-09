import useAccess from "@/hooks/useAccess";
import useProcessingControl from "@/hooks/useProcessingControl";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentSessionData } from "@/services/authService";
import * as cqcApi from "@/services/cqcServices";
import * as dashboardApi from "@/services/dashBoardServices";
import { imsLogger } from "@/services/loggerService";
import { getCurrentUserInfo } from "@/services/userServices";
import USER_ACTIONS from "../actions";
import { useApplication } from "@/stores/applicationStore";
import * as statsApi from "@/services/statsService";
import useQuery from "@/hooks/useQuery";

export default function useDashboardStore(config) {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isGlobalStatsLoading, setIsGlobalStatsLoading] = React.useState(false);
  const [globalStats, setGlobalStats] = React.useState(null);
  const [isDigitalMaturityLoading, setIsDigitalMaturityLoading] =
    React.useState(false);
  const [isComplianceStatsLoading, setIsComplianceStatsLoading] =
    React.useState(false);
  const [complianceStats, setComplianceStats] = React.useState(null);
  const [isAuditStatsLoading, setIsAuditStatsLoading] = React.useState(false);
  const [auditStats, setAuditStats] = React.useState(null);
  const [isRiskStatsLoading, setIsRiskStatsLoading] = React.useState(false);
  const [riskStats, setRiskStats] = React.useState(null);
  const [isIncidentStatsLoading, setIsIncidentStatsLoading] =
    React.useState(false);
  const [incidentStats, setIncidentStats] = React.useState(null);
  const [isInventoryStatsLoading, setIsInventoryStatsLoading] =
    React.useState(false);
  const [inventoryStats, setInventoryStats] = React.useState(null);
  const [isSupplierStatsLoading, setIsSupplierStatsLoading] =
    React.useState(false);
  const [supplierStats, setSupplierStats] = React.useState(null);
  const [isCipStatsLoading, setIsCipStatsLoading] = React.useState(false);
  const [cipStats, setCipStats] = React.useState(null);
  const [isCrmStatsLoading, setIsCrmStatsLoading] = React.useState(false);
  const [crmStats, setCrmStats] = React.useState(null);

  const [digitalMaturity, setDigitalMaturity] = React.useState(null);
  const globalStatsQueyHandler = useQuery();
  const { tokenPair } = useApplication();
  React.useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });
  function canLoadOrgDashboardForUser() {
    /**
     * we are allowing organisational dashboard for a user if he has a role in the system, without
     * being associated with a business unit.
     *
     */
    return (
      authGlobalAccess() ||
      (!tokenPair?.accessTokenData?.user?.groupId &&
        tokenPair?.accessTokenData?.user?.organizationId &&
        tokenPair?.accessTokenData?.user?.role)
    );
  }
  function tick() {
    setCurrentTime(new Date());
  }
  function getRatingClasses(rating) {
    switch (rating) {
      case "Not rated":
        return "";
      case "Inadequate":
        return "text-danger";
      case "Requires improvement":
        return "text-warning";
      case "Good":
        return "text-success";
      case "Outstanding":
        return "text-gold";
      default:
        return "";
    }
  }
  function getComplianceColors(compliancePercentage, type) {
    switch (true) {
      case compliancePercentage < 20:
        return type === "text-component" ? "text-danger text-right" : "red";
      case compliancePercentage < 40:
        return type === "text-component"
          ? "text-primary text-right"
          : "primary";
      case compliancePercentage < 60:
        return type === "text-component"
          ? "text-warning text-right"
          : "warning";
      case compliancePercentage < 80:
        return type === "text-component" ? "text-info text-right" : "info";
      case compliancePercentage <= 100:
        return type === "text-component"
          ? "text-success text-right"
          : "success";
      default:
        return " text-right";
    }
  }
  let { authGlobalAccess } = useAccess(getCurrentUserInfo());
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  //organizational dashboard
  let [dataSetSA, setDataSetSA] = React.useState(null);
  //business function dashboard
  let [unmappedData, setUnMappedData] = React.useState(null);
  let [dataSetHOS, setDataSetHOS] = React.useState(null);
  let [cqcDataSet, setCqcDataSet] = React.useState(null);
  let [CQCoverview, setCQCOverview] = useState(null);
  const [bigChartData, setbigChartData] = React.useState("data5");

  const changeRiskDataTab = (tab) => {
    setbigChartData(tab);
  };
  async function fetchSAdashboardData() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_SA_DASHBOARD]: {
          status: true,
          error: null,
          id: null,
        },
      });
      let { data } = await dashboardApi.loadDashboardData();
      setUnMappedData(data.dashboard);
      let mapedData = dashboardApi.mapToDashBoardSAModel(data.dashboard);
      setDataSetSA(mapedData);
      _dispatch({
        [USER_ACTIONS.LOAD_SA_DASHBOARD]: {
          status: false,
          error: null,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("OrganizationalDashboard", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_SA_DASHBOARD]: {
          status: false,
          error: ex,
          id: null,
        },
      });
    }
  }
  async function fetchCQCOverview() {
    try {
      let { data } = await cqcApi.getRatingOverview("undefined", {
        query: `group=${getCurrentSessionData().user.current.group._id}`,
      });
      let mapedOverviewData = cqcApi.mapToToolOverview(data.overview);
      setCQCOverview(data.overview);
      setCqcDataSet(mapedOverviewData);
    } catch (err) {
      imsLogger("BusinessFunctionDashboard", err);
    }
  }
  async function fetchHOSDashboard() {
    try {
      // setLoading(true);
      _dispatch({
        [USER_ACTIONS.LOAD_HOS_DASHBOARD]: {
          status: true,
          error: null,
          id: null,
        },
      });
      let { data } = await dashboardApi.loadBusinessDashboardData(
        tokenPair?.accessTokenData?.user?.groupId
      );
      let mapedData = dashboardApi.mapToBusinessDashBoardHOSModel(
        data.dashboard
      );
      setDataSetHOS(mapedData);
      // setLoading(false);
      _dispatch({
        [USER_ACTIONS.LOAD_HOS_DASHBOARD]: {
          status: false,
          error: null,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger("BusinessFunctionDashboard", ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_HOS_DASHBOARD]: {
          status: false,
          error: ex,
          id: null,
        },
      });
    }
  }

  async function fetchGlobalStats() {
    try {
      setIsGlobalStatsLoading(true);
      let { data } = await statsApi.getGlobalStats();
      console.log("data", data);
      setGlobalStats(data.stats);
    } catch (ex) {
      imsLogger("GlobalStats", ex, ex.response);
    } finally {
      setIsGlobalStatsLoading(false);
    }
  }
  async function fetchDigitalMaturity() {
    try {
      setIsDigitalMaturityLoading(true);
      let { data } = await statsApi.getDigitalMaturity();
      console.log("data", data);
      setDigitalMaturity(data.stats?.businessUnitMaturity);
    } catch (ex) {
      imsLogger("DigitalMaturity", ex, ex.response);
    } finally {
      setIsDigitalMaturityLoading(false);
    }
  }
  async function fetchComplianceStats() {
    try {
      setIsComplianceStatsLoading(true);
      let { data } = await statsApi.getComplianceStats();
      console.log("data", data);
      setComplianceStats(data.stats);
    } catch (ex) {
      imsLogger("ComplianceStats", ex, ex.response);
    } finally {
      setIsComplianceStatsLoading(false);
    }
  }
  async function fetchAuditStats() {
    try {
      setIsAuditStatsLoading(true);
      let { data } = await statsApi.getAuditStats();
      console.log("data", data);
      setAuditStats(data.stats);
    } catch (ex) {
      imsLogger("AuditStats", ex, ex.response);
    } finally {
      setIsAuditStatsLoading(false);
    }
  }
  async function fetchRiskStats() {
    try {
      setIsRiskStatsLoading(true);
      let { data } = await statsApi.getRiskStats();
      console.log("data", data);
      setRiskStats(data.stats);
    } catch (ex) {
      imsLogger("RiskStats", ex, ex.response);
    } finally {
      setIsRiskStatsLoading(false);
    }
  }
  async function fetchIncidentStats() {
    try {
      setIsIncidentStatsLoading(true);
      let { data } = await statsApi.getIncidentStats();
      console.log("data", data);
      setIncidentStats(data.stats);
    } catch (ex) {
      imsLogger("IncidentStats", ex, ex.response);
    } finally {
      setIsIncidentStatsLoading(false);
    }
  }
  async function fetchInventoryStats() {
    try {
      setIsInventoryStatsLoading(true);
      let { data } = await statsApi.getInventoryStats();
      console.log("data", data);
      setInventoryStats(data.stats);
    } catch (ex) {
      imsLogger("InventoryStats", ex, ex.response);
    } finally {
      setIsInventoryStatsLoading(false);
    }
  }
  async function fetchSupplierStats() {
    try {
      setIsSupplierStatsLoading(true);
      let { data } = await statsApi.getSupplierStats();
      console.log("data", data);
      setSupplierStats(data.stats);
    } catch (ex) {
      imsLogger("SupplierStats", ex, ex.response);
    } finally {
      setIsSupplierStatsLoading(false);
    }
  }
  async function fetchCipStats() {
    try {
      setIsCipStatsLoading(true);
      let { data } = await statsApi.getCipStats();
      console.log("data", data);
      setCipStats(data.stats);
    } catch (ex) {
      imsLogger("CipStats", ex, ex.response);
    } finally {
      setIsCipStatsLoading(false);
    }
  }
  async function fetchCrmStats() {
    try {
      setIsCrmStatsLoading(true);
      let { data } = await statsApi.getCrmStats();
      console.log("data", data);
      setCrmStats(data.stats);
    } catch (ex) {
      imsLogger("CrmStats", ex, ex.response);
    } finally {
      setIsCrmStatsLoading(false);
    }
  }

  React.useEffect(() => {
    if (canLoadOrgDashboardForUser()) {
      fetchSAdashboardData();
    } else {
      fetchHOSDashboard();
      // fetchCQCOverview();
    }
  }, []);

  React.useEffect(() => {
    fetchGlobalStats();
    fetchDigitalMaturity();
    fetchComplianceStats();
    fetchAuditStats();
    fetchRiskStats();
    fetchIncidentStats();
    fetchInventoryStats();
    fetchSupplierStats();
    fetchCipStats();
    fetchCrmStats();
  }, []);

  return {
    dataSetSA,
    dataSetHOS,
    cqcDataSet,
    CQCoverview,
    getRatingClasses,
    getComplianceColors,
    bigChartData,
    processing,
    authGlobalAccess,
    fetchSAdashboardData,
    fetchHOSDashboard,
    fetchCQCOverview,
    currentTime,
    unmappedData,
    changeRiskDataTab,
    canLoadOrgDashboardForUser,
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
  };
}
