import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import useAccess from "@/hooks/useAccess";
import useQuery from "@/hooks/useQuery/index.js";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getRatingsOverview } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import BuildTool from "./BuildTool";
import SitesTable from "./SitesTable";
import { Card } from "@ims-systems-00/ims-ui-kit";

const Sites = (props) => {
  let { authUser } = useAccess();
  let [overviews, setOverviews] = useState([]);
  let [processing, setProcessing] = useState({
    action: "load-overviews",
    id: null,
  });

  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery();

  const addToTable = (overview) =>
    setOverviews((prevOverviews) => [overview, ...prevOverviews]);

  const fetchData = async (qStr) => {
    try {
      setProcessing({ action: "load-overviews", id: null });
      let { data } = await getRatingsOverview({
        query: `${qStr}`,
      });
      setOverviews(data.overviews);
      updatePagination(data.pagination);
    } catch (ex) {
      imsLogger("CQCSites", ex, ex.response);
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
              ? ["Sites", "Add site"]
              : ["Sites"]
          }
          defaultPanel={"Sites"}
        >
          <Panel panelId="Sites">
            <Card>
              {processing.action === "load-overviews" && <Loading />}
              <SitesTable
                dataTable={overviews}
                processing={processing}
                setProcessing={setProcessing}
                pathname={props.location.pathname}
                setOverviews={setOverviews}
                onPageChange={fetchData}
                pagination={toolState.pagination}
                {...queryHandlers}
              />
            </Card>
          </Panel>
          <Panel panelId="Add site">
            <Card>
              {processing.action === "load-overviews" && <Loading />}
              <BuildTool
                processing={processing}
                setProcessing={setProcessing}
                addToTable={addToTable}
                setOverviews={setOverviews}
              />
            </Card>
          </Panel>
        </Panels>
      </div>
    </React.Fragment>
  );
};

export default Sites;
