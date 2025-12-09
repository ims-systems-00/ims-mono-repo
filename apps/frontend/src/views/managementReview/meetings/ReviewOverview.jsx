import { Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { useSchedule } from "./store";

const ReviewOverview = () => {
  let { visitingReview: data } = useSchedule();
  return (
    <Table borderless responsive className="table-sm">
      {data?.reference && (
        <tbody>
          <tr>
            <td className="text-dark">Reference</td>
            <td>
              <span className="text-info">{data?.reference}</span>
            </td>
          </tr>

          <tr>
            <td className="text-dark">Interval</td>
            <td>
              <span className="text-info">{data.interval}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Scheduled </td>
            <td>
              <span>{moment(data.date).format("DD/MM/YYYY")}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Time</td>
            <td>
              <span>{data.time}</span>
            </td>
          </tr>
        </tbody>
      )}
    </Table>
  );
};

export default ReviewOverview;
