import MDFormatedText from "@/components/MDFormated/MDFormatedText";
import { Badge, Button, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import AnalysisStreamer from "./AnalysisStreamer";
import { useAnalyticalAssistant } from "./store";
import USER_ACTIONS from "./store/actions";

const Analyser = () => {
  const {
    report,
    template,
    startAnalysis,
    createAIResponse,
    clearAnalysis,
    processing,
  } = useAnalyticalAssistant();
  return (
    <div className="my-3">
      <div className="mb-5">
        <Badge className="pull-right" outline color="primary">
          Beta
        </Badge>
        <MDFormatedText>{template.dataDisplay}</MDFormatedText>
      </div>
      {report?.map((analysis, i) => {
        return <AnalysisStreamer analysis={analysis} index={i} />;
      })}
      {!report?.length ? (
        <Button color="primary" block onClick={startAnalysis}>
          <React.Fragment>
            Start analysis <i className="fa-solid fa-wand-magic-sparkles" />
          </React.Fragment>
        </Button>
      ) : (
        <Row>
          <Col md="6" className="my-1">
            <Button
              color="primary"
              block
              onClick={async () => {
                await createAIResponse();
              }}
              disabled={processing[USER_ACTIONS.CREATE_AI_RESPONSE].status}
            >
              {processing[USER_ACTIONS.CREATE_AI_RESPONSE].status ? (
                <React.Fragment>Saving...</React.Fragment>
              ) : (
                <React.Fragment>Save response</React.Fragment>
              )}
            </Button>
          </Col>
          <Col md="6" className="my-1">
            <Button color="danger" block onClick={clearAnalysis}>
              <React.Fragment>Clear all</React.Fragment>
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Analyser;
