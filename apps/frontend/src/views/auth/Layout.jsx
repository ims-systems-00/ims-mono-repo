import logo from "@/assets/img/ims-technologes-logo.svg";
import btnLogoImg from "@/assets/img/login-logo-btn.svg";
import StarAnimation from "@/components/StarAnimation/Indes";
import { StarsContainer } from "@/components/StarAnimation/Indes";
import { Card, CardBody, Form } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Col, Row } from "reactstrap";
import { ProductPromo } from "./ProductPromo";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <ul class="circles-animation">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="auth-container container-fluid">
        <a
          target={"_blank"}
          rel="noopener noreferrer"
          href="https://imssystems.tech"
        >
          <img
            className="auth-page-parent-logo-img-btn"
            src={btnLogoImg}
            alt=""
          />
        </a>
        <Row className="h-100">
          <Col
            xl="12"
            xs="12"
            className="p-0 d-flex align-items-center border border-right"
          >
            <div className="auth-box-content">
              <div className="d-flex flex-column justify-content-center align-items-center mb-xl-5 ">
                <Form className="form ">
                  <Card className="shadow-none border-0 auth-card">
                    <CardBody>
                      <div className="my-4">
                        <img style={{ width: "50%" }} src={logo} alt="" />
                      </div>
                      {children}
                      <hr></hr>
                      <ProductPromo />
                    </CardBody>
                  </Card>
                </Form>
              </div>
            </div>
          </Col>
          {/* <Col
            xl="6"
            className="p-0 d-xl-flex flex-column justify-content-center align-items-center  d-none"
          >
            <div className="w-50">
              <ProductPromo />
            </div>
          </Col> */}
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Layout;
