import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AuthNavbar from "@/components/Navbars/AuthNavbar";
import Footer from "@/components/Footer/Footer";
import routes from "@/routes.js";
import AlertContextProvider from "@/contexts/AlertContext";
import useAccess from "@/hooks/useAccess";
import useNotification from "@/hooks/useNotification";
import NotificationContext from "@/contexts/notificationContext";
import { ReactNotifications } from "react-notifications-component";

const Public = (props) => {
  const { hasLimitedAccess, isLoggedIn } = useAccess();
  React.useEffect(() => {
    document.documentElement.classList.remove("nav-open");
    document.body.classList.add("white-content");
  });
  const { notify } = useNotification();
  const getRoutes = (routes) => {
    if (!hasLimitedAccess() && !isLoggedIn()) return [];
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/public") {
        return (
          <Route
            exact
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
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  // we shall handle the token validation logic here...
  return (
    <AlertContextProvider>
      <NotificationContext.Provider value={notify}>
        <ReactNotifications />
        <div className="wrapper public">
          <div className="main-panel">
            <AuthNavbar brandText={getActiveRoute(routes)} />
            <Switch>
              {getRoutes(routes)}
              <Redirect from="*" to="/auth/login" />
            </Switch>
            {
              // we don't want the Footer to be rendered on full screen maps page
              props.location.pathname.indexOf("full-screen-map") !==
              -1 ? null : (
                <Footer fluid />
              )
            }
          </div>
        </div>
      </NotificationContext.Provider>
    </AlertContextProvider>
  );
};

export default Public;
