import { Card, CardBody, CardHeader, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { useCip } from "./store";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";

const ContinualImprovementStatus = () => {
  let { visitingCip: data } = useCip();
  return (
    <Card className="shadow-none border-0">
      <CardBody>
        <Table borderless responsive className="table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th className="">Date</th>
              <th className="text-end">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.implemented?.status === "Implemented" && (
              <tr>
                <td>{data?.implemented?.by?.name}</td>
                {/* score */}
                <td className="">
                  {moment(data?.implemented?.on).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="text-right d-flex justify-content-end">
                  {data?.implemented?.status && (
                    <BadgeStatus status="Implemented" />
                  )}
                </td>
              </tr>
            )}
            {data?.implemented?.status === "In Progress" && (
              <tr>
                <td className="text-nowrap">{data?.created?.by?.name}</td>
                <td className="text-nowrap">
                  {moment(data?.created?.on).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="text-right d-flex justify-content-end text-nowrap">
                  {data?.implemented?.status && (
                    <BadgeStatus status="In progress" />
                  )}
                </td>
              </tr>
            )}
            {data?.implemented?.status === "Pending" && (
              <tr>
                <td className="text-nowrap">{data?.created?.by?.name}</td>
                <td className="">
                  {moment(data?.created?.on).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="text-right d-flex justify-content-end">
                  {data?.created?.on && <BadgeStatus status="Pending" />}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default ContinualImprovementStatus;
