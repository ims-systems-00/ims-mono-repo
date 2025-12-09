import TooltipButton from "@/components/Tooltip/TooltipButton";
import useAccess from "@/hooks/useAccess";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import useExpense from "../hooks/useExpense";
import { useExpenseReport } from "../store";

const ExpenseAttachmentButtons = ({ expense, ...props }) => {
  let { isDecidedReport } = useExpense();
  let { authUser } = useAccess();
  let {
    visitingExpenseReport: expenseReport,
    alert,
    processing,
    deleteExpenseAttachment,
    warningWithConfirmMessage,
  } = useExpenseReport();
  return (
    <>
      {/* {alert} */}
      {!isDecidedReport(expenseReport) &&
        authUser({
          service: IMS_SERVICES.INCIDENT_MANAGEMENT,
          action: ACTIONS.DELETE,
          effect: EFFECTS.ALLOW,
        }) && (
          <TooltipButton
            tooltip="Delete"
            onClick={(e) => {
              e.stopPropagation();
              warningWithConfirmMessage(
                "This attachment will be deleted",
                () => {
                  deleteExpenseAttachment(props?.attachment, expense._id);
                }
              );
            }}
            disabled={
              processing.action === "delete-attachment" &&
              processing.id === props?.attachment?._id
            }
            name="delete"
            size="sm"
            id="delete"
            // className="btn-icon  like btn-danger"
            color="danger"
            outline
            className="btn-link-danger border border-0"
          >
            {" "}
            {processing.action === "delete-attachment" &&
            processing.id === props?.attachment?._id ? (
              <Spinner size="sm" />
            ) : (
              <i className="ims-icons-20 icon-icon-trash-24" />
            )}
          </TooltipButton>
        )}
    </>
  );
};

export default ExpenseAttachmentButtons;
