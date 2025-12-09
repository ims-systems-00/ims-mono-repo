import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { useApplication } from "@/stores/applicationStore";
import greetings from "@/utils/getGreetings";

const Greetings = ({ data }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const { tokenPair } = useApplication();
  React.useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setCurrentTime(new Date());
  }
  return (
    <Row>
      <Col md="6">
        {" "}
        <h4 className="me-1">
          {greetings()} {tokenPair?.accessTokenData?.user?.name} (
          {tokenPair.accessTokenData.user.role})
          <p className="text-secondary mb-1">
            Accurate as of {moment(data.updatedAt).format("DD/MM/YYYY HH:mm")}
          </p>
        </h4>
      </Col>
      {/* <Col md="6">
        <h4 className="text-end">
          {tokenPair.accessTokenData.user.organizationName}
        </h4>
        <p className="text-secondary text-end mb-1">
          {moment(currentTime).format("dddd, Do MMMM, HH:mm:ss")}
        </p>
      </Col> */}
    </Row>
  );
};

export default Greetings;
