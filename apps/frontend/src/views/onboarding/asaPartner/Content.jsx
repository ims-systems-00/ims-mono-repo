import classNames from "classnames";
import { Col, Container, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import onboardingBgVector from "../../../assets/img/onboarding-bg-vector.svg";
import { useUiManager } from "../uiManager";
import { steps } from "./steps";

const Content = () => {
  const { activeStep, activateStep, isFirstStep, prevStep } = useUiManager();
  return (
    <React.Fragment>
      <img className="onboarding-bg-veector" src={onboardingBgVector} />
      <Container className="container-onboarding container-fluid">
        <div className="content">
          <Row>
            <Col md="12" className="my-4">
              {!isFirstStep() && (
                <span
                  size="sm"
                  color="secondary"
                  outline
                  className="step-nav  me-2 border-0"
                  onClick={prevStep}
                >
                  <i className={`ims-icons-20 icon-icon-arrowleft-24`} />
                </span>
              )}
              {Object.keys(steps).map((stepKey) => {
                return (
                  <span
                    className={classNames("step-nav me-2", {
                      "text-primary": activeStep === stepKey,
                    })}
                    onClick={() => activateStep(stepKey)}
                  >
                    {steps[stepKey].name}
                    <i
                      className={`mx-3 ims-icons-20 icon-icon-arrowright-24`}
                    />
                  </span>
                );
              })}
            </Col>
            <React.Fragment>{steps[activeStep]?.component}</React.Fragment>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Content;
