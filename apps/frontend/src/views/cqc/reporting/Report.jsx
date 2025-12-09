import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import NotificationContext from "@/contexts/notificationContext";
import moment from "moment";
import React, { useState } from "react";
import { Button, Col, Row, Card } from "@ims-systems-00/ims-ui-kit";
import {
  getReport,
  mapToToolOverview,
  resendReport,
} from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Analytics from "../common/Analytics";

const Report = (props) => {
  const { isModalOpen = false } = props;
  let [report, setReport] = useState();
  let [dataSet, setDataSet] = useState();
  let [processing, setProcessing] = useState({
    action: "load-report",
    id: null,
    error: false,
  });
  let notify = React.useContext(NotificationContext);
  let reportId =
    (props?.match && props?.match?.params.id) ||
    (props?.view && props.view._id);
  React.useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getReport(reportId);
        setDataSet(mapToToolOverview(data.cqcReport));
        setReport(data.cqcReport);
        setProcessing({ action: null, id: null, error: false });
      } catch (ex) {
        setProcessing({ action: null, id: null, error: true });
        imsLogger("CQCReport", ex, ex.response);
      }
    }
    fetchData();
  }, []);

  async function handleResend() {
    try {
      setProcessing({ action: "resend", id: null, error: false });
      await resendReport(reportId);
      setProcessing({ action: null, id: null, error: false });
      notify(
        `Report resent to ${report.personName}, ${report.email} successfully`,
        "success"
      );
    } catch (ex) {
      setProcessing({ action: null, id: null, error: true });
      imsLogger("CQCReport", ex, ex.response);
    }
  }
  return (
    <React.Fragment>
      <div className="content">
        <Panels
          isModalOpen={isModalOpen}
          navLinks={["Report"]}
          backLinks={
            props.match && [
              {
                linkText: "Back",
                link: props.match.path.split("/:")[0],
              },
            ]
          }
          defaultPanel={"Report"}
        >
          <Panel panelId="Report">
            <Card>
              <ErrorHandlerComponent
                hasError={processing.error}
                errorMessage="This report has been deleted or removed"
              >
                {processing.action === "load-report" ? (
                  <Loading />
                ) : (
                  report && (
                    <>
                      <Row>
                        <Col md="4">
                          <DetailsSectionContent
                            label={"Reference: "}
                            value={report.reference}
                          />
                        </Col>
                        <Col md="4">
                          <DetailsSectionContent
                            label={"Business unit: "}
                            value={report?.group?.name}
                          />
                        </Col>
                        <Col md="4">
                          <DetailsSectionContent
                            label={"Reported to: "}
                            value={report.personName}
                          />
                        </Col>
                        <Col md="4">
                          <DetailsSectionContent
                            label={"Email: "}
                            value={report.email}
                          />
                        </Col>
                        <Col md="4">
                          <DetailsSectionContent
                            label={"Reported by: "}
                            value={`${report?.created?.by?.name} ${moment(
                              report.created.on
                            ).format("DD/MM/YYYY")}`}
                          />
                        </Col>
                        <Col md="12">
                          <DetailsSectionContent
                            label={"Message: "}
                            value={report.message}
                          />
                        </Col>
                      </Row>
                      <DetailsSectionHeader title={`Attachments`} />
                      <Row>
                        <Col md="12" className="mb-4">
                          <Attachments s3Information={report.attachments} />
                        </Col>
                      </Row>
                      <Analytics dataSet={dataSet} overview={report} />
                      <Row>
                        <Col md="6" className="mb-4">
                          <Button
                            onClick={handleResend}
                            disabled={processing.action === "resend"}
                            className="btn-fill"
                            color="primary"
                            type="button"
                          >
                            {processing.action === "resend"
                              ? "Processing"
                              : "Resend"}
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )
                )}
              </ErrorHandlerComponent>
            </Card>
          </Panel>
        </Panels>
      </div>
    </React.Fragment>
  );
};

export default Report;
