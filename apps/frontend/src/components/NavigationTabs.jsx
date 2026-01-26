import {
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarToggler,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { TourStep } from "./Tour";
function NavigationTabs({ navigations = [], defaultActiveId, ...rest }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(
    defaultActiveId || navigations[0]?.id,
  );
  const toggle = () => setIsOpen(!isOpen);

  React.useEffect(() => {
    if (defaultActiveId) {
      setActiveTab(defaultActiveId);
    }
  }, [defaultActiveId]);
  return (
    <React.Fragment>
      <Navbar
        expand="md"
        className={
          "navigation-tabs bg-white border-bottom pb-md-0 overflow-x-auto"
        }
        {...rest}
      >
        <NavbarToggler className={"ms-auto"} onClick={toggle} />
        <Collapse timeout={3000} isOpen={isOpen} navbar>
          <Nav className="me-auto" pills navbar>
            {navigations.map((navigation) => {
              return (
                <NavItem
                  key={uuidv4()}
                  active={activeTab === navigation.id}
                  onClick={() => setActiveTab(navigation.id)}
                >
                  <TourStep key={uuidv4()} stepId={navigation.id}>
                    <Link to={"#"}>
                      <NavLink className=" d-flex align-items-center justify-content-center gap-1 text-nowrap">
                        {navigation.icon} {navigation.text}
                      </NavLink>
                    </Link>
                  </TourStep>
                </NavItem>
              );
            })}
          </Nav>
        </Collapse>
      </Navbar>
      {navigations.map((navigation) => {
        return (
          <div
            key={navigation.id}
            className={activeTab === navigation.id ? "d-block" : "d-none"}
          >
            {navigation.component}
          </div>
        );
      })}
    </React.Fragment>
  );
}

export default NavigationTabs;
