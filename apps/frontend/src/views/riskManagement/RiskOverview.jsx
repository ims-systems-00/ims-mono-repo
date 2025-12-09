import { Table } from "@ims-systems-00/ims-ui-kit";
import { Link } from "react-router-dom";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import { useRisk } from "./store";

const RiskOverview = (props) => {
  let { visitingRisk: risk } = useRisk();
  return (
    <Table borderless responsive className="table-sm">
      {risk && (
        <tbody>
          <tr>
            <td className="text-dark">Reference</td>
            <td>
              <span className="text-info">{risk?.reference}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Business unit</td>
            <td className=" text-info">
              <span className="text-info">{risk?.group?.name}</span>
            </td>
          </tr>

          <tr>
            <td className="text-dark">Type</td>
            <td>{risk?.type}</td>
          </tr>
          {risk.tagsAndCategories && (
            <tr>
              <td className="text-dark">Category</td>
              <td>{risk?.tagsAndCategories?.name}</td>
            </tr>
          )}
          {risk?.asset && (
            <>
              <tr>
                <td className="text-dark">Asset name</td>
                <td>
                  {risk?.asset?.name ||
                    risk?.asset?.staffName ||
                    risk?.asset?.informationInventory}
                </td>
              </tr>

              {risk.asset.tag && (
                <tr>
                  <td className="text-dark">Asset tag</td>
                  <td>{risk?.asset?.tag}</td>
                </tr>
              )}
            </>
          )}
          {risk?.asset?.staffId ||
            (risk?.asset?.informationInventory && (
              <tr>
                <td className="text-dark">Asset tag</td>
                <td>
                  {risk?.asset?.staffId || risk?.asset?.informationInventory}
                </td>
              </tr>
            ))}
          {risk?.owner?.name && (
            <tr>
              <td className="text-dark">Risk owner</td>
              <td>
                <ImageNameWrapper
                  img={risk?.owner?.profileImageSrc}
                  name={risk?.owner?.name}
                />
              </td>
            </tr>
          )}
          <tr>
            <td className="text-dark">Raised by</td>
            <td>
              <ImageNameWrapper
                img={risk?.created?.by?.profileImageSrc}
                name={risk?.created?.by?.name}
              />
            </td>
          </tr>
          {risk?.decisionMaker && (
            <tr>
              <td className="text-dark">Decision maker</td>
              <td>
                <ImageNameWrapper
                  img={risk?.decisionMaker?.profileImageSrc}
                  name={risk?.decisionMaker}
                />
              </td>
            </tr>
          )}
          {risk?.source?.moduleType === "audits" && (
            <tr>
              <td className="text-dark">Source</td>
              <td>
                <Link
                  className="text-info"
                  to={`/admin/audits/${risk?.source?.module?.type?.toLowerCase()}/${
                    risk?.source?.module?._id
                  }`}
                >
                  {risk?.source?.module?.reference}
                </Link>
              </td>
            </tr>
          )}
        </tbody>
      )}
    </Table>
  );
};

export default RiskOverview;
