import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "@ims-systems-00/ims-ui-kit";
import { useState } from "react";

const ColorIndication = () => {
  const colorData = [
    {
      name: "Incidents Management",
      bgColor: "#fd5298",
    },
    {
      name: "Audits Management",
      bgColor: "#00c3a5",
    },
    {
      name: "Supplier Management",
      bgColor: "#ff8778",
    },
    {
      name: "Management Review",
      bgColor: "#589df3",
    },
  ];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  return (
    <div className="">
      <Dropdown isOpen={dropdownOpen} size="md" toggle={toggle}>
        <DropdownToggle className="font-weight-light">
          Color Code
        </DropdownToggle>
        <DropdownMenu className="">
          {colorData.map((colorDatum) => (
            <DropdownItem className="">
              <div className="d-flex">
                <div
                  style={{
                    height: "15px",
                    width: "15px",
                    backgroundColor: `${colorDatum.bgColor}`,
                    borderRadius: "50%",
                    marginLeft: "10px",
                  }}
                ></div>
                <div className="ml-2">{colorDatum.name}</div>
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ColorIndication;
