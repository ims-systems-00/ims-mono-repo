import classNames from "classnames";
import { Nav, NavItem, NavLink } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
const PanelNavigation = ({
  navLinks,
  backLinks,
  horizontalTabs,
  changeActiveTab,
}) => {
  let history = useHistory();
  return (
    <div className="mb-3">
      <Nav tabs full type="3">
        {navLinks &&
          navLinks.map((navlink, i) => (
            <React.Fragment key={navlink}>
              <NavItem>
                <NavLink
                  data-toggle="tab"
                  href="#"
                  className={classNames("nav-link", {
                    " active": horizontalTabs === navlink,
                  })}
                  onClick={(e) => changeActiveTab(e, navlink)}
                >
                  {navlink}
                </NavLink>
              </NavItem>
              {i < navLinks.length - 1 && (
                <NavItem>
                  <NavLink
                    data-toggle="tab"
                    href="#"
                    className={"px-1 text-secondary"}
                  >
                    |
                  </NavLink>
                </NavItem>
              )}
            </React.Fragment>
          ))}
        {backLinks &&
          backLinks.map((item, i) => (
            <NavItem key={item.link}>
              <NavLink
                data-toggle="tab"
                href="#"
                onClick={() => history.goBack()}
              >
                {item.linkText}
              </NavLink>
            </NavItem>
          ))}
      </Nav>
    </div>
  );
};

export default PanelNavigation;
