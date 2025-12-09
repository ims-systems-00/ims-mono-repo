import { Card, CardBody, Progress } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import useDocument from "./store/useDocument";
function getColor(value) {
  if (value < 50) return "danger";
  else if (value < 80) return "warning";
  else return "success";
}
const ConformanceCard = ({}) => {
  const { document } = useDocument();
  return (
    <React.Fragment>
      {document?.documentData?.conformance >= 0 && (
        <Card>
          <CardBody>
            <div className="border-bottom pb-1 font-weight-bold font-size-subtitle-1">
              <p className="">
                {document?.documentData?.purpose} conformance:{" "}
                {document?.documentData?.conformance}%
              </p>
            </div>
            <Progress
              className="mt-2"
              color={getColor(document?.documentData?.conformance)}
              value={document?.documentData?.conformance}
            />
          </CardBody>
        </Card>
      )}
    </React.Fragment>
  );
};

export default ConformanceCard;
