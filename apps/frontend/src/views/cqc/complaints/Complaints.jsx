import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useQuery from "@/hooks/useQuery/index.js";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getComplaints, getCSVReport } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { Report } from "@/views/shared/Report";
import Complaintform from "./Complaintform";
import ComplaintsTable from "./ComplaintsTable";
import filters from "./filters";
import { Card } from "@ims-systems-00/ims-ui-kit";

const Complaints = (props) => {
  let { authUser } = useAccess();
  let notify = React.useContext(NotificationContext);
  let [complaints, setComplaints] = useState([]);
  let [processing, setProcessing] = useState({
    action: "load-complaint",
    id: null,
  });
  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({ filter: filters.find((item) => item.default) });

  const addToTable = (complaint) =>
    setComplaints((prevComplaints) => [complaint, ...prevComplaints]);

  const fetchData = async (qstr) => {
    try {
      setProcessing({ action: "load-complaint", id: null });
      let { data } = await getComplaints({
        query: `${qstr}`,
      });
      setComplaints(data.compliants);
      updatePagination(data.pagination);
    } catch (ex) {
      imsLogger("Complaint", ex, ex.response);
    }
    setProcessing({ action: null, id: null });
  };

  React.useEffect(() => {
    fetchData(getQuery());
  }, [query]);

  return (
    <>
      <div className="content">
        <Panels
          navLinks={
            authUser({
              service: IMS_SERVICES.INVENTORY,
              action: ACTIONS.CREATE,
              effect: EFFECTS.ALLOW,
            })
              ? ["Add complaint", "Complaints", "CSV"]
              : ["Complaints"]
          }
          defaultPanel={"Complaints"}
        >
          <Panel panelId="Add complaint">
            <Card>
              <Complaintform
                addToTable={addToTable}
                setComplaints={setComplaints}
                processing={processing}
                setProcessing={setProcessing}
              />
            </Card>
          </Panel>
          <Panel panelId="Complaints">
            <Card>
              {processing.action === "load-complaint" && <Loading />}
              <ComplaintsTable
                dataTable={complaints}
                processing={processing}
                setProcessing={setProcessing}
                pathname={props.location.pathname}
                setComplaints={setComplaints}
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
                reportApi={() => getCSVReport({ query: `` })}
                fileName="ims-complaints-report.csv"
              />
            </Card>
          </Panel>
        </Panels>
      </div>
    </>
  );
};

export default Complaints;
