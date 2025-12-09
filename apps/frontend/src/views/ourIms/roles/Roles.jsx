import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import { useContext, useEffect, useState } from "react";
import { getRoles } from "@/services/iamRoleServices";
import { imsLogger } from "@/services/loggerService";
import CreateRole from "./CreateRole";
import RolesTable from "./RolesTable";
import { Card } from "@ims-systems-00/ims-ui-kit";

const Roles = (props) => {
  let [roles, setRoles] = useState([]);
  let [processing, setProcessing] = useState({
    action: "load-roles",
    id: null,
  });
  let { user } = useContext(SuperGlobalContext);
  const addToTable = (role) => setRoles((prevRoles) => [role, ...prevRoles]);

  useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getRoles();
        setRoles(data.iamRoles);
      } catch (error) {
        imsLogger("Roles", error.response);
      }
      setProcessing({ action: null, id: null });
    }
    fetchData();
  }, []);
  return (
    <div className="content">
      <Panels defaultPanel={"Roles"} navLinks={["Create role", "Roles"]}>
        <Panel panelId="Create role">
          <Card>
            <CreateRole
              {...props}
              setProcessing={setProcessing}
              processing={processing}
              addToTable={addToTable}
            />
          </Card>
        </Panel>
        <Panel panelId="Roles">
          <Card>
            {processing.action === "load-roles" ? (
              <Loading />
            ) : (
              <RolesTable
                dataTable={roles}
                processing={processing}
                setProcessing={setProcessing}
                setRoles={setRoles}
                pathname={props.match.url}
              />
            )}
          </Card>
        </Panel>
      </Panels>
    </div>
  );
};

export default Roles;
