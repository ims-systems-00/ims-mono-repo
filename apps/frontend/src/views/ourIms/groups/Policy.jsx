import Loading from "@/components/Loader/Loading";
import React, { useState } from "react";
import { ACCESS_POLICY_TYPE } from "@/rolesAndPermissions";
import { getPolicy } from "@/services/iamPolicyServices";
import { imsLogger } from "@/services/loggerService";
const Policy = ({ policyId }) => {
  let [processing, setProcessing] = useState({
    action: "load-policy",
    id: null,
  });
  let [policy, setPolicy] = useState({});
  const refreshPolicy = (policy) => setPolicy(policy);

  React.useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getPolicy(policyId);
        setPolicy(data.iamPolicy);
      } catch (ex) {
        imsLogger("Policy", ex.response);
      }
      setProcessing({ action: null, id: null });
    }
    fetchData();
  }, []);
  return (
    <div className="content">
      {processing.action === "load-policy" ? (
        <Loading />
      ) : policy.type === ACCESS_POLICY_TYPE.IMS_MANAGED ? (
        <span className="text-center text-danger">
          iMS managed policies can not be modified
        </span>
      ) : (
        // <PolicyForm
        //   policy={policy}
        //   setProcessing={setProcessing}
        //   processing={processing}
        //   refreshPolicy={refreshPolicy}
        // />
        <span className="text-center text-success">
          Permissions can not be amended at this moment
        </span>
      )}
    </div>
  );
};

export default Policy;
