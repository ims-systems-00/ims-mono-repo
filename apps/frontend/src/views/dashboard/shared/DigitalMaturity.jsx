import useAlerts from "@/hooks/useAlerts";
import useModal from "@/hooks/useModal";
import { Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Radar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import DigitalMatrices from "../orgnaisationDashboard/BusinessDigitalMatrix/DigitalMaturityMatrices";
import ImsRadarChart from "@/components/charts/ImsRadarChart";
import useAccess from "@/hooks/useAccess";
import Box from "@/components/Box/Index";

const DigitalMaturity = ({ digitalMaturity, digitalMaturityScore, HoS }) => {
  let { authSuperUser } = useAccess();
  let { activateView, Modal } = useModal();
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  let calculateDigitalScore = () => {
    let sum = 0;
    digitalMaturityScore &&
      digitalMaturityScore.map((score) => (sum += score.point));
    return sum;
  };

  return (
    <React.Fragment>
      {alert}
      <Row>
        <Col sm="8" className="">
          <ImsRadarChart
            data={digitalMaturity.data}
            options={digitalMaturity.options}
          />
        </Col>
        <Col sm="4">
          <Box noShadow varient="secondary-extra-light">
            <div className="d-flex align-items-center">
              <i
                style={{
                  fontSize: "8px",
                }}
                class="fa-solid fa-circle text-primary"
              ></i>{" "}
              <span
                style={{
                  color: "#152536",
                  fontSize: "16px",
                  marginLeft: "8px",
                }}
              >
                Digital Maturity
              </span>
            </div>
            <h4
              style={{
                fontSize: "20px",
              }}
              className="mt-3"
            >
              {calculateDigitalScore()}/28
            </h4>
          </Box>
          {authSuperUser() && (
            <p
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                activateView();
              }}
              className="text-primary mt-2"
            >
              View All Business Units
              <i className="fa-solid fa-chevron-right ms-2"></i>
            </p>
          )}
        </Col>
      </Row>
      <Modal title="Digital Maturity">
        <DigitalMatrices />
      </Modal>
    </React.Fragment>
  );
};

export default DigitalMaturity;
