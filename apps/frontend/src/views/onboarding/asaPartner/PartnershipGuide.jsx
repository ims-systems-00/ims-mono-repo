import {
  Container,
  Row,
  Form,
  UncontrolledAlert,
  Button,
  Col,
  Card,
  CardBody,
  ImsCarousel,
  CardHeader,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import onboardingBgVector from "../../../assets/img/onboarding-bg-vector.svg";
import onboardingStepVector from "../../../assets/img/onboarding-step.svg";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const PartnerhipGuide = ({ children }) => {
  const history = useHistory();
  return (
    <React.Fragment>
      <img className="onboarding-bg-veector" src={onboardingBgVector} />
      <Container className="container-onboarding container-fluid">
        <div className="content">
          <Row>
            <Col md="6">
              <h3>Before you start</h3>
              <p>
                Please follow the step by step guide to join partnership
                programme.
              </p>
              <Form className="mb-2 mt-4">
                <p className="">Step 1: Create an account</p>
                <p className="">Step 2: Setup your organisation</p>
                <p className="">Step 2: Select Join partnership programme</p>
                <p className="">Step 4: Apply with the appropriate details</p>
                <p className="">Step 5: The dashboard</p>
                <Button
                  color="primary"
                  className="mt-3"
                  onClick={(e) => {
                    history.push("/auth/register");
                  }}
                >
                  Create my account{" "}
                  <i className={`ims-icons-20 icon-icon-arrowright-24`} />
                </Button>
              </Form>
            </Col>
            <Col
              md="6"
              // className="d-flex  justify-content-center align-items-center"
            >
              <ImsCarousel slidesPerView={1} navigation>
                <Card className="w-100 h-100 rounded-3 shadow-sm">
                  <h4 className="m-3">Create orgaisation</h4>
                  <CardBody>
                    <img className="img-fluid" src={onboardingStepVector} />
                  </CardBody>
                </Card>
                <Card className="w-100 h-100 rounded-3 shadow-sm">
                  <h4 className="m-3">Create orgaisation</h4>
                  <CardBody>
                    <img className="img-fluid" src={onboardingStepVector} />
                  </CardBody>
                </Card>
                <Card className="w-100 h-100 rounded-3 shadow-sm">
                  <h4 className="m-3">Create orgaisation</h4>
                  <CardBody>
                    <img className="img-fluid" src={onboardingStepVector} />
                  </CardBody>
                </Card>
                <Card className="w-100 h-100 rounded-3 shadow-sm">
                  <h4 className="m-3">Create orgaisation</h4>
                  <CardBody>
                    <img className="img-fluid" src={onboardingStepVector} />
                  </CardBody>
                </Card>
                <Card className="w-100 h-100 rounded-3 shadow-sm">
                  <h4 className="m-3">Create orgaisation</h4>
                  <CardBody>
                    <img className="img-fluid" src={onboardingStepVector} />
                  </CardBody>
                </Card>
              </ImsCarousel>
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default PartnerhipGuide;
