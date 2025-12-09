import classNames from "classnames";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React, { useRef, useState } from "react";
import Clockin from "./ClockIn";
import SendMailModal from "./SendMailModal";

const QuickActions = () => {
  const [modalSend, setModalSend] = React.useState(false);
  const [openClockIn, setOpenClockIn] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleModalSend = () => {
    setModalSend(!modalSend);
  };

  const toggleModalClockIn = () => {
    setOpenClockIn(!openClockIn);
  };

  return (
    <React.Fragment>
      <nav className="button-group mb-0 rounded">
        <UncontrolledButtonDropdown
          isOpen={dropdownOpen}
          toggle={toggleDropdown}
        >
          <DropdownToggle
            ref={dropdownRef}
            color="primary"
            className="ml-0 my-md-2 me-0"
            aria-expanded={dropdownOpen}
          >
            <i className="fa-solid fa-bolt pr-2" />
            Quick Actions
          </DropdownToggle>
          <DropdownMenu>
            <div onClick={toggleModalClockIn}>
              <DropdownItem data-target="#searchModal" data-toggle="modal">
                <Button
                  size="sm"
                  className="btn-icon d-flex align-items-center m-0"
                >
                  <i className="ims-icons-20 icon-icon-clockclockwise-24" />
                  <span className="px-2 ml-0">Work log</span>
                </Button>
              </DropdownItem>
            </div>
            <div onClick={toggleModalSend}>
              <DropdownItem data-target="#searchModal" data-toggle="modal">
                <Button
                  size="sm"
                  className="btn-icon d-flex align-items-center m-0"
                  disabled={true}
                >
                  <i className="ims-icons-20 icon-icon-paperplanetilt-24" />
                  <span className="px-2 ml-0">Send Report</span>
                </Button>
              </DropdownItem>
            </div>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <Button
          onClick={toggleDropdown}
          color="primary"
          className="my-md-2"
          aria-expanded={dropdownOpen}
        >
          <i
            className={classNames("fa-solid", {
              "fa-angle-up": dropdownOpen,
              "fa-angle-down": !dropdownOpen,
            })}
          ></i>
        </Button>
      </nav>
      <SendMailModal modalSend={modalSend} toggleModalSend={toggleModalSend} />
      <Clockin
        openClockIn={openClockIn}
        toggleModalClockIn={toggleModalClockIn}
      />
    </React.Fragment>
  );
};

export default QuickActions;
