import { createRoot } from "react-dom/client";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AuthLayout from "@/layouts/Auth/Auth";
import PartnerLayout from "@/layouts/Partnership/Index";
import "@/assets/css/iconly.css";
import "@/assets/css/nucleo-icons.css";
import "@/assets/scss/app.scss";
import ImsFullScreenLoading from "@/components/Loader/ImsFullScreenLoading";
import AdminLayout from "@/layouts/Admin/Admin";
import SystemAdminLayout from "./layouts/SystemAdmin/SystemAdmin";
import Maintanance from "@/layouts/Misc/Maintanance";
import Misc from "@/layouts/Misc/Misc";
import Public from "@/layouts/Public/Public";
import "react-notifications-component/dist/theme.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApplicationContextProvider } from "@/stores/applicationStore";
import { appInitialisers } from "./loaders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
appInitialisers();
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
});

root.render(
  <>
    {process.env.REACT_APP_MODE === "UP" ? (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ApplicationContextProvider>
            <ImsFullScreenLoading />
            <ToastContainer />
            <Switch>
              <Route
                path="/auth"
                render={(props) => <AuthLayout {...props} />}
              />
              <Route
                path="/partner"
                render={(props) => <PartnerLayout {...props} />}
              />
              <Route
                path="/admin"
                render={(props) => <AdminLayout {...props} />}
              />
              <Route
                path="/systemadmin"
                render={(props) => <SystemAdminLayout {...props} />}
              />
              <Route path="/misc" render={(props) => <Misc {...props} />} />
              <Route path="/public" render={(props) => <Public {...props} />} />
              <Redirect from="/" to="/admin/dashboard" />
            </Switch>
          </ApplicationContextProvider>
        </QueryClientProvider>
      </BrowserRouter>
    ) : (
      <Maintanance />
    )}
  </>
);
