import { Card, CardBody, CardHeader, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";

const WhistleBlowOverview = ({ data }) => {
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
              {!data.statementOfDisclosureThree?.status && (
                <tr>
                  <td className="text-dark">Business unit</td>
                  <td className="text-info">
                    <span className="text-info">{data?.group?.name}</span>
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
                <td className="text-dark">Reporter</td>
                <td>
                  <ImageNameWrapper
                    img={data?.created?.by.profileImageSrc}
                    name={data?.created?.by?.name}
                  />
                </td>
              </tr>

              <tr>
                <td className="text-dark">Reported to</td>
                <td>
                  <ImageNameWrapper
                    img={data?.reportedTo?.profileImageSrc}
                    name={data?.reportedTo?.name}
                  />
                </td>
              </tr>
              {data?.signed && (
                <tr>
                  <td className="text-dark">Status</td>
                  {data?.signed.status ? (
                    <td>
                      <span className="text-success">Closed</span>
                    </td>
                  ) : (
                    <td>
                      <span className="text-danger">Open</span>
                    </td>
                  )}
                </tr>
              )}
              {data?.signed?.status && (
                <tr>
                  <td className="text-dark">Closed by</td>
                  <td>
                    <span>{data.signed?.by?.name}</span>
                    <ImageNameWrapper
                      img={data?.signed?.by?.profileImageSrc}
                      name={data?.signed?.by?.name}
                    />
                  </td>
                </tr>
              )}
              {data?.signed?.status && (
                <tr>
                  <td className="text-dark">Closed on</td>
                  <td>
                    <span>{moment(data.signed?.on).format("DD/MM/YYYY")}</span>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
      </CardBody>
    </Card>
  );
};

export default WhistleBlowOverview;
