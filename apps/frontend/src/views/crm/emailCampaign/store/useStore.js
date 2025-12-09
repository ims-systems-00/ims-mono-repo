import NotificationContext from "@/contexts/notificationContext";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import * as campaignApi from "@/services/emailCampaignServices";
import USER_ACTIONS from "../actions";
import { imsLogger } from "@/services/loggerService";
import { asynchronously } from "@/utils/asynchronous";
import React from "react";
import useAlerts from "@/hooks/useAlerts";

export default function useStore(config) {
  const id = config.match && config.match.params.id;
  let notify = React.useContext(NotificationContext);
  let [campaigns, setCampaigns] = React.useState([]);
  let [visitingCampaign, setVisitingCampaign] = React.useState(null);
  let [overview, setOverview] = React.useState(null);
  const [lists, setLists] = React.useState([]);
  let { successAlert } = useAlerts();

  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );

  const visitCampaign = (campaign) => {
    setVisitingCampaign(campaign);
    loadOverview(campaign?._id);
    loadRecipients(campaign?._id);
  };

  const addToTable = (campaign) =>
    setCampaigns((prevCampaigns) => [campaign, ...prevCampaigns]);

  let { query, getQuery, updatePagination, ...queryHandlers } =
    useQuery({});

  const fetchCampaigns = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_EMAILS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await campaignApi.getCampaigns({
        query: `${qStr}`,
      });
      setCampaigns(data.campaigns);
      updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_EMAILS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_EMAILS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Email Campaign", ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  async function fetchCampaign() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_EMAIL]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await campaignApi.getCampaign(id);
      visitCampaign(data.campaign);
      _dispatch({
        [USER_ACTIONS.LOAD_EMAIL]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_EMAIL]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("CampaignDetail", ex, ex.response);
    }
  }

  async function loadRecipients(campaignId) {
    _dispatch({
      [USER_ACTIONS.LOAD_RECIPIENTS]: {
        status: true,
        error: false,
        id: null,
      },
    });
    let pageNumber = toolState.pagination.hasNextPage
      ? toolState.pagination.nextPage
      : 1;
    const [loadError, response] = await asynchronously(
      campaignApi.getRecipients(campaignId, {
        query: `page=${pageNumber}`,
      })
    );
    if (loadError) return imsLogger(loadError);
    setLists((prevData) => [...prevData, ...response.data.lists]);
    updatePagination(response.data.pagination);
    _dispatch({
      [USER_ACTIONS.LOAD_RECIPIENTS]: {
        status: false,
        error: false,
        id: null,
      },
    });
  }
  async function loadOverview(campaignId) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_OVERVIEW]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await campaignApi.getCampaignOverview(campaignId);
      setOverview(data.overview);
      _dispatch({
        [USER_ACTIONS.LOAD_OVERVIEW]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_OVERVIEW]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("CampaignDetail", ex, ex.response);
    }
  }

  React.useEffect(() => {
    if (id) {
      fetchCampaign();
    } else {
      fetchCampaigns(getQuery());
    }
  }, [id, query]);

  const deleteCampaign = async (campaign) => {
    const campaignId = campaign._id;
    try {
      _dispatch({
        [USER_ACTIONS.REMOVE_EMAIL]: {
          status: true,
          error: false,
          id: campaignId,
        },
      });
      await campaignApi.deleteCampaign(campaignId);
      setCampaigns((prevCampaigns) =>
        prevCampaigns.filter((campaign) => campaign._id !== campaignId)
      );
      notify("Campaign deleted successfully", "success");
      successAlert("Campaign deleted successfully");
      _dispatch({
        [USER_ACTIONS.REMOVE_EMAIL]: {
          status: false,
          error: false,
          id: campaignId,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.REMOVE_EMAIL]: {
          status: false,
          error: true,
          id: campaignId,
        },
      });
      imsLogger("Campaign", ex.response || ex);
    }
  };

  const createCampaign = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_EMAIL]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await campaignApi.createCampaign(payload);
      notify("Campaign created successfully", "success");
      addToTable && addToTable(data.campaign);
      _dispatch({
        [USER_ACTIONS.CREATE_EMAIL]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.CREATE_EMAIL]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex.response || ex);
      notify("Unknown server error occurred");
    }
  };

  const updateCampaign = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_EMAIL]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await campaignApi.createCampaign(
        payload,
        visitingCampaign
      );
      notify("Campaign modified and saved successfully", "success");
      addToTable && addToTable(data.campaign);
      visitCampaign(data.campaign);
      _dispatch({
        [USER_ACTIONS.AMEND_EMAIL]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_EMAIL]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex.response || ex);
      notify("Unknown server error occurred");
    }
  };

  const closeCampaign = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.CLOSE_CAMPAIGN]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await campaignApi.closeCampaign(visitingCampaign._id, {
        query: `bundle=${visitingCampaign.bundle}`,
      });
      notify("Campaign closed successfully", "success");
      visitCampaign(data.campaign);
      _dispatch({
        [USER_ACTIONS.CLOSE_CAMPAIGN]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.CLOSE_CAMPAIGN]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex.response || ex);
      notify("Unknown server error occurred");
    }
  };

  const saveAndSendCampaign = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.SAVE_AND_SEND_EMAIL]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await campaignApi.createCampaign(payload);
      let sendResponse = await campaignApi.sendCampaign(data.campaign._id);
      notify("Campaign created and saved successfully", "success");
      addToTable && addToTable(sendResponse.data.campaign);
      _dispatch({
        [USER_ACTIONS.SAVE_AND_SEND_EMAIL]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.SAVE_AND_SEND_EMAIL]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex.response || ex);
      notify("Unknown server error occurred");
    }
  };

  const updateAndSendCampaign = async (payload) => {
    try {
      _dispatch({
        [USER_ACTIONS.AMEND_AND_SEND_EMAIL]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await campaignApi.updateCampaign(
        visitingCampaign._id,
        payload
      );
      let sendResponse = await campaignApi.sendCampaign(data.campaign._id);
      notify("Campaign updated and sent successfully", "success");
      visitCampaign(sendResponse.data.campaign);
      _dispatch({
        [USER_ACTIONS.AMEND_AND_SEND_EMAIL]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.AMEND_AND_SEND_EMAIL]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex.response || ex);
      notify("Unknown server error occurred");
    }
  };

  return {
    campaigns,
    processing,
    queryHandlers,
    visitingCampaign,
    visitCampaign,
    deleteCampaign,
    createCampaign,
    updateCampaign,
    closeCampaign,
    saveAndSendCampaign,
    updateAndSendCampaign,
    lists,
    overview,
    loadRecipients,
    fetchCampaigns,
  };
}
