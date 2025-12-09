import React from "react";
import { usePartnershipDB } from "./store";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";

const OrganisationDetails = ({ ...props }) => {
  const { visitinOrganisation } = usePartnershipDB();
  return (
    <React.Fragment>
      {visitinOrganisation ? (
        <div>
          <div className="d-flex">
            <img src={visitinOrganisation.logo.src} className="avatar me-3" />
            <h4>{visitinOrganisation.name}</h4>
          </div>
          <Row className="mt-2 p-3">
            <Col md="6" className="p-1">
              <p className="font-weight-bold">Work email</p>
              <p className="text-dark">
                {visitinOrganisation.officeEmail || "N/A"}
              </p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">Contact number</p>
              <p className="text-dark">
                {visitinOrganisation.contactNumber || "N/A"}
              </p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">Building</p>
              <p className="text-dark">
                {visitinOrganisation.addressBuilding || "N/A"}
              </p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">Street</p>
              <p className="text-dark">
                {visitinOrganisation.addressStreet || "N/A"}
              </p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">City</p>
              <p className="text-dark">
                {visitinOrganisation.addressCity || "N/A"}
              </p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">Post code</p>
              <p className="text-dark">{visitinOrganisation.addressPostCode}</p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">State/province</p>
              <p className="text-dark">
                {visitinOrganisation.addressStateProvince || "N/A"}
              </p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">Country</p>
              <p className="text-dark">
                {visitinOrganisation.countryName || "N/A"}
              </p>
            </Col>
          </Row>
          <Row className="mt-2 p-3">
            <Col md="12" className="p-1">
              <h4>Licenses</h4>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">Super user</p>
              <p className="text-dark">
                {visitinOrganisation.licenses.superUser.used}/
                {visitinOrganisation.licenses.superUser.allocated}
              </p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">User</p>
              <p className="text-dark">
                {visitinOrganisation.licenses.users.used}/
                {visitinOrganisation.licenses.users.allocated}
              </p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">Business unit</p>
              <p className="text-dark">
                {visitinOrganisation.licenses.groups.used}/
                {visitinOrganisation.licenses.groups.allocated}
              </p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">Compliance Toolkits</p>
              <p className="text-dark">
                {visitinOrganisation.licenses.complianceTools
                  .map((t) => t)
                  .join(" ") || "N/A"}
              </p>
            </Col>
            <Col md="6" className="p-1">
              <p className="font-weight-bold">Additional modules</p>
              <p className="text-dark">
                {visitinOrganisation.licenses.carbocalc && "CarboCalc, "}
                {visitinOrganisation.licenses.projectims && "Project iMS "}
                {visitinOrganisation.licenses.additionalModules
                  .map((t) => t)
                  .join(" ") || "N/A"}
              </p>
            </Col>
          </Row>
        </div>
      ) : (
        <p className="text-danger">Could not load your organisation</p>
      )}
    </React.Fragment>
  );
};

export default OrganisationDetails;
