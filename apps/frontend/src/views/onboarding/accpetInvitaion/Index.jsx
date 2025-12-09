import classNames from "classnames";
import { Button, Container } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useApplication } from "@/stores/applicationStore";
import acceptInvitaion from "../../../assets/img/acceptInvitaion.jpg";
import onboardingBgVector from "../../../assets/img/onboarding-bg-vector.svg";
import useAcceptInvitation from "./useAcceptInvitation";
import jwtDecode from "jwt-decode";
const Content = () => {
  const { currentUserData, tokenPair } = useApplication();
  const { accepting, accept } = useAcceptInvitation();
  const { token } = useParams();

  return (
    <React.Fragment>
      <img className="onboarding-bg-veector" src={onboardingBgVector} />
      <Container className="container-onboarding container-fluid">
        <div className="content h-100 d-flex align-items-center flex-column text-center">
          <h3 className="mt-5">
            Welcome to iMS Systems, {currentUserData?.name}
          </h3>
          <p className="mb-2">
            {jwtDecode(token)?.senderName} has invited you to join{" "}
            {jwtDecode(token)?.organizationName} as a {jwtDecode(token)?.role}.
          </p>
          <div className="d-flex justify-content-center flex-column flex-md-row">
            <div className={classNames("rounded-3")}>
              <img className="w-25" src={acceptInvitaion} />
            </div>
          </div>
          <Button
            color="primary"
            className="mt-2"
            onClick={() => accept(token)}
            disabled={accepting}
          >
            {accepting ? "Please wait..." : "Join organisation"}
            <i className={`ims-icons-20 icon-icon-arrowright-24`} />
          </Button>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Content;
