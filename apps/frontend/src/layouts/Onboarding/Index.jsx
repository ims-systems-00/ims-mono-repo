import React from "react";
import { ReactNotifications } from "react-notifications-component";
import { Redirect, Route, Switch } from "react-router-dom";
import NotificationContext from "../../contexts/notificationContext";
import Footer from "@/components/Footer/Footer";
import useNotification from "@/hooks/useNotification";
import routes from "@/routes.js";

const Pages = (props) => {
  React.useEffect(() => {
    document.documentElement.classList.remove("nav-open");
    document.body.classList.remove("white-content");
  });
  const { notify } = useNotification();
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/onboarding") {
        return (
          <Route
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
      } else if (window.location.pathname.includes("/auth/setuppassword")) {
        return "Setup password";
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
  return (
    <React.Fragment>
      <ReactNotifications />
      <div className="wrapper wrapper-full-page">
        <div className={"full-page "}>
          <Switch>
            <NotificationContext.Provider value={notify}>
              {getRoutes(routes)}
            </NotificationContext.Provider>
            <Redirect from="*" to="/auth/login" />
          </Switch>
          <Footer fluid />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Pages;
