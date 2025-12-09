import classNames from "classnames";
import {
  Button,
  ButtonGroup,
  Collapse,
  DrawerContextProvider,
  Nav,
  NavItem,
  Navbar,
  NavbarToggler,
} from "@ims-systems-00/ims-ui-kit";
import KBEmbeded from "@/components/KnowledgeBase/Index";
import React from "react";
import AccountDropDown from "./AccountDropDown";
import Clockin from "./ClockIn";
import Notifications from "./Notifications";
import GlobalSearch from "./GlobalSearch";
import SendMailModal from "./SendMailModal";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { useApplication } from "@/stores/applicationStore";
import { Link } from "react-router-dom";
import aliceLogoHeadFilled from "../../../assets/img/alice-logo-head-filled.png";
const AdminNavbar = (props) => {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [modalSend, setModalSend] = React.useState(false);
  const [openClockIn, setOpenClockIn] = React.useState(false);
  const [setColor] = React.useState("bg-white");
  const { membershipData, tokenPair } = useApplication();
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("bg-white");
    }
  };
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const dropdownRef = React.useRef(null);

  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("bg-white");
    }
    setCollapseOpen(!collapseOpen);
  };
  // this function is to open the Search modal
  const toggleModalSend = () => {
    setModalSend(!modalSend);
  };

  const toggleModalClockIn = () => {
    setOpenClockIn(!openClockIn);
  };

  return (
    <React.Fragment>
      <Navbar className="admin-navbar  sticky-top" expand="lg">
        <Button
          size="sm"
          outline
          className="border-0 d-md-none bg-transparent"
          onClick={props.onSibebarToggle && props.onSibebarToggle}
        >
          <i className="ims-icons-20 icon-icon-squaresfour-24"></i>
        </Button>
        <Button
          size={"sm"}
          onClick={props.onSidebarCollapse && props.onSidebarCollapse}
          outline
          className="rounded-pill d-none d-md-inline border-0"
        >
          {props.sidebarCollapsed ? (
            <i className="ims-icons-20 icon-icon-list-20" />
          ) : (
            <i className="ims-icons-20 icon-icon-cross-20" />
          )}
        </Button>{" "}
        <h5 className="mx-2">
          {tokenPair?.accessTokenData?.user?.organizationName}
        </h5>
        <NavbarToggler onClick={toggleCollapse} />
        <Dropdown className="ms-2" isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            ref={dropdownRef}
            color="secondary"
            className="rounded-pill border-0 shadow-none"
            size="sm"
          >
            <i class="fa-solid fa-bolt pr-2" /> Quick Actions{" "}
            <i
              className={classNames("fa-solid", {
                "fa-angle-up": dropdownOpen,
                "fa-angle-down": !dropdownOpen,
              })}
            ></i>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              data-target="#searchModal"
              data-toggle="modal"
              onClick={toggleModalSend}
            >
              <Button
                size="sm"
                className="btn-icon d-flex align-items-center m-0"
              >
                <i className="ims-icons-20 icon-icon-paperplanetilt-24" />
                <span className="px-2 ml-0">Send Report</span>
              </Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Collapse navbar isOpen={collapseOpen}>
          <GlobalSearch />

          <Nav navbar>
            {/* <NavItem>
              <Link to="/admin/guidelines" className="nav-link">
                <i className="fa-solid fa-circle-play" />
              </Link>
            </NavItem> */}
            <DrawerContextProvider>
              <NavItem>
                <Notifications />
              </NavItem>
              <NavItem>
                <KBEmbeded />
              </NavItem>
            </DrawerContextProvider>
            {membershipData?.organization?.isCustomer && (
              <NavItem>
                <ButtonGroup className="mx-1">
                  <a
                    href="https://alice.imssystems.tech"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="photo mt-1 p-0  border"
                  >
                    <img
                      style={{ cursor: "pointer" }}
                      src={aliceLogoHeadFilled}
                      alt="alice"
                    />
                  </a>
                </ButtonGroup>
              </NavItem>
            )}
            <NavItem>
              <AccountDropDown />
            </NavItem>
            <li className="separator d-lg-none" />
          </Nav>
        </Collapse>
      </Navbar>
      <SendMailModal modalSend={modalSend} toggleModalSend={toggleModalSend} />
      <Clockin
        openClockIn={openClockIn}
        toggleModalClockIn={toggleModalClockIn}
      />
    </React.Fragment>
  );
};

export default AdminNavbar;
