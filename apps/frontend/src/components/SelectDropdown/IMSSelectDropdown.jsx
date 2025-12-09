import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "@ims-systems-00/ims-ui-kit";
import { useState } from "react";

const IMSSelectDropdown = ({
  buttonText = "Select",
  showValue = false,
  listItems = [],
  onSelect = () => {},
  disabled = false,
  ...props
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(buttonText);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  return (
    <div className="d-flex select-dropdown-container">
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        direction={"down"}
        className="select-dropdown-btn"
      >
        <DropdownToggle disabled={disabled} caret>
          {!showValue ? buttonText : selectedValue}
        </DropdownToggle>
        <DropdownMenu className="" {...props}>
          {listItems?.map((item, index) => {
            return (
              <DropdownItem
                onClick={() => {
                  onSelect(item);
                  setSelectedValue(item);
                }}
                // className="px-3"
                key={index}
              >
                {item}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default IMSSelectDropdown;
