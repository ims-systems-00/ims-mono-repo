import Loading from "@/components/Loader/Loading";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
} from "@ims-systems-00/ims-ui-kit";
import React, { useState } from "react";
import { imsLogger } from "@/services/loggerService";
import { getLicenses } from "@/services/organizationService";
import { useApplication } from "@/stores/applicationStore";

const OrganizationalOverview = ({
  users = true,
  groups = true,
  tools = true,
}) => {
  let { tokenPair } = useApplication();
  let [licenses, setLicenses] = React.useState({});
  let [processing, setProcessing] = useState({
    action: "load-licenses",
    id: null,
  });
  React.useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getLicenses(
          tokenPair?.accessTokenData?.user?.organizationId
        );
        setLicenses(data.licenses);
      } catch (ex) {
        imsLogger("OrganizationOverview", ex, ex.response);
      }
      setProcessing({ action: null, id: null });
    }
    fetchData();
  }, []);
  return (
    <>
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Licences</CardTitle>
            </CardHeader>
            <CardBody>
              <Table>
                <thead className="text-primary">
                  <tr>
                    {groups && (
                      <>
                        <th>Business units allocated</th>
                        <th>Business units used</th>
                        <th>Business units remaining</th>
                      </>
                    )}
                    {users && (
                      <>
                        <th>Licences allocated</th>
                        <th>Licences used</th>
                        <th>Licences remaining</th>
                        <th>Super admin role</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {processing.action === "load-licenses" ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <Loading />
                      </td>
                    </tr>
                  ) : (
                    <tr key={"licneses"}>
                      {groups && (
                        <>
                          <td>{licenses.groups.allocated}</td>
                          <td>{licenses.groups.used}</td>
                          <td>
                            {licenses.groups.allocated - licenses.groups.used}
                          </td>
                        </>
                      )}
                      {users && (
                        <>
                          <td>{licenses.users.allocated}</td>
                          <td>{licenses.users.used}</td>
                          <td>
                            {licenses.users.allocated - licenses.users.used}
                          </td>
                          <td>{licenses.superUser.used}</td>
                        </>
                      )}
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        {tools && (
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Compliance toolkit</CardTitle>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Allocated</th>
                      <th>Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processing.action === "load-licenses" ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          <Loading />
                        </td>
                      </tr>
                    ) : (
                      licenses.complianceTools.map((tool) => (
                        <tr key={tool.name}>
                          <td>{tool.name}</td>
                          <td>{tool.allocated}</td>
                          <td>{tool.allocated - tool.used}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};
export default OrganizationalOverview;
