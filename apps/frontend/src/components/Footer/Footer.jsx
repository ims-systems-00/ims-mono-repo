import { Container } from "@ims-systems-00/ims-ui-kit";
import PropTypes from "prop-types";
import version from "@/version";
import imsblacklogo from "@/assets/img/iMS TECHNOLOGIES LOGO Black.svg";
const Footer = (props) => {
  return (
    <footer
      data-test="component-footer"
      className={"footer" + (props.default ? " footer-default" : "")}
    >
      <Container fluid={props.fluid ? true : false}>
        <ul className="nav">
          <li className="nav-item">
            <a
              className="nav-link text-dark"
              href="https://imssystems.tech"
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
              <img alt="iMS Technologies" src={imsblacklogo} />
            </a>
          </li>
        </ul>
        <div id="copyright" className="copyright text-dark">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://imssystems.tech"
            target="_blank"
            className="text-dark"
          >
            iMS Systems
          </a>{" "}
          all rights reserved {version.get()}
        </div>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;
