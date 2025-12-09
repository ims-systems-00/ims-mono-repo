import { getCompliance } from "@/services/complianceToolsServices";
import LOADER from "../actions";
import { getComplianceOverview } from "@/services/complianceToolsServices";
import { mapToISOOverview } from "@/services/complianceToolsServices";
import { imsLogger } from "@/services/loggerService";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import React from "react";
import { IMS_SERVICES } from "@/rolesAndPermissions";

export default function useStore(config) {
  let [environmentalDataTable, setEnvironmentalDataTable] = React.useState([]);
  let [socialDataTable, setSocialDataTable] = React.useState([]);
  let [governanceDataTable, setGovernanceDataTable] = React.useState([]);
  let [environmentalOverview, setEnvironmentalOverview] = React.useState({});
  let [socialOverview, setSocialOverview] = React.useState({});
  let [governanceOverview, setGovernanceOverview] = React.useState({});
  let { processing, dispatch } = useProcessingControl([
    { action: LOADER.LOAD_ENVIRONMENTAL, status: true },
    { action: LOADER.LOAD_SOCIAL, status: true },
    { action: LOADER.LOAD_GOVERNANCE, status: true },
    { action: LOADER.LOAD_SECTION, status: true },
    { action: LOADER.LOAD_ENVIRONMENTAL_OVERVIEW, status: true },
    { action: LOADER.LOAD_SOCIAL_OVERVIEW, status: true },
    { action: LOADER.LOAD_GOVERNANCE_OVERVIEW, status: true },
  ]);

  const [environmentalModalFilter, setEnvironmentalModalFilter] =
    React.useState(false);
  const toggleEnvironmentalModalFilter = () => {
    setEnvironmentalModalFilter(!environmentalModalFilter);
  };
  const [socialModalFilter, setSocialModalFilter] = React.useState(false);
  const toggleSocialModalFilter = () => {
    setSocialModalFilter(!socialModalFilter);
  };
  const [governanceModalFilter, setGovernanceModalFilter] =
    React.useState(false);
  const toggleGovernanceModalFilter = () => {
    setGovernanceModalFilter(!governanceModalFilter);
  };
  const closeSocialModalFilter = () => {
    setSocialModalFilter(false);
  };
  const closeEnvironmentalModalFilter = () => {
    setEnvironmentalModalFilter(false);
  };
  const closeGovernanceModalFilter = () => {
    setGovernanceModalFilter(false);
  };

  let EnvironmentalQueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ESG_ENVIRONMENTAL } },
  });

  let SocialQueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ESG_SOCIAL } },
  });

  let GovernanceQueryTools = useQuery({
    required: { value: { name: IMS_SERVICES.ESG_GOVERNANCE } },
  });

  const fetchEnvironmental = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_ENVIRONMENTAL]: { status: true, error: false, id: null },
      });
      let { data } = await getCompliance({
        query: `${qstr}`,
      });
      setEnvironmentalDataTable(data.compliance);
      EnvironmentalQueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_ENVIRONMENTAL]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_ENVIRONMENTAL]: { status: false, error: true, id: null },
      });
      imsLogger("ESG", ex);
    }
  };

  const fetchEnvironmentalOverview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_ENVIRONMENTAL_OVERVIEW]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ESG_ENVIRONMENTAL),
        getCompliance({
          query: `name=${IMS_SERVICES.ESG_ENVIRONMENTAL}&page=1&size=20&clause[in][]=1&clause[in][]=1.1&clause[in][]=1.2&clause[in][]=1.3&clause[in][]=1.4&clause[in][]=1.5&clause[in][]=1.6&clause[in][]=1.7`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setEnvironmentalOverview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_ENVIRONMENTAL_OVERVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_ENVIRONMENTAL_OVERVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ESG", ex);
    }
  };

  const fetchSocial = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_SOCIAL]: { status: true, error: false, id: null },
      });
      let { data } = await getCompliance({
        query: `${qstr}`,
      });
      setSocialDataTable(data.compliance);
      SocialQueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_SOCIAL]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_SOCIAL]: { status: false, error: true, id: null },
      });
      imsLogger("ESG", ex);
    }
  };

  const fetchSocialOverview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_SOCIAL_OVERVIEW]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ESG_SOCIAL),
        getCompliance({
          query: `name=${IMS_SERVICES.ESG_SOCIAL}&page=1&size=20&clause[in][]=2&clause[in][]=2.1&clause[in][]=2.2&clause[in][]=2.3&clause[in][]=2.4&clause[in][]=2.5&clause[in][]=2.6&clause[in][]=2.7&clause[in][]=2.8`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setSocialOverview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_SOCIAL_OVERVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_SOCIAL_OVERVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ESG", ex);
    }
  };

  const fetchGovernance = async (qstr) => {
    try {
      dispatch({
        [LOADER.LOAD_GOVERNANCE]: { status: true, error: false, id: null },
      });
      let { data } = await getCompliance({
        query: `${qstr}`,
      });
      setGovernanceDataTable(data.compliance);
      GovernanceQueryTools.updatePagination(data.pagination);
      dispatch({
        [LOADER.LOAD_GOVERNANCE]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_GOVERNANCE]: { status: false, error: true, id: null },
      });
      imsLogger("ESG", ex);
    }
  };

  const fetchGovernanceOverview = async () => {
    try {
      dispatch({
        [LOADER.LOAD_GOVERNANCE_OVERVIEW]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let [overviewResponse, sections] = await Promise.all([
        getComplianceOverview(IMS_SERVICES.ESG_GOVERNANCE),
        getCompliance({
          query: `name=${IMS_SERVICES.ESG_GOVERNANCE}&page=1&size=20&clause[in][]=3&clause[in][]=3.1&clause[in][]=3.2&clause[in][]=3.3&clause[in][]=3.4&clause[in][]=3.5&clause[in][]=3.6&clause[in][]=3.7`,
        }),
      ]);
      let mapedData = mapToISOOverview(overviewResponse.data.overview);
      setGovernanceOverview({
        overall: mapedData,
        controls: sections.data.compliance,
      });
      dispatch({
        [LOADER.LOAD_GOVERNANCE_OVERVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [LOADER.LOAD_GOVERNANCE_OVERVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ESG", ex);
    }
  };

  let updateEnvironmentalDataTable = () => {
    fetchEnvironmentalOverview();
    fetchEnvironmental(EnvironmentalQueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      fetchEnvironmentalOverview();
      await fetchEnvironmental(EnvironmentalQueryTools.getQuery());
      closeEnvironmentalModalFilter();
    })();
  }, [EnvironmentalQueryTools.query]);

  let updateSocialDataTable = () => {
    fetchSocialOverview();
    fetchSocial(SocialQueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      fetchSocialOverview();
      await fetchSocial(SocialQueryTools.getQuery());
      closeSocialModalFilter();
    })();
  }, [SocialQueryTools.query]);

  let updateGovernanceDataTable = () => {
    fetchGovernanceOverview();
    fetchGovernance(GovernanceQueryTools.getQuery());
  };

  React.useEffect(() => {
    (async function () {
      fetchGovernanceOverview();
      await fetchGovernance(GovernanceQueryTools.getQuery());
      closeGovernanceModalFilter();
    })();
  }, [GovernanceQueryTools.query]);

  return {
    processing,
    environmentalOverview,
    socialOverview,
    governanceOverview,
    environmentalDataTable,
    setEnvironmentalDataTable,
    socialDataTable,
    setSocialDataTable,
    governanceDataTable,
    setGovernanceDataTable,
    updateEnvironmentalDataTable,
    updateGovernanceDataTable,
    updateSocialDataTable,
    EnvironmentalQueryTools,
    SocialQueryTools,
    GovernanceQueryTools,
    fetchEnvironmental,
    fetchSocial,
    fetchGovernance,
    socialModalFilter,
    environmentalModalFilter,
    governanceModalFilter,
    toggleEnvironmentalModalFilter,
    toggleGovernanceModalFilter,
    toggleSocialModalFilter,
  };
}
