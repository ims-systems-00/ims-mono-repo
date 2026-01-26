import logo from "@/assets/img/ims-systems-full-logo-white.png";
import Footer from "@/components/Footer/Footer";
import AdminNavbar from "@/components/Navbars/Admin/AdminNavbar";
import SystemAdminProtectedRoute from "@/components/Protected/SystemAdminProtectedRoute";
import { OmniplexJourneyProvider } from "@/components/omniplexGuide/index";
import AlertContextProvider from "@/contexts/AlertContext";
import SuperGlobalAdminProvider from "@/contexts/SuperGlobalContext";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useNotification from "@/hooks/useNotification";
import React from "react";
import { ReactNotifications } from "react-notifications-component";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Redirect, Switch, useHistory, useLocation } from "react-router-dom";

import { TourStep } from "@/components/Tour";
import routes from "@/routes.js";
import { useApplication } from "@/stores/applicationStore";
import classNames from "classnames";
import {
  Menu,
  MenuItem,
  Sidebar,
  SubMenu,
  menuClasses,
  sidebarClasses,
} from "react-pro-sidebar";
import { v4 as uuidv4 } from "uuid";

import organisationRoutes from "../../views/organisations/routes";
const allRoutes = [...organisationRoutes];

const themeColos = {
  primaryColor: "#002D72",
  activeColor: "#0040A3",
  subMenuActiveColor: "#073980",
};

const menuStyles = {
  padding: "7px",
  [`.${menuClasses.button}`]: {
    borderRadius: "8px",
    height: "auto",
    paddingRight: "15px",
    paddingLeft: "15px",
    paddingBottom: "5px",
    paddingTop: "5px",
    color: "white",
    marginTop: 5,
    "&:hover": {
      backgroundColor: themeColos.activeColor + " !important",
    },
    ["&." + menuClasses.active]: {
      backgroundColor: themeColos.activeColor + " !important",
      fontWeight: "bold",
    },
  },
  [`.${menuClasses.subMenuRoot}`]: {
    borderRadius: 8,
    [`&.${menuClasses.open}`]: {
      backgroundColor: themeColos.subMenuActiveColor + " !important",
    },
  },
};

const SystemAdmin = (props) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [sidebarToggled, setSidebarToggled] = React.useState(false);
  const location = useLocation();
  const { notify } = useNotification();
  const {
    authUser,
    authAdditionalModulesLicense,
    authComplianceToolkitLicense,
    authCarboCalcLicense,
    authProjectiMSLicense,
  } = useAccess();
  const history = useHistory();
  const { membershipData } = useApplication();

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (routes)
        if (prop.collapse) {
          return getRoutes(prop.views);
        }
      if (prop.layout === "/systemadmin") {
        return (
          <SystemAdminProtectedRoute
            exact
            path={prop.layout + prop.path}
            component={prop.component}
            licenseRequirements={prop.licenseRequirements || null}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const getAuthorisedRouts = (routes) => {
    return routes.filter((prop) => {
      if (!membershipData?.organization?.isCustomer) return false;
      if (prop.collapse) {
        if (prop.accessPolicy && !authUser(prop.accessPolicy || []))
          return false;
        if (
          prop.licenseRequirements?.additionalModule &&
          !authAdditionalModulesLicense(
            prop.licenseRequirements?.additionalModule,
          )
        )
          return false;
        if (
          prop.licenseRequirements?.complianceTool &&
          !authComplianceToolkitLicense(
            prop.licenseRequirements?.complianceTool,
          )
        )
          return false;
        prop.views = getAuthorisedRouts(prop.views);
        if (!prop.views.length) return false;
      }
      if (
        prop.licenseRequirements?.additionalModule &&
        !authAdditionalModulesLicense(
          prop.licenseRequirements?.additionalModule,
        )
      )
        return false;
      if (
        prop.licenseRequirements?.complianceTool &&
        !authComplianceToolkitLicense(prop.licenseRequirements?.complianceTool)
      )
        return false;
      return authUser(prop.accessPolicy || []);
    });
  };

  const getActiveRoute = (routes) => {
    let activeRoute = "";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.pathname.indexOf(
            routes[i].layout + routes[i].path,
          ) !== -1
        ) {
          return routes[i];
        }
      }
    }
    return activeRoute;
  };

  const collapseSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSubmenuClick = () => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  };

  return (
    <OmniplexJourneyProvider>
      <SuperGlobalAdminProvider>
        <AlertContextProvider>
          <ReactNotifications />
          <NotificationContext.Provider value={notify}>
            <div className="main-layout">
              <Sidebar
                collapsed={sidebarCollapsed}
                toggled={sidebarToggled}
                customBreakPoint="764px"
                onBackdropClick={() => setSidebarToggled(false)}
                rootStyles={{
                  overflow: "hidden",
                  position: "sticky",
                  top: 0,
                  height: "100vh",
                  [`.${sidebarClasses.container}`]: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: themeColos.primaryColor,
                    position: "relative",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    "-ms-overflow-style": "none",
                  },
                  [`&.${sidebarClasses.broken}`]: {
                    zIndex: 1051,
                  },
                  [`.ps-submenu-expand-icon`]: {
                    display: sidebarCollapsed ? "none" : "block",
                  },
                }}
              >
                <Menu rootStyles={menuStyles}>
                  <MenuItem
                    rootStyles={{
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      backgroundColor: themeColos.primaryColor,
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        className={classNames("w-75 my-2 ms-2", {
                          "d-none": sidebarCollapsed,
                        })}
                        alt="brand-name"
                        src={logo}
                      />
                    </div>
                  </MenuItem>
                  {getAuthorisedRouts(allRoutes).map((menuitem) =>
                    menuitem.collapse ? (
                      <TourStep
                        key={menuitem.name}
                        stepId={menuitem?.screenIdentifier || uuidv4()}
                      >
                        <SubMenu
                          label={menuitem.name}
                          onClick={handleSubmenuClick}
                          active={menuitem?.views
                            .map((view) => view.layout + view.path)
                            .includes(location.pathname)}
                          icon={<i className={`${menuitem.icon}`} />}
                          rootStyles={{
                            ["." + menuClasses.subMenuContent]: {
                              backgroundColor: "transparent !important",
                            },
                          }}
                        >
                          {menuitem?.views?.map(
                            (view) =>
                              !view.invisible && (
                                <TourStep
                                  key={view.name}
                                  stepId={view?.screenIdentifier || uuidv4()}
                                >
                                  <MenuItem
                                    key={view.name}
                                    active={
                                      location.pathname ===
                                      view.layout + view.path
                                    }
                                    className={"pl-3"}
                                    icon={<i className={`${view.icon}`} />}
                                    onClick={() =>
                                      history.push(view.layout + view.path)
                                    }
                                  >
                                    {view.name}
                                  </MenuItem>
                                </TourStep>
                              ),
                          )}
                        </SubMenu>
                      </TourStep>
                    ) : (
                      !menuitem.invisible && (
                        <TourStep
                          key={menuitem.name}
                          stepId={menuitem?.screenIdentifier || uuidv4()}
                        >
                          <MenuItem
                            active={
                              location.pathname ===
                              menuitem.layout + menuitem.path
                            }
                            key={menuitem.path}
                            className="p-0"
                            icon={<i className={`${menuitem.icon}`} />}
                            onClick={() =>
                              history.push(menuitem.layout + menuitem.path)
                            }
                          >
                            {menuitem.name}
                          </MenuItem>
                        </TourStep>
                      )
                    ),
                  )}
                  {authCarboCalcLicense() && (
                    <TourStep stepId="carbon-calculator">
                      <MenuItem
                        className="p-0"
                        icon={
                          <i className={`ims-icons-20 icon-icon-cloud-20`} />
                        }
                        onClick={() =>
                          window.open(
                            process.env.REACT_APP_CARBO_CARLC_CLIENT_URL,
                            "_blank",
                          )
                        }
                      >
                        Carbon calculator
                      </MenuItem>
                    </TourStep>
                  )}
                  {authProjectiMSLicense() && (
                    <TourStep stepId="project-ims">
                      <MenuItem
                        className="p-0"
                        icon={
                          <i
                            className={`ims-icons-20 icon-icon-appwindow-20`}
                          />
                        }
                        onClick={() =>
                          window.open(
                            process.env.REACT_APP_PROJECTS_CLIENT_URL,
                            "_blank",
                          )
                        }
                      >
                        Project iMS
                      </MenuItem>
                    </TourStep>
                  )}
                </Menu>
              </Sidebar>
              <div className="main-container">
                <AdminNavbar
                  {...props}
                  onSibebarToggle={() => setSidebarToggled((t) => !t)}
                  sidebarCollapsed={sidebarCollapsed}
                  onSidebarCollapse={collapseSidebar}
                  route={getActiveRoute(routes)}
                />
                <Switch>
                  {getRoutes(allRoutes)}
                  <Redirect from="*" to="/systemadmin/organisation" />
                </Switch>
                <Footer fluid default />
              </div>
            </div>
          </NotificationContext.Provider>
        </AlertContextProvider>
      </SuperGlobalAdminProvider>
    </OmniplexJourneyProvider>
  );
};

export default SystemAdmin;
