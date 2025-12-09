import { Nav, NavItem, Tooltip } from "@ims-systems-00/ims-ui-kit";
import PerfectScrollbar from "perfect-scrollbar";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SidebarDrawer from "./SidebarDrawer";
import SidebarToggler from "./SidebarToggler";
import VerticalActiveBar from "./VerticalActiveBar";

const isWindows = /Win/i.test(navigator.userAgent);

var ps;

const Sidebar = ({ slideMenu, setSlideMenu, ...props }) => {
  //states

  const [slideMenuDetails, setSlideMenuDetails] = React.useState({});
  const [slideMenuItemDetails, setSlideMenuItemDetails] = React.useState({});

  const history = useHistory();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const ps = useRef(null);

  useEffect(() => {
    if (isWindows) {
      ps.current = new PerfectScrollbar(sidebarRef.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }

    return function cleanup() {
      if (isWindows && ps.current) {
        ps.current.destroy();
      }
    };
  }, []);

  // For Active items on the top level sidebar / Fixed sidebar
  const activeSidebarItem = (routeName) => {
    return location.pathname === routeName ||
      location.pathname.includes(routeName)
      ? true
      : false;
  };
  // For the active items on the drawer under the sidebar
  const activeCollapseSidebarItem = (views) => {
    return views.find((view) => {
      if (!view.views) {
        return (
          location.pathname === `${view.layout}${view.path}` ||
          location.pathname.includes(`${view.layout}${view.path}`)
        );
      } else {
        return view.views.find((view) => {
          return (
            location.pathname === `${view.layout}${view.path}` ||
            location.pathname.includes(`${view.layout}${view.path}`)
          );
        });
      }
    });
  };

  const sidebarWrapperRef = useRef(null);

  //outside sidebarWrapperRef clicked , close sidebar
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarWrapperRef.current &&
        !sidebarWrapperRef.current.contains(event.target)
      ) {
        setSlideMenu(false);
        setSlideMenuDetails({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarWrapperRef]);

  return (
    <div ref={sidebarWrapperRef}>
      <div
        ref={sidebarRef}
        className={`ims-sidebar ${
          props.sidebarOpened ? "ims-sidebar-open" : "ims-sidebar-close"
        } d-lg-block`}
      >
        {/* Fixed Sidebar */}
        <Nav className="mb-5">
          {props.routes.map((prop, key) => {
            if (prop.redirect) {
              return null;
            }
            if (prop.invisible) return null;
            return (
              <NavItem key={key} className={`w-100  text-center  `}>
                <div
                  style={{
                    margin: `${
                      key === 0 || props.routes.length - 1 === key
                        ? "20px"
                        : "12px"
                    } 0 ${
                      key === 0 - 1 || props.routes.length - 1 === key
                        ? "20px"
                        : "12px"
                    } 0`,
                  }}
                  id={`tooltip-${key}`}
                  className={`d-flex justify-content-center align-items-center sidebar-items 
                  `}
                  onClick={() => {
                    setSlideMenuDetails(prop);
                    if (!prop.collapse) {
                      history.push(prop.layout + prop.path);
                      setSlideMenu(false);
                    } else {
                      setSlideMenu(true);
                    }
                  }}
                >
                  <i
                    className={`${prop.icon} sidebar-icon
                    ${
                      slideMenuDetails.name
                        ? prop.name === slideMenuDetails.name && "text-primary"
                        : !prop.collapse
                        ? activeSidebarItem(prop.layout + prop.path) &&
                          "text-primary"
                        : prop.collapse
                        ? activeCollapseSidebarItem(prop.views) &&
                          "text-primary"
                        : ""
                    }
                    `}
                  />
                  {/* For Active vertical bar on right side */}
                  <VerticalActiveBar
                    slideMenuDetails={slideMenuDetails}
                    activeSidebarItem={activeSidebarItem}
                    activeCollapseSidebarItem={activeCollapseSidebarItem}
                    {...prop}
                  />
                </div>
                <Tooltip placement="right" target={`tooltip-${key}`}>
                  {prop.name}
                </Tooltip>
              </NavItem>
            );
          })}
        </Nav>
        {/* <div className="d-flex justify-content-center align-items-center">
          <SidebarToggler />
        </div> */}
      </div>
      {/* Drawer under the sidebar */}
      <SidebarDrawer
        slideMenu={slideMenu}
        setSlideMenu={setSlideMenu}
        slideMenuDetails={slideMenuDetails}
        setSlideMenuDetails={setSlideMenuDetails}
        slideMenuItemDetails={slideMenuItemDetails}
        setSlideMenuItemDetails={setSlideMenuItemDetails}
        activeCollapseSidebarItem={activeCollapseSidebarItem}
        activeSidebarItem={activeSidebarItem}
        {...props}
      />
    </div>
  );
};

export default Sidebar;
