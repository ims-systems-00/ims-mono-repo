import useDualStateController from "@/hooks/useDualStateController";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "@ims-systems-00/ims-ui-kit";
import { getCurrentSessionData } from "@/services/authService";
import useRepository from "./store/useRepository";
const MoreDropdown = ({}) => {
  const {
    viewTrashBin,
    isBinActive,
    viewAuthorisationRequest,
    viewPendingApproval,
  } = useRepository();
  const { isOpen: isDropdownOpen, toggle: toggleDropDown } =
    useDualStateController();
  return (
    <>
      <Dropdown isOpen={isDropdownOpen} toggle={toggleDropDown}>
        <DropdownToggle className="border-0 ms-1">
          <i className="fa-solid fa-ellipsis-vertical three-dots"></i>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            onClick={() => {
              viewAuthorisationRequest(getCurrentSessionData()?.user?._id);
            }}
          >
            <i className="fa-solid fa-code-pull-request" /> Authorisation
            Requests
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              viewPendingApproval(getCurrentSessionData()?.user?._id);
            }}
          >
            <i className="fa-solid fa-circle-exclamation" /> Pending approval
          </DropdownItem>
          {!isBinActive() && (
            <DropdownItem onClick={viewTrashBin}>
              {" "}
              <i className="fa-solid fa-trash" /> View recycle bin
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default MoreDropdown;
