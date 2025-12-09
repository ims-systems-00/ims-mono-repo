import TooltipButton from "@/components/Tooltip/TooltipButton";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import USER_ACTIONS from "./actions";
import { useSupplier } from "./store";
const ContractsButtons = ({ ...props }) => {
  let { processing, deleteContract } = useSupplier();
  let { alert, warningWithConfirmMessage } = useAlerts();

  let { authUser } = useAccess();

  return (
    <>
      {alert}
      {authUser({
        service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW,
      }) && (
        <TooltipButton
          tooltip="Delete"
          onClick={(e) => {
            warningWithConfirmMessage(
              "This contract file will be deleted",
              () => {
                deleteContract(props?.attachment);
              }
            );
          }}
          disabled={
            processing[USER_ACTIONS.DELETE_CONTRACT].status &&
            processing[USER_ACTIONS.DELETE_CONTRACT].id ===
              props?.attachment?._id
          }
          name="delete"
          size="sm"
          id="delete"
          // className="btn-icon  like btn-danger"
          color="link"
          className="btn-link-danger border border-0"
        >
          {" "}
          {processing[USER_ACTIONS.DELETE_CONTRACT].status &&
          processing[USER_ACTIONS.DELETE_CONTRACT].id ===
            props?.attachment?._id ? (
            <Spinner size="sm" />
          ) : (
            <i className="ims-icons-20 icon-icon-trash-24" />
          )}
        </TooltipButton>
      )}
    </>
  );
};

export default ContractsButtons;
