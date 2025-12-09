import Loading from "@/components/Loader/Loading";
import useGPTResponseGenerator from "@/hooks/useGPTResponseGenerator";
import React, { useEffect } from "react";
import Analysis from "./Analysis";
import { useAnalyticalAssistant } from "./store";
const AnalysisStreamer = ({ analysis, index }) => {
  const { template, updateResponseInTheReport } = useAnalyticalAssistant();
  const { currentlyStreaming, streamResponse } = useGPTResponseGenerator();
  useEffect(() => {
    if (currentlyStreaming?.isStreamComplete) {
    }
  }, [currentlyStreaming]);
  useEffect(() => {
    streamResponse({
      prompt: analysis.prompt,
      systemInstructions: [
        {
          role: "system",
          content: template.context,
        },
      ],
    });
  }, []);

  useEffect(() => {
    if (currentlyStreaming?.isStreamComplete) {
      updateResponseInTheReport(index, currentlyStreaming?.responseStream);
    }
  }, [currentlyStreaming?.isStreamComplete]);

  return (
    <React.Fragment>
      <Analysis
        analysis={{
          name: analysis.name,
          response: currentlyStreaming?.responseStream,
        }}
      />
      {!currentlyStreaming && <span className="text-center">Boosting now</span>}
      {currentlyStreaming?.isStreamComplete === false && <Loading />}
    </React.Fragment>
  );
};

export default AnalysisStreamer;
