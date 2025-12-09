import { Col, Container, Row } from "@ims-systems-00/ims-ui-kit";
import PropTypes from "prop-types";
import version from "@/version";
import imslogo from "@/assets/img/iMS TECHNOLOGIES LOGO Black.svg";
const AuthFooter = (props) => {
  return (
    <footer
      data-test="component-footer"
      className={"auth-footer" + (props.default ? " footer-default" : "")}
    >
      <Container fluid={props.fluid ? true : false}>
        <Row>
          <Col xs="12" md="6">
            <ul className="nav">
              <li className="nav-item">
                <a
                  className="nav-link text-dark"
                  href="https://imssystems.tech/"
                  target="_blank"
                >
                  iMS Home
                </a>
              </li>{" "}
              <li className="nav-item">
                <a
                  className="nav-link text-dark"
                  href="https://imssystems.tech/"
                  target="_blank"
                >
                  powered by &nbsp;
                  <img alt="iMS Technologies" src={imslogo} />
                </a>
              </li>
            </ul>
          </Col>
          <Col xs="12" md="6">
            <div id="copyright" className="copyright">
              © {new Date().getFullYear()}{" "}
              <a
                rel="noreferrer"
                href="https://imssystems.tech/"
                target="_blank"
                // className="text-lg-white text-dark"
              >
                iMS Systems
              </a>{" "}
              all rights reserved {version.get()}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

AuthFooter.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default AuthFooter;
