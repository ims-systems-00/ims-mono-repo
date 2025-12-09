import { Card, CardBody, CardHeader } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import ImageNameWrapper from "../DetailComponents/ImageNameWrapper";

const ExtraLog = ({ log, ...props }) => {
  return (
    <Card className="shadow-none bg-light border-0 py-2 mx-3">
      <CardHeader className="border-0  d-flex">
        <ImageNameWrapper img={log?.image} />
        <span className="mb-0">{log?.title}</span>
      </CardHeader>
      <CardBody className="pt-2">
        <p className="white-space-pre-wrap">{log?.description?.trim()}</p>
      </CardBody>
    </Card>
  );
};

export default ExtraLog;
