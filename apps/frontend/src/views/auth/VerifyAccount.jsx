import { Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { verifyAccount } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import Layout from "./Layout";
import useError from "../../hooks/error";
import { useApplication } from "@/stores/applicationStore";
import NotificationContext from "@/contexts/notificationContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const VerifyAccount = (props) => {
  const history = useHistory();
  let notify = React.useContext(NotificationContext);
  // defination of dataSet...
  const { handleError } = useError();
  const {
    refreshToken,
    freezImsForLoading,
    unFreezImsForLoading,
    refreshCache,
  } = useApplication();
  // submission logic to sever goes here ...
  let verify = async () => {
    freezImsForLoading("We are verifying your account...");
    try {
      let { data } = await verifyAccount({
        token: props.match.params.token,
      });
      await refreshToken();
      await refreshCache();
      notify(data.message, "success");
      unFreezImsForLoading();
      history.push("/auth/preparation-screen");
    } catch (ex) {
      imsLogger("VerifyAccount", ex);
      handleError(ex);
      unFreezImsForLoading();
    }
  };
  return (
    <Layout>
      <React.Fragment>
        <div className="">
          <h4>Verify Account</h4>
          <p className="mb-4">
            Please click on the confirm button to verify your account.
          </p>
        </div>
        <Button
          block
          disabled={false}
          className="mb-3"
          color="primary"
          size="md"
          onClick={verify}
        >
          {false ? "Processing..." : "Confirm"}
        </Button>
      </React.Fragment>
    </Layout>
  );
};

export default VerifyAccount;
