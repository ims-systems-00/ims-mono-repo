import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import React, { useState } from "react";
import { IMS_POLICIES, IMS_SERVICES } from "@/rolesAndPermissions";
import { getPolicy } from "@/services/iamPolicyServices";
import { imsLogger } from "@/services/loggerService";
import { getUserWithClassifiedInfo } from "@/services/userServices";
import ToolkitForm from "./ToolkitForm";

const ToolAccess = (props) => {
  let [processing, setProcessing] = useState({ action: "load-user", id: null });
  let [service, setService] = React.useState({});

  React.useEffect(() => {
    async function fetchData() {
      try {
        let { id } = props.match.params;
        let { data } = await getUserWithClassifiedInfo(id);
        let accessPolicy = data.user.accessPolicies.find(
          (policy) =>
            policy.role.name === IMS_POLICIES.IMS_HOS_USER ||
            IMS_POLICIES.IMS_AUDITOR_USER
        );
        let policyResponse = await getPolicy(accessPolicy.role.policy);
        setService(
          policyResponse.data.iamPolicy.statement.find(
            (statement) => statement.service === IMS_SERVICES.COMPLIANCE_TOOL
          )
        );
      } catch (err) {
        imsLogger("ToolAccess", err);
      }
      setProcessing({ action: null, id: null });
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="content">
        {processing.action === "load-user" ? (
          <Loading />
        ) : (
          <Panels
            navLinks={["Assign Toolkit"]}
            backLinks={[
              {
                linkText: "Back",
                link: props.match.path.split("/:")[0],
              },
            ]}
            defaultPanel={"Assign Toolkit"}
          >
            <Panel panelId="Assign Toolkit">
              <ToolkitForm
                userId={props.match.params.id}
                tools={service.resources}
                processing={processing}
                setProcessing={setProcessing}
              />
            </Panel>
          </Panels>
        )}
      </div>
    </>
  );
};

export default ToolAccess;
