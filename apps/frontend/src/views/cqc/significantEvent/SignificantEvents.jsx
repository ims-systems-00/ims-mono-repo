import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useQuery from "@/hooks/useQuery/index.js";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import {
  getSignificantEvents,
  getSignificantEventsCSV,
} from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { Report } from "@/views/shared/Report";
import filters from "./filters";
import SignificantEventForm from "./SignificantEventForm";
import SignificantEventTable from "./SignificantEventTable";
import { Card } from "@ims-systems-00/ims-ui-kit";

const SignificantEvents = (props) => {
  let { authUser } = useAccess();
  let notify = React.useContext(NotificationContext);
  let [significantEvents, setSignificantEvents] = useState([]);
  let [processing, setProcessing] = useState({
    action: "load-significantEvents",
    id: null,
  });

  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({ filter: filters.find((item) => item.default) });

  const addToTable = (event) =>
    setSignificantEvents((prevEvents) => [event, ...prevEvents]);

  const fetchData = async (qStr) => {
    try {
      setProcessing({ action: "load-significantEvents", id: null });
      let { data } = await getSignificantEvents({
        query: `${qStr}`,
      });
      setSignificantEvents(data.significantEvents);
      updatePagination(data.pagination);
    } catch (ex) {
      imsLogger("SignificantEvents", ex, ex.response);
    }
    setProcessing({ action: null, id: null });
  };

  React.useEffect(() => {
    fetchData(getQuery());
  }, [query]);

  return (
    <React.Fragment>
      <div className="content">
        <Panels
          navLinks={
            authUser({
              service: IMS_SERVICES.INVENTORY,
              action: ACTIONS.CREATE,
              effect: EFFECTS.ALLOW,
            })
              ? ["Add event", "Significant events", "CSV"]
              : ["Significant Events"]
          }
          defaultPanel={"Significant events"}
        >
          <Panel panelId="Add event">
            <Card>
              <SignificantEventForm
                addToTable={addToTable}
                setSignificantEvents={setSignificantEvents}
                processing={processing}
                setProcessing={setProcessing}
              />
            </Card>
          </Panel>
          <Panel panelId="Significant events">
            <Card>
              {processing.action === "load-significantEvents" && <Loading />}
              <SignificantEventTable
                dataTable={significantEvents}
                processing={processing}
                setProcessing={setProcessing}
                pathname={props.location.pathname}
                setSignificantEvents={setSignificantEvents}
                onPageChange={fetchData}
                toolState={toolState}
                pagination={toolState.pagination}
                filters={filters}
                {...queryHandlers}
              />
            </Card>
          </Panel>
          <Panel panelId="CSV">
            <Card>
              <Report
                className="text-center"
                text="Download CSV"
                reportApi={() => getSignificantEventsCSV({ query: `` })}
                fileName="ims-complaints-report.csv"
              />
            </Card>
          </Panel>
        </Panels>
      </div>
    </React.Fragment>
  );
};

export default SignificantEvents;
