import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import NotificationContext from "@/contexts/notificationContext";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { getRole } from "@/services/iamRoleServices";
import { imsLogger } from "@/services/loggerService";
import CreateRole from "./CreateRole";

const RoleDetails = (props) => {
  let notify = React.useContext(NotificationContext);
  let [role, setRole] = React.useState({});
  let [processing, setProcessing] = React.useState({
    action: "load-role",
    id: null,
  });

  let refreshRole = (role) => setRole(role);

  React.useEffect(() => {
    async function fetchData() {
      try {
        let { id } = props.match.params;
        let { data } = await getRole(id);
        setRole(data.iamRole);
      } catch (ex) {
        imsLogger("RoleDetails", ex, ex.response);
        notify("Error occured while fetching data", "danger");
      }
      setProcessing({ action: null, id: null });
    }
    fetchData();
  }, []);
  return (
    <>
      <div className="content">
        <Panels
          navLinks={["Amend role", "Details"]}
          backLinks={[
            { linkText: "Back", link: props.match.path.split("/:")[0] },
          ]}
          defaultPanel={"Details"}
        >
          <Panel panelId="Amend role">
            {processing.action === "load-role" ? (
              <Loading />
            ) : role.type === "premitive" ? (
              <span className="text-center text-danger font-size-subtitle-2">
                Premitive Roles can not be updated
              </span>
            ) : (
              <CreateRole
                role={role}
                processing={processing}
                setProcessing={setProcessing}
                refreshRole={refreshRole}
              />
            )}
          </Panel>
          <Panel panelId="Details">
            {processing.action === "load-role" ? (
              <Loading />
            ) : (
              <Row>
                <Col md="12" className="mb-4">
                  <h4 className="text-primary">Role Name</h4>
                  <p>{role.name}</p>
                </Col>
                <Col md="6" className="mb-4">
                  <h4 className="text-primary">Role Type</h4>
                  <p>{role.type}</p>
                </Col>
                <Col md="6" className="mb-4">
                  <h4 className="text-primary">Role Policy</h4>
                  <p>{role.policy}</p>
                </Col>
              </Row>
            )}
          </Panel>
        </Panels>
      </div>
    </>
  );
};

export default RoleDetails;
