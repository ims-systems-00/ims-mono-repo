import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import useAccess from "@/hooks/useAccess";
import useQuery from "@/hooks/useQuery/index.js";
import React, { useState } from "react";
import { getReports } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import ReportsTable from "./ReportsTable";
import SendReport from "./SendReport";
import { Card } from "@ims-systems-00/ims-ui-kit";

const Sites = (props) => {
  let { authUser } = useAccess();
  let [reports, setReports] = useState([]);
  let [processing, setProcessing] = useState({
    action: "load-reports",
    id: null,
  });

  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery();

  const addToTable = (report) =>
    setReports((prevReports) => [report, ...prevReports]);

  const fetchData = async (qStr) => {
    try {
      setProcessing({ action: "load-reports", id: null });
      let { data } = await getReports({
        query: `${qStr}`,
      });
      setReports(data.cqcReports);
      updatePagination(data.pagination);
    } catch (ex) {
      imsLogger("CQCReportHistory", ex, ex.response);
    }
    setProcessing({ action: null, id: null });
  };

  React.useEffect(() => {
    fetchData(getQuery());
  }, [query]);

  return (
    <React.Fragment>
      <div className="content">
        <Panels navLinks={["Send report", "Reports"]} defaultPanel={"Reports"}>
          <Panel panelId="Reports">
            <Card>
              {processing.action === "load-reports" && <Loading />}
              <ReportsTable
                dataTable={reports}
                processing={processing}
                setProcessing={setProcessing}
                pathname={props.location.pathname}
                onPageChange={fetchData}
                pagination={toolState.pagination}
                {...queryHandlers}
              />
            </Card>
          </Panel>
          <Panel panelId="Send report">
            <Card>
              <SendReport
                processing={processing}
                setProcessing={setProcessing}
                addToTable={addToTable}
              />
            </Card>
          </Panel>
        </Panels>
      </div>
    </React.Fragment>
  );
};

export default Sites;
