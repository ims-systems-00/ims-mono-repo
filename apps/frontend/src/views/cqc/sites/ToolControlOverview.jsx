import { Card, CardBody, CardHeader, Table } from "@ims-systems-00/ims-ui-kit";

const ToolControlOverview = ({ data }) => {
  return (
    <Card className="shadow-none">
      <CardHeader>Overview</CardHeader>
      <CardBody>
        <Table borderless responsive className="table-sm">
          {data && (
            <tbody>
              <tr>
                <td className="text-dark">Clause</td>
                <td>
                  <span className="text-info">{data.control?.clause}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Business unit</td>
                <td>
                  <span className="text-info">{data.group?.name}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Adopted</td>
                <td>
                  <span>{data.adopted}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Applies to</td>
                <td>
                  <span>{data.control.appliesTo}</span>
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </CardBody>
    </Card>
  );
};

export default ToolControlOverview;
