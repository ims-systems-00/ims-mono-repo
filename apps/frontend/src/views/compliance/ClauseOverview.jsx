import { Table } from "@ims-systems-00/ims-ui-kit";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";

const ClauseOverview = ({ data }) => {
  return (
    <Table borderless responsive className="table-sm">
      {data && (
        <tbody>
          <tr>
            <td className="text-dark">ISO Standard</td>
            <td className="text-left">
              <span className="text-info">{data?.control?.name}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Control</td>
            <td className="text-left">
              <span className="text-info">{data?.control?.clause}</span>
            </td>
          </tr>
          {data?.control?.moreInfo?.type && (
            <tr>
              <td className="text-dark">Type</td>
              <td className="text-left">
                <span className="text-info">
                  {data?.control?.moreInfo?.type}
                </span>
              </td>
            </tr>
          )}
          <tr>
            <td className="text-dark">Selected</td>
            <td className="text-left">
              <span
                className={
                  data?.selected === "Selected" ? "text-success" : "text-danger"
                }
              >
                {data?.selected === "Selected" ? "Yes" : "No"}
              </span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Status</td>
            <td className="text-left">
              {data.state === "Implemented" ? (
                <span className="text-success">{data?.state}</span>
              ) : (
                <span className="text-danger">{data?.state}</span>
              )}
            </td>
          </tr>
          {data.control?.moreInfo?.applicableModulesLabel && (
            <tr>
              <td className="text-dark">Applicable modules</td>
              <td className="text-left">
                <span>{data.control?.moreInfo?.applicableModulesLabel}</span>
              </td>
            </tr>
          )}
          {data.updated?.by && (
            <tr>
              <td className="text-dark">Updated by</td>
              <td>
                <ImageNameWrapper
                  img={data?.updated?.by?.profileImageSrc}
                  name={data?.updated?.by?.name}
                />
              </td>
            </tr>
          )}
        </tbody>
      )}
    </Table>
  );
};

export default ClauseOverview;
