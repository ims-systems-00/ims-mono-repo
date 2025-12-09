import { Card, CardBody, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { useLeave } from "./store";

const LeaveOverview = ({}) => {
  let { visitingLeave: leave } = useLeave();
  const getSubmissionStatus = (leave) => {
    return leave.submission.status;
  };
  return (
    <Card className="shadow-none border-0">
      <CardBody className="">
        <Table borderless responsive className="table-sm">
          {leave && (
            <tbody>
              <tr>
                <td className="text-dark">Reference</td>
                <td>
                  <span className="text-info">{leave?.reference}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Type</td>
                <td>
                  <span className="text-info">{leave?.type}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Number of days</td>
                <td>
                  <span>{leave?.days}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Start date</td>
                <td>
                  <span>{moment(leave.startDate).format("DD/MM/YYYY")}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Fraction of start date</td>
                <td>
                  <span>{leave.startDayFraction}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">End date</td>
                <td>
                  <span>{moment(leave.endDate).format("DD/MM/YYYY")}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Fraction of end date</td>
                <td>
                  <span>{leave.endDayFraction}</span>
                </td>
              </tr>
              {leave?.submission && (
                <tr>
                  <td className="text-dark">Status</td>
                  <td>
                    {getSubmissionStatus(leave) === "Draft" && (
                      <span className="text-warning">
                        {getSubmissionStatus(leave)}
                      </span>
                    )}
                    {getSubmissionStatus(leave) === "Pending" && (
                      <span className="text-info">
                        {getSubmissionStatus(leave)}
                      </span>
                    )}
                    {getSubmissionStatus(leave) === "Approved" && (
                      <span className="text-success">
                        {getSubmissionStatus(leave)}
                      </span>
                    )}
                  </td>
                </tr>
              )}
              {leave?.submission?.submissionDate && (
                <tr>
                  <td className="text-dark">Submission date</td>
                  <td>
                    <span>
                      {moment(leave?.submission?.submissionDate).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
      </CardBody>
    </Card>
  );
};

export default LeaveOverview;
