import React from "react";
import { useCRM } from "./store";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Loading from "@/components/Loader/Loading";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import CustomerOverview from "./CustomerOverview";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { Pie } from "react-chartjs-2";
import USER_ACTIONS from "./actions";
import { Attachments } from "@/views/shared/Attachments/Index";
import AttachmentsActionButtons from "./AttachmentsActionButtons";
import Timeline from "@/views/shared/Timeline/Timeline";
import CustomerStatus from "./CustomerStatus";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import IncidentManagement from "@/views/incidentManagement/IncidentManagement";
import { IMS_SERVICES, ACTIONS, EFFECTS } from "@/rolesAndPermissions";
import useAccess from "@/hooks/useAccess";
import Invoices from "../invoices/Invoices";
import TaskManagement from "@/views/taskManagement/TaskManagement";

import NavigationTabs from "@/components/NavigationTabs";

const CRMDrawerDetail = (props) => {
  let {
    processing,
    visitingCustomer: customer,
    customerMappedData,
    customerOverview,
  } = useCRM();

  let { authUser } = useAccess();

  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_CUSTOMER].status ? (
        <Loading />
      ) : (
        customer && (
          <React.Fragment>
            <DetailsDrawerHeader data={customer} />
            <NavigationTabs
              container={false}
              activeTab="details"
              navigations={[
                {
                  id: "overview",
                  text: "Overview",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                  ),
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3 mb-3">
                        <CustomerOverview />
                      </div>
                    </div>
                  ),
                },
                {
                  id: "details",
                  text: "Details",
                  icon: <i className="ims-icons-20 icon-icon-list-24 me-1"></i>,
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3 mt-3">
                        {customer.status === "Lost" && (
                          <div>
                            <span className="text-danger font-size-subtitle-2">
                              This customer is lost
                            </span>
                            <DetailsSectionHeader title={`Reason for loss`} />
                            <Row>
                              <Col md="12">{customer?.reasonForLoss}</Col>
                            </Row>
                          </div>
                        )}
                        {customer.stage === "Live" && (
                          <div className="mt-3">
                            <DetailsSectionHeader
                              title={`Analytics and insights`}
                            />
                            {processing[USER_ACTIONS.LOAD_OVERVIEW].status && (
                              <Loading />
                            )}
                            {customerMappedData && (
                              <Row className="mb-3">
                                <Col md="6" className="">
                                  <Card className="card-chart card-chart-pie card-chart-sm">
                                    <CardHeader>
                                      <span className="card-category font-size-subtitle-2">
                                        Invoice status:
                                      </span>
                                    </CardHeader>
                                    <CardBody>
                                      {customerOverview.totalInvoiceAmount
                                        .length ? (
                                        <Row>
                                          <Col md="6">
                                            <div className="chart-area">
                                              <Pie
                                                data={
                                                  customerMappedData
                                                    .invoiceStatuses.data
                                                }
                                                options={
                                                  customerMappedData
                                                    .invoiceStatuses.options
                                                }
                                              />
                                            </div>
                                          </Col>
                                          <Col md="6">
                                            {customerOverview.totalInvoiceAmount.map(
                                              (invoice) => (
                                                <p className="category">
                                                  {invoice._id.status}{" "}
                                                  <span className="text-secondary font-size-subtitle-2">
                                                    {invoice.count}
                                                  </span>
                                                </p>
                                              )
                                            )}
                                          </Col>
                                        </Row>
                                      ) : (
                                        <CardFooter>
                                          <span className="text-secondary font-size-subtitle-2">
                                            No invoice analytics available at
                                            the moment
                                          </span>
                                        </CardFooter>
                                      )}
                                    </CardBody>
                                  </Card>
                                </Col>
                                <Col md="6" className="">
                                  <Card className="card-chart card-chart-pie card-chart-sm">
                                    <CardHeader>
                                      <span className="card-category font-size-subtitle-2">
                                        Finance overview:
                                      </span>
                                    </CardHeader>
                                    <CardBody>
                                      {customerOverview.totalInvoiceAmount
                                        .length ? (
                                        <Row>
                                          <Col md="6">
                                            <div className="chart-area">
                                              <Pie
                                                data={
                                                  customerMappedData.paidVsDue
                                                    .data
                                                }
                                                options={
                                                  customerMappedData.paidVsDue
                                                    .options
                                                }
                                              />
                                            </div>
                                          </Col>
                                          <Col md="6">
                                            {customerOverview.totalInvoiceAmount.map(
                                              (invoice) => (
                                                <p className="category">
                                                  {invoice._id.status}{" "}
                                                  <span className="text-secondary font-size-subtitle-2">
                                                    £
                                                    {parseFloat(
                                                      invoice.calculations
                                                    ).toFixed(2)}
                                                  </span>
                                                </p>
                                              )
                                            )}
                                          </Col>
                                        </Row>
                                      ) : (
                                        <CardFooter>
                                          <span className="text-secondary font-size-subtitle-2">
                                            No finance analytics available at
                                            the moment
                                          </span>
                                        </CardFooter>
                                      )}
                                    </CardBody>
                                  </Card>
                                </Col>
                                <Col md="6">
                                  <Card className="card-chart card-chart-pie card-chart-sm">
                                    <CardHeader>
                                      <span className="card-category font-size-subtitle-2">
                                        Incidents overview:
                                      </span>
                                    </CardHeader>
                                    <CardBody>
                                      {customerOverview.totalIncidents
                                        .length ? (
                                        <Row>
                                          <Col md="6">
                                            <div className="chart-area">
                                              <Pie
                                                data={
                                                  customerMappedData
                                                    .openVsResolved.data
                                                }
                                                options={
                                                  customerMappedData
                                                    .openVsResolved.options
                                                }
                                              />
                                            </div>
                                          </Col>
                                          <Col md="6">
                                            {customerOverview.totalIncidents.map(
                                              (invoice) => (
                                                <p className="category">
                                                  {invoice._id.status
                                                    ? "Resolved"
                                                    : "Open"}{" "}
                                                  <span className="text-secondary font-size-subtitle-2">
                                                    {invoice.count}
                                                  </span>
                                                </p>
                                              )
                                            )}
                                          </Col>
                                        </Row>
                                      ) : (
                                        <CardFooter>
                                          <span className="text-secondary font-size-subtitle-2">
                                            No incidents analytics available at
                                            the moment.
                                          </span>
                                        </CardFooter>
                                      )}
                                    </CardBody>
                                  </Card>
                                </Col>
                              </Row>
                            )}
                          </div>
                        )}
                        <Row>
                          <Col md="12">
                            <DetailsWrapper
                              label={"Service provision:"}
                              iconClass={"tim-icons icon-pencil"}
                              value={customer?.serviceProvision}
                              labelClass={"pr-2"}
                            />
                          </Col>
                        </Row>
                        <br></br>
                        <DetailsSectionHeader title={`Organisation profile:`} />

                        <Row>
                          <Col md="12" className="mt-2 mb-2">
                            <p>
                              <span className="font-weight-bold">
                                Address:{" "}
                              </span>

                              <span className="text-secondary font-size-subtitle-2">
                                {customer.buildingName} {customer.streetName}{" "}
                                {customer.town} {customer.postCode}
                              </span>
                            </p>
                            <p>
                              <span className="font-weight-bold">
                                Primary contact:{" "}
                              </span>
                              <span className="text-secondary font-size-subtitle-2">
                                {customer.primaryContact}
                              </span>
                            </p>
                            <p>
                              <span className="font-weight-bold">Email: </span>
                              <span className="text-secondary font-size-subtitle-2">
                                {customer.primaryEmail}
                              </span>
                            </p>
                            <p>
                              <span className="font-weight-bold">
                                Secondary contact:{" "}
                              </span>
                              <span className="text-secondary font-size-subtitle-2">
                                {customer.secondaryContact}
                              </span>
                            </p>
                            <p>
                              <span className="font-weight-bold">Email: </span>
                              <span className="text-secondary font-size-subtitle-2">
                                {customer.secondaryEmail}
                              </span>
                            </p>
                            <p>
                              <span className="font-weight-bold">
                                Company registration number:{" "}
                              </span>
                              <span className="text-secondary font-size-subtitle-2">
                                {customer.companyNumber || "Not available"}
                              </span>
                            </p>
                          </Col>
                          {customer?.tagsAndCategories && (
                            <Col md="12" className="mx-2">
                              <DetailsWrapper
                                label={"Additional Information:"}
                                iconClass={"tim-icons icon-pencil"}
                                value={`Category: ${customer?.tagsAndCategories?.name}`}
                                labelClass={"pr-2"}
                              />
                            </Col>
                          )}
                        </Row>

                        {customer.attachments.length > 0 ? (
                          <>
                            <DetailsSectionHeader title={`Attachments:`} />
                            <Row>
                              <Col md="12" className="mb-4">
                                <Attachments
                                  s3Information={customer.attachments}
                                >
                                  <AttachmentsActionButtons />
                                </Attachments>
                              </Col>
                            </Row>
                          </>
                        ) : null}
                        <Row>
                          <Col md="6">
                            <DetailsWrapper
                              label={"Important notes:"}
                              iconClass={"tim-icons icon-pencil"}
                              value={customer?.notes}
                              labelClass={"pr-2"}
                            />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "interactions",
                  text: "Interactions",
                  icon: (
                    <i className="ims-icons-20 icon-icon-activity-24 me-1"></i>
                  ),
                  component: (
                    <div className="px-2 pt-3">
                      <Timeline
                        editLabel="interaction"
                        editPlaceholder="Interactions"
                        horizontalSpacing={true}
                        containerClass="mx-auto sm-10"
                        moduleType="customers"
                        moduleId={customer._id}
                        module={customer}
                      />
                    </div>
                  ),
                },
                {
                  id: "accounts",
                  text: "Accounts",
                  icon: (
                    <i className="ims-icons-20 icon-icon-barcode-24 me-1"></i>
                  ),
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3 mb-3">
                        <CustomerStatus />
                      </div>
                    </div>
                  ),
                },
                {
                  id: "tasks",
                  text: "Tasks",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notepad-24 me-1"></i>
                  ),
                  component: (
                    <div>
                      <TaskManagement
                        moduleType="customers"
                        module={customer._id}
                      />
                    </div>
                  ),
                },
                ...(authUser({
                  service: IMS_SERVICES.CRM,
                  action: ACTIONS.READ,
                  effect: EFFECTS.ALLOW,
                }) &&
                authUser({
                  service: IMS_SERVICES.INCIDENT_MANAGEMENT,
                  action: ACTIONS.READ,
                  effect: EFFECTS.ALLOW,
                }) &&
                customer &&
                customer.stage === "Live"
                  ? [
                      {
                        id: "incident",
                        text: "Incident",
                        icon: (
                          <i className="ims-icons-20 icon-icon-circlewavywarning-24 me-1"></i>
                        ),
                        component: (
                          <div>
                            {customer && (
                              <IncidentManagement
                                moduleId={customer._id}
                                moduleType="customers"
                              />
                            )}
                          </div>
                        ),
                      },
                    ]
                  : []),

                ...(authUser({
                  service: IMS_SERVICES.CRM,
                  action: ACTIONS.READ,
                  effect: EFFECTS.ALLOW,
                }) &&
                customer &&
                customer.stage === "Live"
                  ? [
                      {
                        id: "invoice",
                        text: "Invoice",
                        icon: (
                          <i className="ims-icons-20 icon-icon-notepad-24 me-1"></i>
                        ),
                        component: (
                          <div>
                            <Invoices customer={customer} />
                          </div>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
};

export default CRMDrawerDetail;
