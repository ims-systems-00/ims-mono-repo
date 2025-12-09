import { Card, CardBody, CardHeader, Table } from "@ims-systems-00/ims-ui-kit";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";

const OrganisationAssetOverview = ({ data }) => {
  return (
    <Card className="shadow-none border-0">
      {/* <CardHeader>Overview</CardHeader> */}
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
                <td>
                  <span className="text-info">{data?.group?.name}</span>
                </td>
              </tr>
              {data?.owner?.name && (
                <tr>
                  <td className="text-dark">Owner</td>
                  <td className="text-info">
                    <ImageNameWrapper
                      img={data?.owner?.profileImageSrc}
                      name={data?.owner?.name}
                    />
                  </td>
                </tr>
              )}
              <tr>
                <td className="text-dark">Cost</td>
                <td className="text-info">
                  <span>{`£${data.cost}`}</span>
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </CardBody>
    </Card>
  );
};

export default OrganisationAssetOverview;
