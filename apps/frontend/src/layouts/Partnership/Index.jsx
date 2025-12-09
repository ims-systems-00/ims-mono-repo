import PerfectScrollbar from "perfect-scrollbar";
import React from "react";
import { ReactNotifications } from "react-notifications-component";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Redirect, Switch, useLocation } from "react-router-dom";
// contexts ...
import AlertContextProvider from "@/contexts/AlertContext";
import NotificationContext from "@/contexts/notificationContext";

// core components
import classNames from "classnames";
import Footer from "@/components/Footer/Footer";
import AdminNavbar from "@/components/Navbars/Admin/AdminNavbar";
import ProtectedRoute from "@/components/Protected/ProtectedRout";
import {
  OmniplexGuide,
  OmniplexJourneyProvider,
} from "@/components/omniplexGuide/index";
import SuperGlobalAdminProvider from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useNotification from "@/hooks/useNotification";
import routes from "@/routes.js";
import { useApplication } from "@/stores/applicationStore";

var ps;

const Partnership = (props) => {
  const mainPanelRef = React.useRef(null);
  const location = useLocation();
  const { notify } = useNotification();
  const { authUser } = useAccess();
  const { isLoggedIn } = useApplication();
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location]);
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.classList.add("perfect-scrollbar-on");
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanelRef.current);
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  }, []);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/partner") {
        return (
          <ProtectedRoute
            exact
            isAuthorised={isLoggedIn() && authUser(prop.accessPolicy || [])}
            path={prop.layout + prop.path}
            component={prop.component}
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
      if (prop.collapse) {
        prop.views = getAuthorisedRouts(prop.views);
        if (!prop.views.length) return false;
      }
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
            routes[i].layout + routes[i].path
          ) !== -1
        ) {
          return routes[i];
        }
      }
    }
    return activeRoute;
  };
  return (
    <OmniplexJourneyProvider>
      <SuperGlobalAdminProvider>
        <AlertContextProvider>
          <div className="wrapper">
            <ReactNotifications />
            {/**
             * This is a temporary this needs to be replaced with perfect scrollbar later
             */}
            <div ref={mainPanelRef}></div>
            <NotificationContext.Provider value={notify}>
              <div className={classNames("main-panel")}>
                <AdminNavbar {...props} route={getActiveRoute(routes)} />
                <Switch>
                  {getRoutes(routes)}
                  <Redirect from="*" to="/admin/organisation" />
                </Switch>
                {
                  // we don't want the Footer to be rendered on full screen maps page
                  props.location.pathname.indexOf("full-screen-map") !==
                  -1 ? null : (
                    <Footer fluid />
                  )
                }
                <OmniplexGuide />
              </div>
            </NotificationContext.Provider>
          </div>
        </AlertContextProvider>
      </SuperGlobalAdminProvider>
    </OmniplexJourneyProvider>
  );
};

export default Partnership;
