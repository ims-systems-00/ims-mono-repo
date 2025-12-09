import { Card, CardBody, CardHeader, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";

const ComplaintOverview = ({ data }) => {
  return (
    <Card className="shadow-none">
      <CardHeader>Overview</CardHeader>
      <CardBody>
        <Table borderless responsive className="table-sm">
          {data?.reference && (
            <tbody>
              <tr>
                <td className="text-dark">Reference</td>
                <td>
                  <span className="text-info">{data?.reference}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Business unit</td>
                <td className="text-info">
                  <span className="text-info">{data?.group?.name}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Complainant</td>
                <td>
                  <span>{data?.name}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Raised by</td>
                <td>
                  <span>{data?.created?.by?.name}</span>
                </td>
              </tr>
              {data.investigator && (
                <tr>
                  <td className="text-dark">Investigated by</td>
                  <ImageNameWrapper
                    img={data?.investigator?.profileImageSrc}
                    name={data?.investigator?.name}
                  />
                </tr>
              )}
              {data.referredInvestigator && (
                <tr>
                  <td className="text-dark">Investigated by</td>
                  <td>
                    <ImageNameWrapper
                      img={data?.referredInvestigator?.profileImageSrc}
                      name={data?.referredInvestigator?.name}
                    />
                  </td>
                </tr>
              )}
              <tr>
                <td className="text-dark">Date of incident</td>
                <td>
                  <span>
                    {moment(data.dateOfIncident).format("DD/MM/YYYY")}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Telephone</td>
                <td className="text-left text-info">
                  <span>{data?.telephone}</span>
                </td>
              </tr>
              {data?.address && (
                <tr>
                  <td className="text-dark">Address</td>
                  <td className="text-left text-info">
                    <span>{data?.address}</span>
                  </td>
                </tr>
              )}
              {data?.email && (
                <tr>
                  <td className="text-dark">Email</td>
                  <td className="text-left text-info">
                    <span>{data?.email}</span>
                  </td>
                </tr>
              )}
              {data.signed.status && (
                <>
                  <tr>
                    <td className="text-dark">Closed by</td>
                    <ImageNameWrapper
                      img={data?.signed?.profileImageSrc}
                      name={data?.signed?.name}
                    />
                  </tr>
                  <tr>
                    <td className="text-dark">Closed on</td>
                    <td>
                      <span>
                        {moment(data.signed.on).format("DD/MM/YYYY HH:mm")}
                      </span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          )}
        </Table>
      </CardBody>
    </Card>
  );
};

export default ComplaintOverview;
