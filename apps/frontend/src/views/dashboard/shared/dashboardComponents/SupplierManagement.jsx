import Box from "@/components/Box/Index";
import ImsPaddingPieChart from "@/components/charts/ImsPaddingPieChart";
import { Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import { Pie } from "react-chartjs-2";

const SupplierManagement = ({ dataSet, unmappedData }) => {
  return (
    <Row>
      <Col xl="5" md="12">
        <Box minHeight={435}>
          <h4>Supplier Management</h4>

          <div className="chart-area">
            <ImsPaddingPieChart
              data={dataSet.suppliersVsCompliant.data}
              options={dataSet.suppliersVsCompliant.options}
            />
          </div>
          {/* <div
            style={{
              width: "362px",
              borderTop: "1px solid #E5E5E5",
              height: "1px",
              marginTop: "30px",
            }}
          ></div> */}
          <Row>
            <Col xs="6" className="p-3">
              <p className="font-size-subtitle-2">
                <i class="fa-solid fa-circle-dot text-primary me-3"></i>{" "}
                <span className="mx-2">
                  {" "}
                  Compliant - {dataSet.suppliersVsCompliant.data[0].value}
                </span>
              </p>
            </Col>
            <Col xs="6" className="py-3 ">
              <p className="font-size-subtitle-2">
                <i class="fa-solid text-warning fa-circle-dot  me-3"></i>{" "}
                <span className="mx-2">
                  {" "}
                  Non-Compliant - {dataSet.suppliersVsCompliant.data[1].value}
                </span>
              </p>
            </Col>
          </Row>
        </Box>
      </Col>
      <Col xl="7" md="12">
        <Box minHeight={121}>
          <p>
            <i class="fa-solid fa-circle text-success me-3"></i>{" "}
            <span className="mx-2">Procurement value</span>
          </p>
          <h2
            style={{
              fontSize: "32px",
            }}
          >
            £{parseInt(dataSet.totalContractValue).toLocaleString()}
          </h2>
        </Box>
        <Box minHeight={220}>
          <h4>Supplier Incidents</h4>
          <Row>
            <Col sm="6">
              <ImsPaddingPieChart
                data={dataSet.supplierIncidentVsResolvedIncident.data}
                options={dataSet.supplierIncidentVsResolvedIncident.options}
              />
            </Col>
            <Col
              sm="6"
              style={{
                paddingTop: "35px",
              }}
            >
              <span className="text-secondary font-size-subtitle-1">
                {" "}
                Total incidents :{" "}
                {dataSet.supplierIncidents.open +
                  dataSet.supplierIncidents.resolved}
              </span>
              <p className="text-secondary font-size-subtitle-2">
                <i class="fa-solid fa-circle-dot text-primary me-3"></i>{" "}
                <span className="mx-2">
                  {" "}
                  Open Incidents : {dataSet.supplierIncidents.open}
                </span>
              </p>

              <p className="text-secondary font-size-subtitle-2">
                <i class="fa-solid fa-circle-dot text-secondary me-3"></i>{" "}
                <span className="mx-2">
                  {" "}
                  Total resolved : {dataSet.supplierIncidents.resolved}
                </span>
              </p>
            </Col>
          </Row>
        </Box>
      </Col>
    </Row>
  );
};

export default SupplierManagement;
