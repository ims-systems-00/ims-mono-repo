import TooltipButton from "@/components/Tooltip/TooltipButton";
import useAccess from "@/hooks/useAccess";
import { Spinner } from "@ims-systems-00/ims-ui-kit";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import USER_ACTIONS from "./actions";
import { useSoftwareAssets } from "./store";

const DocumentsDeleteButton = ({ ...props }) => {
  const {
    software,
    processing,
    warningWithConfirmMessage,
    handleDeleteSoftwareDoc,
  } = useSoftwareAssets();

  let { authUser } = useAccess();

  return (
    <>
      {authUser({
        service: IMS_SERVICES.INVENTORY,
        action: ACTIONS.DELETE,
        effect: EFFECTS.ALLOW,
      }) && (
        <TooltipButton
          tooltip="Delete"
          onClick={(e) => {
            warningWithConfirmMessage("This attachment will be deleted", () => {
              handleDeleteSoftwareDoc(software._id, props?.attachment);
            });
          }}
          disabled={
            processing[USER_ACTIONS.DELETE_SOFTWARE_DOC] &&
            processing[USER_ACTIONS.DELETE_SOFTWARE_DOC].id ===
              props?.attachment?._id
          }
          name="delete"
          size="sm"
          id="delete"
          // className="btn-icon  like btn-danger"
          color="link"
          outline
          className="btn-link-danger border border-0"
        >
          {" "}
          {processing[USER_ACTIONS.DELETE_SOFTWARE_DOC] &&
          processing[USER_ACTIONS.DELETE_SOFTWARE_DOC].id ===
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

export default DocumentsDeleteButton;
