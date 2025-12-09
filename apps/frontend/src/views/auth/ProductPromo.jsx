import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import imsLogo from "../../assets/img/ims-systems-logo.svg";
import carboCalcLogo from "../../assets/img/carbo-calc-logo.svg";
import imsFormsLogo from "../../assets/img/ims-forms-logo.svg";
import projectImsLogo from "../../assets/img/project-ims-logo.svg";

export function ProductPromo() {
  return (
    <Row>
      <Col md="6">
        <div className="auth-product-logos rounded border">
          <img src={imsLogo} alt="IMS Logo" />
        </div>
      </Col>
      <Col md="6">
        <div className="auth-product-logos rounded border">
          <img src={projectImsLogo} alt="IMS Logo" />
        </div>
      </Col>
      <Col md="6">
        <div className="auth-product-logos rounded border">
          <img src={carboCalcLogo} alt="IMS Logo" />
        </div>
      </Col>
      <Col md="6">
        <div className="auth-product-logos rounded border">
          <img src={imsFormsLogo} alt="IMS Logo" />
        </div>
      </Col>
    </Row>
  );
}
