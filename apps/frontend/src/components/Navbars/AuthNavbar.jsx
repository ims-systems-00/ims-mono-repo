import classnames from "classnames";
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
} from "reactstrap";
import React from "react";
import { Link } from "react-router-dom";

const AuthNavbar = (props) => {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [color, setColor] = React.useState("navbar-transparent");
  const toggleCollapse = () => {
    if (collapseOpen) {
      setColor("navbar-transparent");
    } else {
      setColor("bg-white");
    }
    setCollapseOpen(!collapseOpen);
  };
  return (
    <Navbar
      className={classnames("navbar-absolute fixed-top", color)}
      expand="lg"
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
            {props.brandText}
          </NavbarBrand>
        </div>
        <button
          aria-controls="navigation-index"
          aria-expanded={false}
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-toggle="collapse"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </button>
        <Collapse isOpen={collapseOpen} navbar>
          <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink
                href="https://imssystems.tech"
                className="nav-link text-primary"
              >
                <i className="ims-icons-20 icon-icon-arrowleft-24" /> iMS
                Systems
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/auth/login" className="nav-link" tag={Link}>
                <i className="ims-icons-20 icon-icon-door-24" /> Login
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default AuthNavbar;
