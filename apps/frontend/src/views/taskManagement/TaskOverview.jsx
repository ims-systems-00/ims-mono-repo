import { Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { Link } from "react-router-dom";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import { useTask } from "./store";

const TaskOverview = () => {
  let { task: data, linkedURL } = useTask();
  return (
    <Table borderless responsive className="table-sm">
      {data && (
        <tbody>
          <tr>
            <td className="w-50 text-dark">Reference</td>
            <td>
              <span className="text-info">{data?.reference}</span>
            </td>
          </tr>
          {data?.group?.name && (
            <tr>
              <td className="text-dark">Business unit</td>
              <td className="text-info">
                <span className="text-info">{data?.group?.name}</span>
              </td>
            </tr>
          )}
          <tr>
            <td className="text-dark">Priority</td>
            <td>
              {data?.priority === "High" && (
                <span className="text-danger">{data?.priority}</span>
              )}
              {data?.priority === "Medium" && (
                <span className="text-warning">{data?.priority}</span>
              )}
              {data?.priority === "Low" && (
                <span className="text-success">{data?.priority}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="text-dark">Due Date</td>
            <td>
              <span>{moment(data.due).format("DD/MM/YYYY")}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Task owner</td>
            <td>
              <ImageNameWrapper
                img={data?.created?.by?.profileImageSrc}
                name={data?.created?.by?.name}
              />
            </td>
          </tr>
          <tr>
            <td className="text-dark">Status</td>
            <td>
              <span
                className={`${
                  data?.completed?.status === "Complete"
                    ? "text-success"
                    : data?.completed?.status === "Pending"
                    ? "text-warning"
                    : "text-info"
                }`}
              >
                {data?.completed?.status}
              </span>
            </td>
          </tr>
          {data?.completed?.status === "Complete" && (
            <tr>
              <td className="text-dark">Completed by</td>
              <td>
                <ImageNameWrapper
                  img={data?.completed?.by?.profileImageSrc}
                  name={data?.completed?.by?.name}
                />
              </td>
            </tr>
          )}
          {data?.completed?.status === "Complete" && (
            <tr>
              <td className="text-dark">Completed on</td>
              <td>
                <span>{moment(data?.completed?.on).format("DD/MM/YYYY")}</span>
              </td>
            </tr>
          )}
          {data?.source?.module && (
            <tr>
              <td className="text-dark">Linked to</td>
              <td>
                <Link className="text-info font-weight-bold" to={linkedURL}>
                  {" "}
                  {data.source.module.reference} (
                  {data.source.module.name || data.source.module.title})
                </Link>
              </td>
            </tr>
          )}
        </tbody>
      )}
    </Table>
  );
};

export default TaskOverview;
