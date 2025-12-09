import Box from "@/components/Box/Index";
import ImsBarChart from "@/components/charts/ImsBarChart";
import ImsLineChart from "@/components/charts/ImsLineChart";
import React from "react";
import { Link } from "react-router-dom";

const IncidentManagement = ({ HoS, dataSet }) => {
  return (
    <React.Fragment>
      {HoS ? (
        <Box>
          <h4>Incident Management</h4>
          <span className="font-size-subtitle-1">
            <Link to="/admin/incidentmanagement" className="module-link">
              Open vs resolved vs escalated incidents
            </Link>
          </span>

          <div
            style={{
              minHeight: "350px",
            }}
            className="chart-area"
          >
            <ImsLineChart
              data={dataSet.incidentsByStatus.data}
              options={dataSet.incidentsByStatus.options}
            />
          </div>
        </Box>
      ) : (
        <Box>
          <h4>Incident Management</h4>
          <span className="font-size-subtitle-1">
            <Link to="/admin/incidentmanagement" className="module-link">
              Raised vs resolved
            </Link>
          </span>

          <div
            style={{
              minHeight: "308px",
            }}
            className="chart-area"
          >
            <ImsBarChart
              data={dataSet?.businessFunctionsWithMostIncidents.data}
              options={dataSet?.businessFunctionsWithMostIncidents.options}
            />
          </div>
        </Box>
      )}
    </React.Fragment>
  );
};

export default IncidentManagement;
