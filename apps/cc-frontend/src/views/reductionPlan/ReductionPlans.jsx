import { Alert, Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { MdLightbulbOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { useParameters } from "../../store/parametersStore";
function LinkWithReportingYearSelection({ ry, children, ...rest }) {
  const { selectReportingYear } = useParameters();
  return (
    <Link
      {...rest}
      onClick={() => {
        selectReportingYear(ry);
      }}
    >
      {children}
    </Link>
  );
}
function ReductionPlans() {
  const { reportingPeriods } = useParameters();
  return (
    <div className="content">
      <Alert className="border border-warning" color="warning">
        Your carbon reduction initiatives are structured on a yearly basis for
        automated reporting.
      </Alert>
      <Row>
        {reportingPeriods.map((rp) => {
          return (
            <Col md="3" key={`${rp.startDate}${rp.endDate}`}>
              <Card className={"rounded-3 border-0"}>
                <CardBody>
                  <div className="d-flex border-bottom align-items-center pb-2 mb-2">
                    <span className="icon-container-square m-0">
                      <MdLightbulbOutline />
                    </span>
                    <h5 className="mx-3 d-inline">{rp.year}</h5>
                    <span className="ms-auto">
                      {" "}
                      ({rp.startDate} - {rp.endDate}){" "}
                    </span>
                  </div>
                  <LinkWithReportingYearSelection
                    to={"/initiatives/complete"}
                    ry={rp}
                  >
                    Complete initiatives
                  </LinkWithReportingYearSelection>

                  <LinkWithReportingYearSelection
                    to={"/initiatives/planned"}
                    className="pull-right"
                    ry={rp}
                  >
                    Planned initiatives
                  </LinkWithReportingYearSelection>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default ReductionPlans;
