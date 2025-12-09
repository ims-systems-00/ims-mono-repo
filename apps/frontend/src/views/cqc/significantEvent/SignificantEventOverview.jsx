import { Card, CardBody, CardHeader, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";

const SignificantEventOverview = ({ data }) => {
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
              {data.group && (
                <tr>
                  <td className="text-dark">Business unit</td>
                  <td className="text-info">
                    <span className="text-info">{data?.group?.name}</span>
                  </td>
                </tr>
              )}
              <tr>
                <td className="text-dark">Raised by</td>
                <td>
                  <ImageNameWrapper
                    img={data.created?.by?.profileImageSrc}
                    name={data.created?.by?.name}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-dark">Date of event</td>
                <td className="text-info">
                  <span>{moment(data.dateOfEvent).format("DD/MM/YYYY")}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Review meeting date</td>
                <td className="text-info">
                  <span>
                    {moment(data.dateOfReviewMeeting).format("DD/MM/YYYY")}
                  </span>
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
              {data.signed.status && (
                <tr>
                  <td className="text-dark">Closed on</td>
                  <td className="text-info">
                    <span>{moment(data.signed.on).format("DD/MM/YYYY")}</span>
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

export default SignificantEventOverview;
