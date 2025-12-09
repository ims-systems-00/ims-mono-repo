import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import useAccess from "@/hooks/useAccess";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getGroup } from "@/services/iamGroupServices";
import { imsLogger } from "@/services/loggerService";
import { getLicenses } from "@/services/organizationService";
import GroupDetails from "./GroupDetails";
import ToolkitForm from "./ToolkitForm";
import { Card } from "@ims-systems-00/ims-ui-kit";

const ManageLicense = (props) => {
  const { isModalOpen = false } = props;
  let [processing, setProcessing] = useState({
    action: "load-group",
    id: null,
  });
  let { authUser } = useAccess();
  let [group, setGroup] = useState({});
  let [licenses, setLicenses] = React.useState([]);
  const refreshGroup = (group) => {
    setGroup(group);
    props.onUpdate && props.onUpdate(group);
  };
  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.groupId) ||
          (props.view && props.view._id);
        let [groupResponse, licnesesResponse] = await Promise.all([
          getGroup(id),
          getLicenses(),
        ]);
        setGroup(groupResponse.data.iamGroup);
        setLicenses(licnesesResponse.data.licenses);
      } catch (ex) {
        imsLogger("ManageLicense", ex.response);
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
        navLinks={
          authUser({
            service: IMS_SERVICES.LICENSE_MANAGEMENT,
            action: ACTIONS.ALL,
            effect: EFFECTS.ALLOW,
          })
            ? ["Details", "Tools"] // ["Manage licences", "Tools", "Details"]
            : ["Details"]
        }
        backLinks={
          props.match && [
            {
              linkText: "Back",
              link: props.match.path.split("/:")[0],
            },
          ]
        }
      >
        {processing.action === "load-group" ? (
          <Loading />
        ) : (
          <>
            <Panel panelId="Tools">
              <Card>
                <ToolkitForm
                  group={group}
                  setProcessing={setProcessing}
                  processing={processing}
                  licenses={licenses}
                  refreshGroup={refreshGroup}
                />
              </Card>
            </Panel>
            <Panel panelId="Details">
              <Card>
                <GroupDetails group={group} />
              </Card>
            </Panel>
          </>
        )}
      </Panels>
    </div>
  );
};

export default ManageLicense;
