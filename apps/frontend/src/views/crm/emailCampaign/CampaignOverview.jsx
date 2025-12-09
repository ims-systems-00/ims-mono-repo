import { Card, CardBody, CardHeader, Table } from "@ims-systems-00/ims-ui-kit";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import { useCampaign } from "./store";

const CampaignOverview = () => {
  let { visitingCampaign: data } = useCampaign();
  return (
    <Table borderless responsive size="sm">
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
          <tr>
            <td className="text-dark">Raised by</td>
            <td>
              <ImageNameWrapper
                img={data?.created?.by?.profileImageSrc}
                name={data?.created?.by?.name}
              />
            </td>
          </tr>
          <tr>
            <td className="text-dark">Target</td>
            <td>{data?.target}</td>
          </tr>
          {data?.status && (
            <tr>
              <td className="text-dark">Status</td>
              <td>
                {data?.status === "Draft" && (
                  <span className="text-danger">{data?.status}</span>
                )}
                {data?.status === "Sent" && (
                  <span className="text-success">{data?.status}</span>
                )}
              </td>
            </tr>
          )}
        </tbody>
      )}
    </Table>
  );
};

export default CampaignOverview;
