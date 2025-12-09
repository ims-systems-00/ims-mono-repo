import { Col, Row } from "@ims-systems-00/ims-ui-kit";

const KpiObectives = ({ label, kpi }) => {
  return (
    <>
      <Row className="">
        <Col md="2">
          <span className="text-right font-size-subtitle-2">
            <span className="">{<i className="fas fa-bullseye" />}</span>
          </span>
        </Col>
        <Col md="10">
          <Row>
            <Col md="12">
              <span>
                <span className="text-secondary"> {kpi} </span>
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default KpiObectives;
