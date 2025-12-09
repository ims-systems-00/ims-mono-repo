import { Container, Spinner } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { logout } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";

const Logout = () => {
  const history = useHistory();
  React.useEffect(() => {
    async function clearSession() {
      try {
        await logout();
      } catch (err) {
        imsLogger("Log out", err);
      }
      history.push("/auth/login");
    }
    clearSession();
  }, []);
  return (
    <>
      <div className="container-login text-center mt-5 pt-5  ">
        <Container>
          <span className="font-size-subtitle-2">
            <Spinner size="sm" /> Your session has ended. We are logging you
            out...
          </span>
        </Container>
      </div>
    </>
  );
};

export default Logout;
