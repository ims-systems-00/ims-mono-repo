import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import useAccess from "@/hooks/useAccess";
import useQuery from "@/hooks/useQuery/index.js";
import React, { useState } from "react";
import { getSafeguardings } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import filters from "./filters";
import SafeguardingForm from "./SafeguardingFrom";
import SafeguardingTable from "./SafeguardingTable";
import { Card } from "@ims-systems-00/ims-ui-kit";

const Safeguradings = (props) => {
  let { authUser } = useAccess();
  let [safeguardings, setSafeguardings] = useState([]);
  let [processing, setProcessing] = useState({
    action: "load-safeguardings",
    id: null,
  });
  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery({ filter: filters.find((item) => item.default) });

  const addToTable = (safeguarding) =>
    setSafeguardings((prevSafeguardings) => [
      safeguarding,
      ...prevSafeguardings,
    ]);

  const fetchData = async (qStr) => {
    try {
      setProcessing({ action: "load-safeguardings", id: null });
      let { data } = await getSafeguardings({
        query: `${qStr}`,
      });
      setSafeguardings(data.safeGuardings);
      updatePagination(data.pagination);
    } catch (ex) {
      imsLogger("Safeguardings", ex, ex.response);
    }
    setProcessing({ action: null, id: null });
  };

  React.useEffect(() => {
    fetchData(getQuery());
  }, [query]);

  return (
    <React.Fragment>
      <div className="content">
        <Panels navLinks={["Add safeguarding", "List"]} defaultPanel={"List"}>
          <Panel panelId="Add safeguarding">
            <Card>
              <SafeguardingForm
                processing={processing}
                setProcessing={setProcessing}
                addToTable={addToTable}
              />
            </Card>
          </Panel>
          <Panel panelId="List">
            <Card>
              {processing.action === "load-safeguardings" && <Loading />}
              <SafeguardingTable
                dataTable={safeguardings}
                processing={processing}
                setProcessing={setProcessing}
                pathname={props.location.pathname}
                setSafeguardings={setSafeguardings}
                onPageChange={fetchData}
                toolState={toolState}
                pagination={toolState.pagination}
                filters={filters}
                {...queryHandlers}
              />
            </Card>
          </Panel>
        </Panels>
      </div>
    </React.Fragment>
  );
};

export default Safeguradings;
