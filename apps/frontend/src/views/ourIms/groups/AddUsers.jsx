import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import LicenseOverview from "./LicenseOverview";
import UserForm from "./UserForm";
const AddUsers = ({ group, ...rest }) => {
  return (
    <>
      <Row>
        <Col md="6">
          <UserForm group={group} {...rest} />
        </Col>
        <Col md="6">
          <LicenseOverview group={group} />
        </Col>
      </Row>
    </>
  );
};

export default AddUsers;
