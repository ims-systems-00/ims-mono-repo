import classNames from "classnames";
import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
} from "@ims-systems-00/ims-ui-kit";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import createOrgOption from "../../../assets/img/create-org-option.svg";
import onboardingBgVector from "../../../assets/img/onboarding-bg-vector.svg";
import partnershipOption from "../../../assets/img/partnership-option.svg";
import { useApplication } from "@/stores/applicationStore";

const flow = {
  goLive: "/auth/onboard/go-live",
  partnership: "/auth/onboard/partner",
};
const Content = () => {
  const { currentUserData } = useApplication();
  const [selectedFlow, setSelectedFlow] = useState("");
  const history = useHistory();
  const { isOpen: isStratOrgInfoOpen, toggle: toggleStartOrgInfo } =
    useDualStateController();
  const { isOpen: isPartnershipInfoOpen, toggle: togglePartnershipInfo } =
    useDualStateController();
  return (
    <React.Fragment>
      <img className="onboarding-bg-veector" src={onboardingBgVector} />
      <Container className="container-onboarding container-fluid">
        <div className="content h-100 d-flex align-items-center flex-column text-center">
          <h3 className="mt-5">
            Welcome to iMS Systems, {currentUserData.name}
          </h3>
          <p className="mb-2">
            Consolidate your management systems, unlock the power of streamlined
            operations & compliance with iMS Systems - the all-in-one solution
            that revolutionises your business efficiency and lets you
            effortlessly showcase your operations to interested parties.
          </p>
          <div className="d-flex justify-content-center flex-column flex-md-row">
            <div
              className={classNames("path-selector rounded-3", {
                " active": selectedFlow === flow.goLive,
              })}
              onClick={() => setSelectedFlow(flow.goLive)}
            >
              <span className="selectetion-box">
                Selected{" "}
                <i className={`ims-icons-20 icon-icon-checkcircle-24`} />
              </span>
              <img className="" src={createOrgOption} />
              <Button
                size="sm"
                block
                color="primary"
                className="border-0"
                outline
                onClick={toggleStartOrgInfo}
              >
                <i className={`ims-icons-20 icon-icon-info-24`} /> Create an iMS
              </Button>
            </div>
            <div
              className={classNames("path-selector rounded-3", {
                " active": selectedFlow === flow.partnership,
              })}
              onClick={() => setSelectedFlow(flow.partnership)}
            >
              <span className="selectetion-box">
                Selected{" "}
                <i className={`ims-icons-20 icon-icon-checkcircle-24`} />
              </span>
              <img className="" src={partnershipOption} />
              <Button
                size="sm"
                block
                color="primary"
                className="border-0"
                outline
                onClick={togglePartnershipInfo}
              >
                <i className={`ims-icons-20 icon-icon-info-24`} /> Become a
                partner
              </Button>
            </div>
          </div>
          {selectedFlow && (
            <Button
              color="primary"
              className="mt-2"
              onClick={() => history.push(selectedFlow)}
            >
              Let's get started{" "}
              <i className={`ims-icons-20 icon-icon-arrowright-24`} />
            </Button>
          )}
        </div>
        <Modal
          isOpen={isStratOrgInfoOpen}
          centered
          toggle={toggleStartOrgInfo}
          backdrop={false}
        >
          <ModalBody>
            <iframe
              style={{ borderRadius: 10 }}
              width="100%"
              height="514"
              src="https://www.youtube.com/embed/0e8xGXgL_P4?si=PZ1VOcBcoTs7WmaU"
              title="iMS Systems Explainer Video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              color="danger"
              className=" btn-block ml-auto"
              onClick={toggleStartOrgInfo}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={isPartnershipInfoOpen}
          centered
          toggle={togglePartnershipInfo}
          backdrop={false}
        >
          <ModalBody>
            <iframe
              style={{ borderRadius: 10 }}
              width="100%"
              height="514"
              src="https://www.youtube.com/embed/RuhhBGjYwH0"
              title="iMS Systems Partnership Programme"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              color="danger"
              className=" btn-block ml-auto"
              onClick={togglePartnershipInfo}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </React.Fragment>
  );
};

export default Content;
