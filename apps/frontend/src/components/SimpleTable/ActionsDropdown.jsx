import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
const ActionsDropdown = ({ actions = [] }) => {
  const [dropdownOpenState, setDropdownOpenState] = React.useState(false);
  const toggle = () => setDropdownOpenState((prevState) => !prevState);
  return (
    <Dropdown size="sm" isOpen={dropdownOpenState} toggle={toggle}>
      <DropdownToggle data-display="static" className="btn  ml-auto">
        <i className="fa-solid fa-ellipsis-vertical three-dots"></i>
      </DropdownToggle>
      <DropdownMenu right>
        {React.Children.map(actions, (action) => {
          return (
            <DropdownItem key={action.key} {...action.props}>
              {React.cloneElement(action, {})}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ActionsDropdown;
