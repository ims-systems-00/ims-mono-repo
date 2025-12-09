import useDualStateController from "@/hooks/useDualStateController";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "@ims-systems-00/ims-ui-kit";
import { useHistory } from "react-router-dom";
const RequestTableActions = ({ request }) => {
  const { isOpen: isActionOpen, toggle: toggleActions } =
    useDualStateController();
  const history = useHistory();
  return (
    <Dropdown size="sm" isOpen={isActionOpen} toggle={toggleActions}>
      <DropdownToggle data-display="static" className="btn  ml-auto">
        <i className="fa-solid fa-ellipsis-vertical three-dots"></i>
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem
          onClick={() =>
            history.push(
              `/admin/document-repositories/${
                request?.repository?._id || request?.repository
              }/nodes/${request?.node?._id || request?.node}`
            )
          }
        >
          <i className="fa-solid fa-file" /> View document
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default RequestTableActions;
