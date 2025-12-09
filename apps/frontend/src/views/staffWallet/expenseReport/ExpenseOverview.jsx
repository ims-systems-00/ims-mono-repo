import { Card, CardBody, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import { useExpenseReport } from "./store";

const ExpenseOverview = ({}) => {
  let { visitingExpenseReport: expenseReport, getSubmissionStatus } =
    useExpenseReport();

  return (
    <Card className="shadow-none border-0">
      <CardBody>
        <Table borderless responsive className="table-sm">
          {expenseReport && (
            <tbody>
              <tr>
                <td className="text-dark">Reference</td>
                <td>
                  <span className="text-info">{expenseReport?.reference}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Currency</td>
                <td>
                  <span className="text-info">{expenseReport?.currency}</span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Raised by</td>
                <td>
                  <ImageNameWrapper
                    img={expenseReport?.created?.by?.profileImageSrc}
                    name={expenseReport?.created?.by?.name}
                  />
                </td>
              </tr>
              {expenseReport.submission?.lineManagers.map(
                (lineManager) =>
                  lineManager && (
                    <tr>
                      <td className="text-dark">Line Manager</td>
                      <td>
                        <ImageNameWrapper
                          img={lineManager?.profileImageSrc}
                          name={lineManager?.name}
                        />
                      </td>
                    </tr>
                  )
              )}
              {expenseReport?.submission?.submissionDate && (
                <tr>
                  <td className="text-dark">Submitted on</td>
                  <td>
                    <span>
                      {moment(expenseReport?.submission?.submissionDate).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </span>
                  </td>
                </tr>
              )}
              <tr>
                <td className="text-dark">Status</td>
                <td>
                  {getSubmissionStatus() === "Pending" ? (
                    <span className="text-warning">
                      {getSubmissionStatus()}
                    </span>
                  ) : getSubmissionStatus() === "Approved" ? (
                    <span className="text-success">
                      {getSubmissionStatus()}
                    </span>
                  ) : getSubmissionStatus() === "Draft" ? (
                    <span className="text-danger">{getSubmissionStatus()}</span>
                  ) : (
                    <span className="text-info">{getSubmissionStatus()}</span>
                  )}
                </td>
              </tr>

              {expenseReport?.submission?.decisionDate && (
                <tr>
                  <td className="text-dark">Decision date</td>
                  <td>
                    <span>
                      {moment(expenseReport?.submission?.decisionDate).format(
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

export default ExpenseOverview;
