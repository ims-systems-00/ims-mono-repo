import Loading from "@/components/Loader/Loading";
import { Card } from "@ims-systems-00/ims-ui-kit";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import useAccess from "@/hooks/useAccess";
import useQuery from "@/hooks/useQuery/index.js";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getPolicies } from "@/services/iamPolicyServices";
import { imsLogger } from "@/services/loggerService";
import PolicyForm from "./PolicyForm";
import PolicyTable from "./PolicyTable";
const Policies = (props) => {
  let [policies, setPolicies] = useState([]);
  let [processing, setProcessing] = useState({
    action: "load-policies",
    id: null,
  });

  let { query, toolState, getQuery, updatePagination, ...queryHandlers } =
    useQuery();

  const addToTable = (policy) =>
    setPolicies((prevPolicies) => [policy, ...prevPolicies]);
  let { authUser } = useAccess();

  const fetchData = async (qStr) => {
    try {
      setProcessing({ action: "load-policies", id: null });
      let { data } = await getPolicies({ query: `${qStr}` });
      setPolicies(data.iamPolicies);
      updatePagination(data.pagination);
    } catch (ex) {
      imsLogger("Policies", ex.response);
    }
    setProcessing({ action: null, id: null });
  };

  React.useEffect(() => {
    fetchData(getQuery());
  }, [query]);
  return (
    <div className="content">
      <Panels
        defaultPanel={"Access policies"}
        navLinks={
          authUser({
            service: IMS_SERVICES.IAM_ACCESS_POLICIES,
            action: ACTIONS.CREATE,
            effect: EFFECTS.ALLOW,
          })
            ? ["Create policy", "Access policies"]
            : ["Access policies"]
        }
      >
        <Panel panelId="Create policy">
          <Card>
            <PolicyForm
              setProcessing={setProcessing}
              processing={processing}
              addToTable={addToTable}
            />
          </Card>
        </Panel>
        <Panel panelId="Access policies">
          <Card>
            {processing.action === "load-policies" && <Loading />}
            <PolicyTable
              dataTable={policies}
              setPolicies={setPolicies}
              processing={processing}
              setProcessing={setProcessing}
              pathname={props.match.url}
              onPageChange={fetchData}
              pagination={toolState.pagination}
              {...queryHandlers}
            />
          </Card>
        </Panel>
      </Panels>
    </div>
  );
};

export default Policies;
