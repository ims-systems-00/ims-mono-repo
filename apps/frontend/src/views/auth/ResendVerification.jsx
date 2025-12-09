import NotificationContext from "@/contexts/notificationContext";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { resendVerificationEmail } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import Layout from "./Layout";
import { useApplication } from "@/stores/applicationStore";
import useError from "../../hooks/error";

const ResendVerification = (props) => {
  let notify = React.useContext(NotificationContext);
  const { currentUserData, freezImsForLoading, unFreezImsForLoading } =
    useApplication();
  const { handleError } = useError();
  // submission logic to sever goes here ...
  const resendEmail = async () => {
    freezImsForLoading("Sending another email...");
    try {
      let { data } = await resendVerificationEmail(currentUserData?._id);
      notify(data.message, "success");
      unFreezImsForLoading();
    } catch (ex) {
      imsLogger("ResendVerification", ex);
      handleError(ex);
      unFreezImsForLoading();
    }
  };

  return (
    <Layout>
      <React.Fragment>
        <div className="">
          <h4>Please verify your account.</h4>
          <p className="mb-4">
            We have sent a verification email. Please click on resend if you
            haven't received any email.
          </p>
        </div>
        <Button
          block
          className="mb-3"
          color="primary"
          size="md"
          onClick={resendEmail}
        >
          {false ? "Processing..." : "Resend verification"}
        </Button>
      </React.Fragment>
    </Layout>
  );
};

export default ResendVerification;
