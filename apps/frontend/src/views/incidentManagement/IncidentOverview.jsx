import { Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import msToTime from "@/utils/timeConverter";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import { useIncident } from "./store";

const IncidentOverview = () => {
  let { visitingIncident: data } = useIncident();
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
            <td>
              <span className="text-info">{data?.group?.name}</span>
            </td>
          </tr>
          {data?.owner?.name && (
            <tr>
              <td className="text-dark">Incident owner</td>
              <td>
                <ImageNameWrapper
                  img={data?.owner?.profileImageSrc}
                  name={data?.owner?.name}
                />
              </td>
            </tr>
          )}
          {data?.priority && (
            <tr>
              <td className="text-dark">Priority</td>
              <td>
                {data.priority === "P4" ? (
                  <span className="text-success">{data.priority}</span>
                ) : data.priority === "P3" ? (
                  <span className="text-info">{data.priority}</span>
                ) : data.priority === "P2" ? (
                  <span className="text-warning">{data.priority}</span>
                ) : (
                  <span className="text-danger">{data.priority}</span>
                )}
              </td>
            </tr>
          )}
          <tr>
            <td className="text-dark">Is organisational</td>
            <td>
              <span>{data.privacy === "Organisational" ? "Yes" : "No"}</span>
            </td>
          </tr>
          {data.source.moduleType === "suppliers" && (
            <>
              <tr>
                <td className="text-dark">Incident type</td>
                <td>
                  <span>Supplier incident</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Supplier name</td>
                <td>
                  <span>{data.source.module.name}</span>
                </td>
              </tr>
            </>
          )}
          <tr>
            <td className="text-dark">Method of notification</td>
            <td>
              <span>{data.methodOfNotification}</span>
            </td>
          </tr>
          {data?.updated?.by?.name && (
            <tr>
              <td className="text-dark">Last updated by</td>
              <td>
                <ImageNameWrapper
                  img={data?.updated?.by?.profileImageSrc}
                  name={data?.updated?.by?.name}
                />
              </td>
            </tr>
          )}
          <tr>
            <td className="text-dark">Last updated on</td>
            <td>
              <span>{moment(data.updated?.on).format("DD/MM/YYYY")}</span>
            </td>
          </tr>

          {data?.resolved?.status && (
            <React.Fragment>
              <tr>
                <td className="text-dark">Resolved by</td>
                <td>
                  <ImageNameWrapper
                    img={data?.resolved?.by?.profileImageSrc}
                    name={data?.resolved?.by?.name}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-dark">Resolved on</td>
                <td>
                  <span>{moment(data.resolved?.on).format("DD/MM/YYYY")}</span>
                </td>
              </tr>
            </React.Fragment>
          )}

          {data?.resolved?.status && (
            <tr>
              <td className="text-dark">Resolution time</td>
              <td>
                {msToTime(data.resolutionTime).days} d{" "}
                {msToTime(data.resolutionTime).hours} hr{" "}
                {msToTime(data.resolutionTime).minutes} min
              </td>
            </tr>
          )}
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
            <td className="text-dark">Raised on</td>
            <td>
              <span>{moment(data.created?.on).format("DD/MM/YYYY")}</span>
            </td>
          </tr>
        </tbody>
      )}
    </Table>
  );
};

export default IncidentOverview;
