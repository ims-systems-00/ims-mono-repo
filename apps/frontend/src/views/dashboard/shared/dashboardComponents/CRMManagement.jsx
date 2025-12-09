import Box from "@/components/Box/Index";
import ImsBarChart from "@/components/charts/ImsBarChart";
import ImsLineChart from "@/components/charts/ImsLineChart";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Link } from "react-router-dom";
import { numberFormatter } from "@/utils/inputFormats";
import InteractionAnalytics from "@/views/crm/customers/InteractionAnalytics";

const CRMManagement = ({ dataSet }) => {
  return (
    <React.Fragment>
      {/* CRM */}
      <Box>
        <h4>CRM</h4>
        <p>Live Customers</p>
        <Row>
          <Col lg="3" md="4" className="border-right">
            <div className="stats">
              <Link to="/admin/customers" className="module-link">
                Total contract value
              </Link>
            </div>
            <hr />

            <Row>
              <Col xs="2">
                <div className="info-icon text-center icon-info">
                  <i className="ims-icons-20 icon-total-contract-regular"></i>
                </div>
              </Col>
              <Col xs="10">
                <div className="numbers">
                  <p className="card-category">Amount</p>
                  <CardTitle tag="h4">
                    £{numberFormatter(dataSet.totalLiveContractValue)}
                  </CardTitle>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg="3" md="4" className="border-right">
            <div className="stats">
              <Link to="/admin/customers" className="module-link">
                Highest contract value
              </Link>
            </div>
            <hr />
            <Row>
              <Col xs="2">
                <div className="info-icon text-center icon-success">
                  <i className="ims-icons-20 icon-highest-contract-regular"></i>
                </div>
              </Col>
              <Col xs="10">
                <div className="numbers">
                  <p className="card-category">
                    {dataSet.mostValuedCustomer?.name}
                  </p>
                  <CardTitle tag="h4">
                    £{numberFormatter(dataSet.mostValuedCustomer?.value)}
                  </CardTitle>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg="3" md="4" className="border-right">
            <div className="stats">
              <Link to="/admin/customers" className="module-link">
                Average contract value
              </Link>
            </div>
            <hr />

            <Row>
              <Col xs="2">
                <div className="info-icon text-center icon-primary">
                  <i className="ims-icons-20 icon-average-contract-regular"></i>
                </div>
              </Col>
              <Col xs="10">
                <div className="numbers">
                  <p className="card-category">Amount</p>
                  <CardTitle tag="h4">
                    £{numberFormatter(dataSet.averageContractValue)}
                  </CardTitle>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg="3" md="4">
            <div className="stats">
              <Link to="/admin/customers" className="module-link">
                Lowest contract value
              </Link>
            </div>
            <hr />

            <Row>
              <Col xs="2">
                <div className="info-icon text-center icon-danger">
                  <i className="ims-icons-20 icon-lowest-contract-regular"></i>
                </div>
              </Col>
              <Col xs="10">
                <div className="numbers">
                  <p className="card-category">
                    {dataSet.lessValuedCustomer?.name}
                  </p>
                  <CardTitle tag="h4">
                    £{numberFormatter(dataSet.lessValuedCustomer?.value)}
                  </CardTitle>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Box>

      {/* CRM */}
      <Row>
        <Col xl="6">
          <Box>
            <span className="font-size-subtitle-1 text-secondary">
              <Link to="/admin/customers" className="module-link">
                Number of customers
              </Link>
            </span>
            <div
              style={{
                minHeight: "304px",
              }}
              className="chart-area"
            >
              <ImsBarChart
                data={dataSet.crmCustomers.data}
                options={dataSet.crmCustomers.options}
              />
            </div>
          </Box>
        </Col>
        <Col xl="6">
          <Box>
            <span className="font-size-subtitle-1 text-secondary">
              <Link to="/admin/customers" className="module-link">
                Contract values
              </Link>
            </span>

            <div
              style={{
                minHeight: "304px",
              }}
              className="chart-area"
            >
              <ImsBarChart
                data={dataSet.crmContractValue.data}
                options={dataSet.crmContractValue.options}
              />
              {/* <Bar
                  data={dataSet.crmContractValue.data}
                  options={dataSet.crmContractValue.options}
                /> */}
            </div>
          </Box>
        </Col>
      </Row>
      <Box>
        <h4>Invoice</h4>
        <Row>
          <Col md={6}>
            <span className="">
              <Link to="/admin/customers" className="module-link">
                Number of invoices this month
              </Link>
            </span>
            <ImsBarChart
              data={dataSet.crmInvoicesCount.data}
              options={dataSet.crmInvoicesCount.options}
            />
          </Col>
          <Col md={6}>
            <span className="">
              <Link to="/admin/customers" className="module-link">
                Invoice value this month
              </Link>
            </span>
            <ImsBarChart
              data={dataSet.crmInvoicesAmount.data}
              options={dataSet.crmInvoicesAmount.options}
            />
          </Col>
        </Row>
      </Box>
      <InteractionAnalytics interactions={dataSet.interactions} />

      {/* CRM */}
      <Box>
        <h4>CRM</h4>
        <span className="font-size-subtitle-1">
          Interactions conducted last 12 months
        </span>
        <div
          style={{
            minHeight: "308px",
          }}
          className="chart-area"
        >
          <ImsLineChart
            data={dataSet.interactionsLastYear.data}
            options={dataSet.interactionsLastYear.options}
          />
        </div>
      </Box>
    </React.Fragment>
  );
};

export default CRMManagement;
