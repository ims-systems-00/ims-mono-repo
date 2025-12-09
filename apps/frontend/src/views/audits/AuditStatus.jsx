import Box from "@/components/Box/Index";
import { Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import { useAudits } from "./store";

const AuditStatus = () => {
  let { visitingAudit: audit } = useAudits();
  return (
  
      <Table borderless responsive className="table-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th className="">Date</th>
            <th className="text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {audit?.completed?.status && (
            <tr>
              <td className="text-nowrap">{audit?.completed?.by?.name}</td>
              <td className="">
                {moment(audit?.completed?.on).format("DD/MM/YYYY HH:mm")}
              </td>
              <td>
                {audit?.completed?.status && <BadgeStatus status="Completed" />}
              </td>
            </tr>
          )}

          <tr>
            <td className="text-nowrap">{audit?.created?.by?.name}</td>
            <td className="">
              {moment(audit?.created?.on).format("DD/MM/YYYY HH:mm")}
            </td>
            <td>
              {audit?.created?.on && <BadgeStatus status="Scheduled" />}
            </td>
          </tr>
        </tbody>
      </Table>
   
  );
};

export default AuditStatus;
