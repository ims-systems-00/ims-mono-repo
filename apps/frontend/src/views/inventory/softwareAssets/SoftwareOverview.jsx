import { Card, CardBody, Table } from "@ims-systems-00/ims-ui-kit";

const SoftwareOverview = ({ data }) => {
  return (
    <Card className="shadow-none border-0">
      <CardBody className="">
        <Table borderless responsive className="table-sm">
          {data && (
            <tbody>
              <tr>
                <td className="w-50 text-dark">Reference</td>
                <td className="text-left">
                  <span className="text-info">{data?.reference}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Business unit</td>
                <td>
                  <span className="text-info">{data?.group?.name}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Number of license</td>
                <td>
                  <span>{data.numberOfLicenses}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Number of installs</td>
                <td>
                  <span>{data.numberOfInstalls}</span>
                </td>
              </tr>
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

export default SoftwareOverview;
