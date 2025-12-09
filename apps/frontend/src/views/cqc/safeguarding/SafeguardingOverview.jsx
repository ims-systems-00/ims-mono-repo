import { Card, CardBody, CardHeader, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";

const SafeguardingOverview = ({ data }) => {
  return (
    <Card className="shadow-none">
      <CardHeader>Overview</CardHeader>
      <CardBody>
        <Table borderless responsive className="table-sm">
          {data && (
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
                <td className="text-dark">Person affected</td>
                <td>
                  <span>{data?.personAffected}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Risk registered</td>
                <td>
                  <span>{data?.riskRegistar}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Agencies involved</td>
                <td>
                  <span>{data?.agenciesInvolved}</span>
                </td>
              </tr>
              {data?.referred.status && (
                <>
                  <tr>
                    <td className="text-dark">Referred to</td>
                    <td>
                      <span>{data?.referred?.to}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-dark">Referred email</td>
                    <td>
                      <span>{data?.referred?.email}</span>
                    </td>
                  </tr>
                </>
              )}
              {data?.created?.by?.name && (
                <tr>
                  <td className="text-dark">Reported by</td>
                  <td>
                    <ImageNameWrapper
                      img={data.created?.by?.profileImageSrc}
                      name={data.created?.by?.name}
                    />
                  </td>
                </tr>
              )}
              {data?.signed?.status && (
                <>
                  <tr>
                    <td className="text-dark">Status</td>
                    {data?.signed.status ? (
                      <td>
                        <span className=" text-success">Closed</span>
                      </td>
                    ) : (
                      <td>
                        <span className=" text-danger">Reported</span>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-dark">Closed on</td>
                    <td className="text-info">
                      <span>{moment(data.signed.on).format("DD/MM/YYYY")}</span>
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

export default SafeguardingOverview;
