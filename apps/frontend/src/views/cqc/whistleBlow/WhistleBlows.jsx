import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import useAccess from "@/hooks/useAccess";
import useQuery from "@/hooks/useQuery/index.js";
import { useEffect, useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import {
  getCqcWhistleBlowCSV,
  getCqcWhistleBlows,
} from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { Report } from "@/views/shared/Report";
import filters from "./filters";
import WhistleBlowForm from "./WhistleBlowForm";
import WhistleBlowTable from "./WhistleBlowTable";
import { Card } from "@ims-systems-00/ims-ui-kit";

const WhistleBlows = (props) => {
  let { authUser } = useAccess();
  let [whistleBlows, setWhistleBlows] = useState([]);
  let [processing, setProcessing] = useState({
    action: "load-whistleBlows",
    id: null,
  });

  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({ filter: filters.find((item) => item.default) });

  const addToTable = (whistleBlow) =>
    setWhistleBlows((prevWhistleBlows) => [whistleBlow, ...prevWhistleBlows]);

  const fetchData = async (qStr) => {
    try {
      setProcessing({ action: "load-whistleBlows", id: null });
      let { data } = await getCqcWhistleBlows({ query: `${qStr}` });
      setWhistleBlows(data.whistleBlows);
      updatePagination(data.pagination);
    } catch (error) {
      imsLogger("WhistleBlows", error, error.response);
    }
    setProcessing({ action: null, id: null });
  };

  useEffect(() => {
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
              ? ["Whistleblowing", "Open", "CSV"]
              : ["Open"]
          }
          defaultPanel={"Open"}
        >
          <Panel panelId="Whistleblowing">
            <Card>
              <WhistleBlowForm
                addToTable={addToTable}
                setWhistleBlows={setWhistleBlows}
                processing={processing}
                setProcessing={setProcessing}
              />
            </Card>
          </Panel>
          <Panel panelId="Open">
            <Card>
              {processing.action === "load-whistleBlows" && <Loading />}
              <WhistleBlowTable
                dataTable={whistleBlows}
                processing={processing}
                setProcessing={setProcessing}
                pathname={props.location.pathname}
                setWhistleBlows={setWhistleBlows}
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
                reportApi={() => getCqcWhistleBlowCSV()}
                fileName="ims-complaints-report.csv"
              />
            </Card>
          </Panel>
        </Panels>
      </div>
    </>
  );
};

export default WhistleBlows;
