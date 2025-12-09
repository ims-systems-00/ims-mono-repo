import useDualStateController from "@/hooks/useDualStateController";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "@ims-systems-00/ims-ui-kit";
import { getCurrentSessionData } from "@/services/authService";
import { downloadFile } from "@/services/fileHandlerService";
import useDocument from "./store/useDocument";

const NodeActions = ({ version }) => {
  let { isOpen: isActionOpen, toggle: toggleActions } =
    useDualStateController();
  const { hasOwnership } = useDocument();
  return (
    <Dropdown size="sm" isOpen={isActionOpen} toggle={toggleActions}>
      <DropdownToggle data-display="static" className="btn-icon ml-auto">
        <i className="fa-solid fa-ellipsis-vertical three-dots"></i>
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem
          onClick={() => {
            downloadFile(version?.documentData?.storageInfo);
          }}
        >
          <i className="fa-solid fa-download" /> Download a copy
        </DropdownItem>
        {/* {hasOwnership(getCurrentSessionData()?.user?._id) && (
          <DropdownItem onClick={() => {}}>
            <i className="fa-solid fa-trash-can" /> Remove
          </DropdownItem>
        )} */}
      </DropdownMenu>
    </Dropdown>
  );
};

export default NodeActions;
