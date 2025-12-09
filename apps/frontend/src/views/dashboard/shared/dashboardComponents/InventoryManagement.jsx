import Box from "@/components/Box/Index";
import ImsBarChart from "@/components/charts/ImsBarChart";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Link } from "react-router-dom";

const InventoryManagement = ({ dataSet, unmappedData }) => {
  return (
    <React.Fragment>
      <Row>
        <Col md="6">
          <Box>
            <span className="font-size-subtitle-1">
              <Link to="/admin/inventory/hardware" className="module-link">
                Assets
              </Link>
            </span>

            <div
              style={{
                minHeight: "250px",
              }}
              className="chart-area"
            >
              <ImsBarChart
                data={dataSet.inventory.data}
                options={dataSet.inventory.options}
              />
            </div>
          </Box>
        </Col>
        <Col md="6">
          <Box>
            <span className="font-size-subtitle-1">
              <Link to="/admin/inventory/hardware" className="module-link">
                Asset expenditure
              </Link>
            </span>

            <div
              style={{
                minHeight: "250px",
              }}
              className="chart-area"
            >
              <ImsBarChart
                data={dataSet.finance.data}
                options={dataSet.finance.options}
              />
            </div>
          </Box>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default InventoryManagement;
