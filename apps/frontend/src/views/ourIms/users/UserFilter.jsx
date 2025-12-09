import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "@ims-systems-00/ims-ui-kit";
import filters from "./filters/filters";
import { useUserManager } from "./store";

const UserFilter = () => {
  const { toolState, updateFilter } = useUserManager();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  
  const toggle = () => setDropdownOpen(prevState => !prevState);
  
  const handleFilterChange = (filter) => {
    updateFilter(filter);
  };

  // Find the current filter label
  const currentFilter = filters.find(
    filter => JSON.stringify(filter.value) === JSON.stringify(toolState.filter.value)
  );
  
  const currentLabel = currentFilter ? currentFilter.label : "All active users";

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>
        {currentLabel}
      </DropdownToggle>
      <DropdownMenu>
        {filters.map((filter, index) => (
          <DropdownItem
            key={index}
            onClick={() => handleFilterChange(filter)}
            active={JSON.stringify(filter.value) === JSON.stringify(toolState.filter.value)}
          >
            {filter.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserFilter;