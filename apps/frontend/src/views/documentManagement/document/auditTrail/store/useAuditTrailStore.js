import USER_ACTIONS from "./actions";
import * as activityApi from "@/services/activityService";
import { useState, useEffect } from "react";
import useProcessingControl from "@/hooks/useProcessingControl";
import { imsLogger } from "@/services/loggerService";
import useQuery from "@/hooks/useQuery";

export default function useAuditTrailStore({ document }) {
  const [activities, setActivities] = useState([]);
  const activitiesQueryUtils = useQuery({});
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  async function _loadActivities(qstr) {
    try {
      _dispatch({
        [USER_ACTIONS.LOAD_ACTIVITIES]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await activityApi.getActivities({
        query: qstr,
      });
      activitiesQueryUtils.updatePagination(data.pagination);
      setActivities((prevActivities) => [
        ...prevActivities,
        ...data.activities,
      ]);
      _dispatch({
        [USER_ACTIONS.LOAD_ACTIVITIES]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.LOAD_ACTIVITIES]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  useEffect(() => {
    activitiesQueryUtils.handleRequired({
      value: {
        moduleType: "documenttrees",
        metaInfo: {
          threadId: document?.documentData?.threadId,
        },
        sort: { createdAt: -1 },
      },
    });
  }, []);
  useEffect(() => {
    if (activitiesQueryUtils.toolState?.required?.value?.metaInfo?.threadId)
      _loadActivities(activitiesQueryUtils.getQuery());
  }, [activitiesQueryUtils.query]);
  function loadMoreActivities() {
    if (activitiesQueryUtils.toolState.pagination.hasNextPage) {
      activitiesQueryUtils.handlePagination({
        page: activitiesQueryUtils.toolState.pagination.nextPage,
      });
    }
  }
  return {
    activities,
    loadMoreActivities,
  };
}
