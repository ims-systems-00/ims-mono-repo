import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { Link } from "react-router-dom";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
const AuditShortDetail = ({ audit }) => {
  return (
    <>
      <hr></hr>
      <Row>
        <Col md="12">
          <DetailsSectionContent
            label={"Reference ID:"}
            value={audit.reference}
          />
        </Col>
        <Col md="12">
          <DetailsSectionContent label={"Title:"} value={audit.title} />
        </Col>
        <Col md="12">
          <DetailsSectionContent
            label={"Completed on:"}
            value={moment(audit.completed?.on).format("DD/MM/YYYY HH:mm")}
          />
        </Col>
        <Col md="12">
          <DetailsSectionContent
            label={"Focus area:"}
            value={audit.focusArea}
          />
        </Col>
        <Col md="4"></Col>
        <Col md="4" className="text-center">
          <Link
            className="text-info font-weight-bold"
            to={`/admin/audits/${audit?.type?.toLowerCase()}/${audit?._id}`}
          >
            <i className="fas fa-thin fa-arrow-left" /> View audit report
          </Link>
        </Col>
        <Col md="4"></Col>
      </Row>
    </>
  );
};

export default AuditShortDetail;
