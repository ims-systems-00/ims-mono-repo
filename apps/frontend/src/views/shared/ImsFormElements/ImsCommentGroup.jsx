import React from "react";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";

const ImsCommentGroup = ([children]) => {
  return (
    <Row className="form-horizontal">
      {/* <Label sm="2"></Label> */}
      <Col sm="8">{children}</Col>
    </Row>
  );
};

export default ImsCommentGroup;
