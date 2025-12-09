import { Input } from "reactstrap";
import { useState } from "react";

const SidebarToggler = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div onClick={handleToggle} className="ims-toggle-switch-wrapper">
      <Input
        type="checkbox"
        id="ims-toggle-switch"
        className="ims-toggle-switch"
        checked={isChecked}
      />
      <div
        className={`ims-toggle-slider ${isChecked ? "toggle-checked" : ""}`}
      />
    </div>
  );
};

export default SidebarToggler;
