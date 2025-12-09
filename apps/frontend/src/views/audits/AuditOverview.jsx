import Box from "@/components/Box/Index";
import { Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import { useAudits } from "./store";

const AuditOverview = () => {
  let { visitingAudit: audit } = useAudits();
  return (
    <Table borderless responsive className="table-sm">
      {audit && (
        <tbody>
          <tr>
            <td className="text-dark">Reference</td>
            <td>
              <span className="text-info">{audit?.reference}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Business unit</td>
            <td>
              <span>{audit?.group?.name || "N/A"}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Compliance body</td>
            <td>
              <span>{audit.complianceBody?.name || "N/A"}</span>
            </td>
          </tr>
          {audit?.auditor && (
            <tr>
              <td className="text-dark">Auditor</td>
              <td>
                <ImageNameWrapper
                  img={audit?.auditor?.profileImageSrc}
                  name={audit?.auditor?.name}
                />
              </td>
            </tr>
          )}
          <tr>
            <td className="text-dark">Focus area</td>
            <td>
              <span>{audit.focusArea}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Scheduled</td>
            <td>
              <span>{`${moment(audit.startDate).format("DD/MM/YYYY")} ${
                audit.time
              }`}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Interval</td>
            <td>
              <span>{audit.interval}</span>
            </td>
          </tr>
        </tbody>
      )}
    </Table>
  );
};

export default AuditOverview;
