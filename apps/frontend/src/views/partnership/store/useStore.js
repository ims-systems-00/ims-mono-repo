import { useEffect, useState } from "react";
import { useApplication } from "@/stores/applicationStore";
import USER_ACTIONS from "./actions";
import useProcessingControl from "@/hooks/useProcessingControl";
import {
  getOrganizations,
  getOrganization,
} from "../../../services/organizationService";
import { getAnalyticsByPartnership } from "../../../services/partnershipProgramService";
import { imsLogger } from "@/services/loggerService";

import useQuery from "@/hooks/useQuery";
export default function useStore(config) {
  const { tokenPair } = useApplication();
  const [organisation, setOrganisation] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [visitinOrganisation, setVisitingOrganisation] = useState(null);
  const [partnershipAnalytics, setPartnerhipAnalytics] = useState(null);
  const queryHandlers = useQuery({
    required: {
      value: {
        referralSource: tokenPair.accessTokenData.user.partnershipProgramId,
      },
    },
  });
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  async function fetchOrganizations(qstr) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_ORGS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getOrganizations({ query: qstr });
      setOrganizations(data.organizations);
      queryHandlers.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LOAD_ORGS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger(ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_ORGS]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function fetchMyCurrentOrganisation() {
    try {
      let { data } = await getOrganization(
        tokenPair?.accessTokenData?.user?.organizationId
      );
      setOrganisation(data.organization);
    } catch (err) {
      imsLogger(err);
    }
  }
  async function fetchAnalytics() {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_ANALYTICS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getAnalyticsByPartnership(
        tokenPair.accessTokenData.user.partnershipProgramId
      );
      setPartnerhipAnalytics(data.details.analytics);
      _dispatch({
        [USER_ACTIONS.LOAD_ANALYTICS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      imsLogger(ex, ex.response);
      _dispatch({
        [USER_ACTIONS.LOAD_ANALYTICS]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }

  const visitOrganisation = (data) => {
    setVisitingOrganisation(data);
  };
  useEffect(() => {
    fetchOrganizations(queryHandlers.getQuery());
  }, [queryHandlers.query]);
  useEffect(() => {
    fetchMyCurrentOrganisation();
    fetchAnalytics();
  }, []);
  return {
    processing,
    organizations,
    organisation,
    visitinOrganisation,
    partnershipAnalytics,
    visitOrganisation,
    orgTableQueryHandlers: {
      ...queryHandlers,
    },
  };
}
