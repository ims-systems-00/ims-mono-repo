import { Redirect, Switch } from "react-router-dom";
// contexts ...
// core components
import ProtectedRoute from "@/components/Protected/ProtectedRout";
import useAccess from "@/hooks/useAccess";
import useNotification from "@/hooks/useNotification";
import routes from "@/routes.js";
import { useApplication } from "@/stores/applicationStore";
const Misc = (props) => {
  const { notify } = useNotification();
  const { authUser } = useAccess();
  const { isLoggedIn } = useApplication();
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/misc") {
        return (
          <ProtectedRoute
            exact
            isAuthorised={isLoggedIn()}
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
    <Switch>
      {getRoutes(routes)}
      <Redirect from="*" to="/admin/dashboard" />
    </Switch>
  );
};

export default Misc;
