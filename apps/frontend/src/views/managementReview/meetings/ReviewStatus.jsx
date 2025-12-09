import { Card, CardBody, CardHeader, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { useSchedule } from "./store";

const ReviewStatus = () => {
  let { visitingReview: data } = useSchedule();
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
            {data?.completed?.status && (
              <tr>
                <td className="text-nowrap">{data?.created?.by?.name}</td>
                <td className="">
                  {moment(data?.completed?.on).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="text-right d-flex justify-content-end">
                  {data?.completed?.status && (
                    <span className=" text-success">
                      {/* <i className="ims-icons-20 icon-Tick-regular me-1" /> */}
                      <span>Completed</span>
                    </span>
                  )}
                </td>
              </tr>
            )}

            <tr>
              <td className="text-nowrap">{data?.created?.by?.name}</td>
              <td className="">
                {moment(data?.created?.on).format("DD/MM/YYYY")}
              </td>
              <td className="text-right d-flex justify-content-end">
                {data?.created?.on && (
                  <span className="text-info">
                    {/* <i className="ims-icons-20 icon-our-ims-regular me-1" /> */}
                    Scheduled
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default ReviewStatus;
