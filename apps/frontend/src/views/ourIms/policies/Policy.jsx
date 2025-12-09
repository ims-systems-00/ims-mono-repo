import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import React, { useState } from "react";
import {
  ACCESS_POLICY_TYPE,
  ACTIONS,
  EFFECTS,
  IMS_SERVICES,
} from "@/rolesAndPermissions";
import { getPolicy } from "@/services/iamPolicyServices";
import { imsLogger } from "@/services/loggerService";
import Details from "./Details";
import PolicyForm from "./PolicyForm";
const Groups = (props) => {
  const { isModalOpen = false } = props;
  let [policy, setPolicy] = useState({});
  let [processing, setProcessing] = useState({
    action: "load-policy",
    id: null,
  });
  const refreshPolicy = (policy) => {
    setPolicy(policy);
    props.onUpdate && props.onUpdate(policy);
  };
  let { authUser } = useAccess();

  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getPolicy(id);
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
      <Panels
        isModalOpen={isModalOpen}
        defaultPanel={"Details"}
        navLinks={["Details"]}
        backLinks={
          props.match && [
            {
              linkText: "Back",
              link: props.match.path.split("/:")[0],
            },
          ]
        }
      >
        {processing.action === "load-policy" ? (
          <Loading />
        ) : (
          policy && (
            <>
              {/* <Panel panelId="Amend">
              {policy.type === ACCESS_POLICY_TYPE.IMS_MANAGED ? (
                <h5 className="text-center text-danger">
                  iMS managed policies can not be modified
                </h5>
              ) : (
                <PolicyForm
                  policy={policy}
                  setProcessing={setProcessing}
                  processing={processing}
                  refreshPolicy={refreshPolicy}
                />
              )}
            </Panel> */}
              <Panel panelId="Details">
                <SwitchableView
                  viewTitle={policy.name}
                  canSwitch={
                    authUser({
                      service: IMS_SERVICES.IAM_GROUPS,
                      action: ACTIONS.CREATE,
                      effect: EFFECTS.ALLOW,
                    }) && policy.type !== ACCESS_POLICY_TYPE.IMS_MANAGED
                  }
                >
                  <SecondaryWrapperChild>
                    <PolicyForm
                      policy={policy}
                      setProcessing={setProcessing}
                      processing={processing}
                      refreshPolicy={refreshPolicy}
                    />
                  </SecondaryWrapperChild>
                  <PrimaryWrapperChild>
                    <Details policy={policy} />
                  </PrimaryWrapperChild>
                </SwitchableView>
              </Panel>
            </>
          )
        )}
      </Panels>
    </div>
  );
};

export default Groups;
