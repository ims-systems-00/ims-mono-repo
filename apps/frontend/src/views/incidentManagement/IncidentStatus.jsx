import Box from "@/components/Box/Index";
import { Card, CardBody, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import { useIncident } from "./store";

const IncidentStatus = () => {
  let { visitingIncident: data } = useIncident();
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
            {data?.resolved?.status && (
              <tr>
                <td className="text-nowrap">
                  {data?.resolved && data?.resolved?.by?.name}
                </td>
                <td className="text-nowrap">
                  {moment(data?.resolved?.on).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="text-right d-flex justify-content-end ">
                  {data?.resolved?.status && <BadgeStatus status="Resolved" />}
                </td>
              </tr>
            )}
            {data?.escalated?.status && (
              <tr>
                <td className="text-nowrap">{data?.escalated?.by?.name}</td>
                {/* score */}
                <td className="text-nowrap">
                  {moment(data?.escalated?.on).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="text-right d-flex justify-content-end">
                  {data?.escalated?.status && (
                    <BadgeStatus status="Escalated" />
                  )}
                </td>
              </tr>
            )}

            <tr>
              <td className="text-nowrap">{data?.created?.by?.name}</td>
              <td className="text-nowrap">
                {moment(data?.created?.on).format("DD/MM/YYYY HH:mm")}
              </td>
              <td className="text-right d-flex justify-content-end ">
                {data?.created?.on && <BadgeStatus status="Open" />}
              </td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default IncidentStatus;
