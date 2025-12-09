import MDFormatedResponse from "./MDFormatedResponse";
const Analysis = ({
  analysis = {
    name: "analysis.name",
    response: "currentlyStreaming?.responseStream",
  },
}) => {
  return (
    <div className="my-1 analyser-response">
      <h4>{analysis?.name}</h4>
      <MDFormatedResponse>{analysis?.response}</MDFormatedResponse>
    </div>
  );
};

export default Analysis;
