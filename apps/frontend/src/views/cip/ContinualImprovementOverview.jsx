import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import { Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { Link } from "react-router-dom";
import { useCip } from "./store";

const ContinualImprovementOverview = () => {
  let { visitingCip: data } = useCip();
  return (
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
          {data?.escalated?.status && (
            <tr>
              <td className="text-nowrap">{data?.escalated?.by?.name}</td>
              {/* score */}
              <td className="text-center">
                {moment(data?.escalated?.on).format("DD/MM/YYYY")}
              </td>
              <td className="text-right d-flex justify-content-end">
                {data?.escalated?.status && (
                  <span className="btn-outline-red">
                    <i className="ims-icons-20 icon-step-regular p-1" />
                    Escalated
                  </span>
                )}
              </td>
            </tr>
          )}
          {data?.owner && (
            <tr>
              <td className="text-dark">Owner</td>
              <td>
                {data?.owner ? (
                  <ImageNameWrapper
                    img={data?.owner?.profileImageSrc}
                    name={data?.owner?.name}
                  />
                ) : (
                  "Unassigned"
                )}
              </td>
            </tr>
          )}
          <tr>
            <td className="text-dark">Raised by</td>
            <td>
              <ImageNameWrapper
                img={data?.created?.by?.profileImageSrc}
                name={data?.created?.by?.name}
              />
            </td>
          </tr>
          {data.cost ? (
            <tr>
              <td className="text-dark">Cost</td>
              <td>
                <span>{`£${data.cost}`}</span>
              </td>
            </tr>
          ) : null}
          {data?.source?.moduleType === "audits" && (
            <tr>
              <td className="text-dark">Source</td>
              <td>
                <Link
                  className="text-info"
                  to={`/admin/audits/${data?.source?.module?.type?.toLowerCase()}/${
                    data?.source?.module?._id
                  }`}
                >
                  {data?.source?.module?.reference}
                </Link>
              </td>
            </tr>
          )}
        </tbody>
      )}
    </Table>
  );
};

export default ContinualImprovementOverview;
