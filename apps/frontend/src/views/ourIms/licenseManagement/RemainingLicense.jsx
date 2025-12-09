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

const RemainingLicenses = ({}) => {
  let [licenses, setLicenses] = React.useState({});
  let [processing, setProcessing] = useState({
    action: "load-licenses",
    id: null,
  });
  React.useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getLicenses();
        setLicenses(data.licenses);
      } catch (ex) {
        imsLogger("RemainingLicenses", ex, ex.response);
      }
      setProcessing({ action: null, id: null });
    }
    fetchData();
  }, []);
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  Remaining licences in the organisation
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table borderless>
                  <thead className="text-primary">
                    <tr>
                      <th>HOS</th>
                      <th>Basic user</th>
                      <th>Auditors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processing.action === "load-licenses" ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          <Loading />
                        </td>
                      </tr>
                    ) : (
                      <tr key={"licneses"}>
                        <td className="">
                          {licenses.hosUser.allocated - licenses.hosUser.used}
                        </td>
                        <td className="">
                          {licenses.basicUser.allocated -
                            licenses.basicUser.used}
                        </td>
                        <td className="">
                          {licenses.auditorUser.allocated -
                            licenses.auditorUser.used}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default RemainingLicenses;
