import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import React from "react";
import ReportBugForm from "./ReportBugForm";
import Box from "@/components/Box/Index";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";

const ReportBug = () => {
  let [processing, setProcessing] = React.useState({
    action: "report-bug",
    id: null,
  });
  return (
    <div className="content">
      <Row>
        <Col md="6">
          <Box>
            <h5 className="">Report an issue</h5>
            <p className="mb-3 pb-2 border-bottom">
              <i>
                {" "}
                "Describe what happened, including steps to reproduce the bug,
                expected behavior, and the actual outcome."
              </i>
            </p>
            <ReportBugForm
              processing={processing}
              setProcessing={setProcessing}
            />
          </Box>
        </Col>
      </Row>
    </div>
  );
};

export default ReportBug;
