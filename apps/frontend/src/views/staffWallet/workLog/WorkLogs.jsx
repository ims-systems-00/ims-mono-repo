import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery/index.js";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentSessionData } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import { getWorkLogs } from "@/services/wallet/worklogServices";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import USER_ACTIONS from "../expenseReport/actions";
import WorkLogsTable from "./WorkLogsTable";

const WorkLogs = (props) => {
  let [workLogs, setWorkLogs] = React.useState([]);
  let { authUser } = useAccess();
  let walletId = props.walletId || getCurrentSessionData().user?._id;
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_WORKLOGS, status: true },
  ]);
  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({
      required: {
        value: {
          created: { by: walletId },
        },
      },
    });

  const fetchWorkLogs = async (qStr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_WORKLOGS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getWorkLogs({
        query: `${qStr}`,
      });
      setWorkLogs(data.worklogs);
      updatePagination(data.pagination);
      dispatch({
        [USER_ACTIONS.LOAD_WORKLOGS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_WORKLOGS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("WorkLogs", ex, ex.response);
      // notify("Error occurred while fetching data", "danger");
    }
  };
  React.useEffect(() => {
    fetchWorkLogs(getQuery());
  }, [query]);
  return (
    <div className="content">
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_WORKLOGS].error}
        errorMessage="Could not load work logs"
      >
        {processing[USER_ACTIONS.LOAD_WORKLOGS].status && <Loading />}
        <>
          <WorkLogsTable
            dataTable={workLogs}
            setWorkLogs={setWorkLogs}
            processing={processing}
            dispatch={dispatch}
            onPageChange={fetchWorkLogs}
            pagination={toolState.pagination}
            //  filters={filters}
            {...queryHandlers}
          />
        </>
      </ErrorHandlerComponent>
    </div>
  );
};

export default WorkLogs;
