import NotificationContext from "@/contexts/notificationContext";
import useAlerts from "@/hooks/useAlerts";
import useProcessingControl from "@/hooks/useProcessingControl";
import React, { useEffect, useState } from "react";
import { imsLogger } from "@/services/loggerService";
import {
  addReportSubscriber,
  deleteReportSubscriber,
  getOrganization,
  getReportSubscriber,
  setSystemDates,
  updateIncidentResolution,
  updateOrganisation,
  changeOrganisationLogo,
  changeOrganisationBanner,
} from "@/services/organizationService";
import { uploadFileToS3 } from "@/services/fileHandlerService";
import { useApplication } from "@/stores/applicationStore";
import USER_ACTIONS from "../actions";
import useQuery from "@/hooks/useQuery";
import { makeLicenseRequest } from "@/services/licensemanagementServices";

export default function useStore() {
  let [organisation, setOrganisation] = React.useState(null);
  let [subscribers, setSubscribers] = React.useState([]);
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  let SubscriberQuery = useQuery();
  let notify = React.useContext(NotificationContext);
  const { currentUserData, tokenPair, refreshMembershipData } =
    useApplication();
  let { successAlert } = useAlerts();
  const loadOrganisation = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_ORGANISATION]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getOrganization(
        tokenPair?.accessTokenData?.user?.organizationId
      );

      setOrganisation(data.organization);
      _dispatch({
        [USER_ACTIONS.LOAD_ORGANISATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.LOAD_ORGANISATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(err);
    }
  };
  const amendOrganisation = async (updatedData) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_ORGANISATION]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await updateOrganisation(
        tokenPair?.accessTokenData?.user?.organizationId,
        updatedData
      );
      notify("Organsiation updated successfully", "success");
      // setOrganisation(data.organization);
      _dispatch({
        [USER_ACTIONS.UPDATE_ORGANISATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.UPDATE_ORGANISATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Failed to update organisation", "danger");
      imsLogger(err || err.message);
    }
  };

  const amendIncidentResolution = async (updatedData) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_RESOLUTION]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await updateIncidentResolution(
        tokenPair?.accessTokenData?.user?.organizationId,
        updatedData
      );
      loadOrganisation();
      notify("Incident resolution updated successfully", "success");
      _dispatch({
        [USER_ACTIONS.UPDATE_RESOLUTION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.UPDATE_RESOLUTION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("ResolutionForm", ex.response, ex);
      notify("Unknown server error occurred", "danger");
    }
  };
  const amendSystemDates = async (updatedData) => {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_SYSTEMDATES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await setSystemDates(
        tokenPair?.accessTokenData?.user?.organizationId,
        updatedData
      );
      notify("System date updated successfully", "success");
      loadOrganisation();
      _dispatch({
        [USER_ACTIONS.UPDATE_SYSTEMDATES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.UPDATE_SYSTEMDATES]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("SystemDates", ex.response, ex);
      notify("Unknown server error occurred", "danger");
    }
  };

  const fetchSubscribers = async (qStr) => {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_SUBSCRIBERS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getReportSubscriber(
        tokenPair?.accessTokenData?.user?.organizationId,
        {
          query: `${qStr}`,
        }
      );
      setSubscribers(data.reportSubscriptions);
      // SubscriberQuery.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_SUBSCRIBERS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.LOAD_SUBSCRIBERS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("SystemDefaults", ex, ex.response);
      notify("Error occurred while fetching users", "danger");
    }
  };

  let deleteSubscription = async (data) => {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_SUBSCRIBER]: {
          status: true,
          error: false,
          id: data._id,
        },
      });
      await deleteReportSubscriber(
        tokenPair?.accessTokenData?.user?.organizationId,
        data._id
      );
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((subscriber) => subscriber._id !== data._id)
      );
      successAlert("Report interval deleted successfully");
      _dispatch({
        [USER_ACTIONS.DELETE_SUBSCRIBER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.DELETE_SUBSCRIBER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("SubscriptionTable", ex);
      notify("Could not delete", "danger");
    }
  };

  let addSubscriber = async (userData) => {
    try {
      _dispatch({
        [USER_ACTIONS.ADD_SUBSCRIBER]: { status: true, error: false, id: null },
      });
      let { data } = await addReportSubscriber(
        tokenPair?.accessTokenData?.user?.organizationId,
        userData
      );
      setSubscribers((prevSubscribers) => [
        data.subscriber,
        ...prevSubscribers,
      ]);
      notify("Report interval successfully scheduled", "success");
    } catch (ex) {
      imsLogger("SubscriptionForm", ex.response || ex);
      notify(ex.response.data.message, "danger");
    }
    _dispatch({
      [USER_ACTIONS.ADD_SUBSCRIBER]: { status: false, error: false, id: null },
    });
  };

  let requestLicense = async (requestData) => {
    try {
      _dispatch({
        [USER_ACTIONS.REQUEST_LICENSE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await makeLicenseRequest(requestData);
      notify("Licenses allocated successfully.", "success");
      refreshMembershipData(tokenPair?.accessTokenData?.user?.membershipId);
      _dispatch({
        [USER_ACTIONS.REQUEST_LICENSE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      _dispatch({
        [USER_ACTIONS.REQUEST_LICENSE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Licence request failed", "danger");
      imsLogger("MakeRequest", ex.response || ex);
    }
  };

  let changeLogo = async (data) => {
    try {
      await changeOrganisationLogo(
        tokenPair?.accessTokenData?.user?.organizationId,
        data
      );
      loadOrganisation();
      notify("Logo updated successfully", "success");
    } catch (ex) {
      notify("Failed to update logo", "danger");
      imsLogger(ex.response || ex);
    }
  };

  let changeOrgLogo = async (file, onProgress) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        },
        public: "ims-systems-public-media-files",
      };

      // First upload the file to S3
      const { data } = await uploadFileToS3(file, "logo", config);

      // Then update the organization with the new logo
      await changeOrganisationLogo(
        tokenPair?.accessTokenData?.user?.organizationId,
        { logometadata: data.uploadInformation }
      );

      loadOrganisation();
      notify("Logo updated successfully", "success");
      return true;
    } catch (ex) {
      notify("Failed to update logo", "danger");
      imsLogger(ex.response || ex);
      return false;
    }
  };

  let changeOrgBanner = async (file, onProgress) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        },
        public: "ims-systems-public-media-files",
      };

      // First upload the file to S3
      const { data } = await uploadFileToS3(file, "banner", config);
      console.log(data);

      // Then update the organization with the new banner
      await changeOrganisationBanner(
        tokenPair?.accessTokenData?.user?.organizationId,
        { logoRectangleMetadata: data.uploadInformation }
      );

      loadOrganisation();
      notify("Banner updated successfully", "success");
      return true;
    } catch (ex) {
      notify("Failed to update banner", "danger");
      imsLogger(ex.response || ex);
      return false;
    }
  };

  useEffect(() => {
    loadOrganisation();
  }, []);
  useEffect(() => {
    fetchSubscribers(SubscriberQuery.getQuery());
  }, [SubscriberQuery.query]);

  return {
    processing,
    organisation,
    amendOrganisation,
    amendIncidentResolution,
    amendSystemDates,
    subscribers,
    fetchSubscribers,
    SubscriberQuery,
    deleteSubscription,
    addSubscriber,
    requestLicense,
    loadOrganisation,
    changeLogo,
    changeOrgLogo,
    changeOrgBanner,
  };
}
