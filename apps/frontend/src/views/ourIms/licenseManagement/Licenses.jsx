import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import useAccess from "@/hooks/useAccess";
import useQuery from "@/hooks/useQuery/index.js";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getGroups } from "@/services/iamGroupServices";
import { getLicensesRequests } from "@/services/licensemanagementServices";
import { imsLogger } from "@/services/loggerService";
import groupFilters from "../groups/filters/groups";
import LicenseTable from "./LicenseTable";
import MakeRequest from "./MakeRequest";
import OrganizationalOverview from "./OrganizaionalOverview";
import RequestsTable from "./RequestsTable";
import { Card } from "@ims-systems-00/ims-ui-kit";
const Licenses = (props) => {
  let [groups, setGroups] = useState([]);
  let [processing, setProcessing] = useState({
    action: "load-groups",
    id: null,
  });
  let { authUser, authGlobalAccess } = useAccess();
  let [licensesRequests, setLicensesRequests] = useState([]);

  let {
    query: groupQuery,
    toolState: groupsToolState,
    getQuery: getGroupsQuery,
    updatePagination: updateGroupsPagination,
    ...groupsQueryHandlers
  } = useQuery();

  let {
    query: licenseQuery,
    toolState: licenseToolState,
    getQuery: getLicenseQuery,
    updatePagination: licenseUpdatePagination,
    ...licenseQueryHandlers
  } = useQuery();

  const addToTable = (licensesRequests) =>
    setLicensesRequests((prevLicenses) => [licensesRequests, ...prevLicenses]);

  const fetchGroups = async (qStr) => {
    try {
      setProcessing({ action: "load-groups", id: null });
      let { data } = await getGroups({
        query: `${qStr}`,
      });
      setGroups(data.iamGroups);
      updateGroupsPagination(data.pagination);
    } catch (ex) {
      imsLogger("Licenses", ex.response);
    }
    setProcessing({ action: null, id: null });
  };

  const fetchLicenses = async (qstr) => {
    try {
      let { data } = await getLicensesRequests({
        query: `${qstr}`,
      });
      setLicensesRequests((prevData) => [...data.requests]);
      licenseUpdatePagination(data.pagination);
    } catch (ex) {
      imsLogger("Licenses", ex.response);
    }
    setProcessing({ action: null, id: null });
  };
  function getFilters() {
    return authGlobalAccess() ? groupFilters : [];
  }

  React.useEffect(() => {
    fetchGroups(getGroupsQuery());
  }, [groupQuery]);

  React.useEffect(() => {
    fetchLicenses(getLicenseQuery());
  }, [licenseQuery]);

  return (
    <div className="content">
      <Panels
        defaultPanel={"Request licences"}
        navLinks={
          authUser({
            service: IMS_SERVICES.LICENSE_MANAGEMENT,
            action: ACTIONS.ALL,
            effect: EFFECTS.ALLOW,
          })
            ? [
                "Organisation overview",
                "Business units",
                "Request licences",
                "Requested",
              ]
            : ["Business units", "Request licences", "Requested"]
        }
      >
        <Panel panelId="Organisation overview">
          <Card>
            <OrganizationalOverview />
          </Card>
        </Panel>
        <Panel panelId="Business units">
          <Card>
            {processing.action === "load-groups" && <Loading />}
            <LicenseTable
              dataTable={groups}
              processing={processing}
              pathname={props.location.pathname}
              setProcessing={setProcessing}
              setGroups={setGroups}
              onPageChange={fetchGroups}
              pagination={groupsToolState.pagination}
              filters={getFilters()}
              {...groupsQueryHandlers}
            />
          </Card>
        </Panel>
        <Panel panelId="Request licences">
          <Card>
            <MakeRequest
              {...props}
              setProcessing={setProcessing}
              processing={processing}
              addToTable={addToTable}
            />
          </Card>
        </Panel>
        <Panel panelId="Requested">
          <Card>
            {processing.action === "load-groups" && <Loading />}
            <RequestsTable
              dataTable={licensesRequests}
              setLicensesRequests={setLicensesRequests}
              processing={processing}
              pathname={props.location.pathname}
              setProcessing={setProcessing}
              pagination={licenseToolState.pagination}
              filters={[]}
              {...licenseQueryHandlers}
            />
          </Card>
        </Panel>
      </Panels>
    </div>
  );
};

export default Licenses;
