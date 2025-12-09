import React from "react";
// @ims-systems-00/ims-ui-kit components
import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { Pie } from "react-chartjs-2";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentUserInfo } from "@/services/userServices";
import IncidentManagement from "@/views/incidentManagement/IncidentManagement";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import TimeLine from "@/views/shared/Timeline/Timeline";
import Invoices from "../../invoices/Invoices";
import AttachmentsActionButtons from "../AttachmentsActionButtons";
import CustomerOverview from "../CustomerOverview";
import CustomerStatus from "../CustomerStatus";
import USER_ACTIONS from "../actions";
import { useCRM } from "../store";
import CustomerFormContainer from "./CustomerFormContainer";
import DetailsSectionFormattedTextWrapper from "@/views/shared/DetailsSectionFormattedTextWrapper";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
import CRMActions from "../CRMActions";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";

const CustomerDetail = (props) => {
  let {
    visitingCustomer: customer,
    processing,
    customerMappedData,
    customerOverview,
  } = useCRM();
  // const { isModalOpen = false } = props;
  const currentUser = getCurrentUserInfo();
  let { authUser } = useAccess(currentUser);
  let notify = React.useContext(NotificationContext);

  const authAmendTab = () =>
    authUser({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }) && [];
  const authIcidentTab = () =>
    authUser({
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
      ? ["Manage incidents"]
      : [];
  const authInvoiceTab = () =>
    authUser({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }) &&
    customer &&
    customer.stage === "Live"
      ? ["Invoice"]
      : [];
  // const { blobImage } = useImageProcessor(customer?.logo.storageInfo, {
  //   fallbackImage: defaultImage,
  // });

  return (
    <div className="content">
      <Panels
        navLinks={[
          ...authAmendTab(),
          "Details",
          ...authInvoiceTab(),
          ...authIcidentTab(),
        ]}
        backLinks={
          props.match && [
            {
              linkText: "Back",
              link: props.match.path.split("/:")[0],
            },
          ]
        }
        defaultPanel={"Details"}
      >
        <h4 className="mb-3 text-primary fw-bold">Customer details</h4>
        <Panel panelId="Details">
          <ErrorHandlerComponent
            hasError={processing[USER_ACTIONS.LOAD_CUSTOMER].error}
            errorMessage="This customer has been deleted or removed"
          >
            {processing[USER_ACTIONS.LOAD_CUSTOMER].status ? (
              <Loading />
            ) : (
              customer && (
                <Row>
                  <Col xl="4" sm="12">
                    <DetailsSidebar
                      title="Details"
                      iconClass="ims-icons-20 icon-document-regular"
                      label={`Created on ${moment(customer?.created?.on).format(
                        "DD/MM/YYYY"
                      )}`}
                    >
                      <CRMActions />
                      <CustomerOverview data={customer} />
                      <CustomerStatus data={customer} />
                    </DetailsSidebar>
                  </Col>
                  <Col xl="8" sm="12" className="mb-3">
                    <SwitchableView
                      viewTitle={customer.name}
                      canSwitch={authUser({
                        service: IMS_SERVICES.CRM,
                        action: ACTIONS.READ,
                        effect: EFFECTS.ALLOW,
                      })}
                    >
                      <SecondaryWrapperChild>
                        <CustomerFormContainer />
                      </SecondaryWrapperChild>
                      <PrimaryWrapperChild>
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
                        {customer.stage === "Live" &&
                        processing[USER_ACTIONS.LOAD_OVERVIEW].status ? (
                          <Loading />
                        ) : (
                          <div className="mt-3">
                            <DetailsWrapper label={`Analytics and insights:`} />
                            {customerMappedData && (
                              <Row className="mb-3">
                                <Col
                                  md="4"
                                  className="border-right border-info"
                                >
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
                                                  <span className="text-secondary">
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
                                <Col
                                  md="4"
                                  className="border-right border-info"
                                >
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
                                                  <span className="text-secondary">
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
                                <Col md="4">
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
                                                  <span className="text-secondary">
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
                          <Col md="12" className="mb-4">
                            <DetailsSectionFormattedTextWrapper
                              label={"Service provision:"}
                            >
                              <FormattedContents
                                value={customer.serviceProvision}
                                mediaLinkGeneratorFn={linkGenerator}
                              />
                            </DetailsSectionFormattedTextWrapper>
                          </Col>
                        </Row>
                        <DetailsSectionHeader title={`Organisation profile:`} />
                        <Row>
                          <Col md="12">
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
                        </Row>

                        {customer?.tagsAndCategories && (
                          <DetailsWrapper
                            label={"Additional Information:"}
                            iconClass={"tim-icons icon-pencil"}
                            value={`Category: ${customer?.tagsAndCategories?.name}`}
                            labelClass={"pr-2"}
                          />
                        )}

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
                            <DetailsSectionFormattedTextWrapper
                              label={"Important notes:"}
                            >
                              <FormattedContents
                                value={customer.notes}
                                mediaLinkGeneratorFn={linkGenerator}
                              />
                            </DetailsSectionFormattedTextWrapper>
                          </Col>
                          <Col md="12">
                            <TaskManagement
                              moduleType="customers"
                              module={customer._id}
                            />
                          </Col>
                        </Row>
                        <DetailsWrapper
                          label={`Interactions with the customer:`}
                        />
                        <Row>
                          <Col md="12" className="mb-4">
                            <TimeLine
                              editLabel="interaction"
                              editPlaceholder="Interactions"
                              horizontalSpacing={true}
                              containerClass="mx-auto sm-10"
                              moduleType="customers"
                              moduleId={customer._id}
                              module={customer}
                            />
                          </Col>
                        </Row>
                      </PrimaryWrapperChild>
                    </SwitchableView>
                  </Col>
                </Row>
              )
            )}
          </ErrorHandlerComponent>
        </Panel>
        <Panel panelId="Manage incidents">
          {authUser({
            service: IMS_SERVICES.INCIDENT_MANAGEMENT,
            action: ACTIONS.READ,
            effect: EFFECTS.ALLOW,
          }) && (
            <ErrorHandlerComponent
              hasError={processing[USER_ACTIONS.LOAD_CUSTOMER].error}
              errorMessage="This customer has been deleted or removed"
            >
              {processing[USER_ACTIONS.LOAD_CUSTOMER].status ? (
                <Loading />
              ) : (
                customer && (
                  <IncidentManagement
                    moduleId={customer._id}
                    moduleType="customers"
                  />
                )
              )}
            </ErrorHandlerComponent>
          )}
        </Panel>
        <Panel panelId="Invoice">
          <ErrorHandlerComponent
            hasError={processing[USER_ACTIONS.LOAD_CUSTOMER].error}
            errorMessage="This customer has been deleted or removed"
          >
            {processing[USER_ACTIONS.LOAD_CUSTOMER].status ? (
              <Loading />
            ) : (
              customer && <Invoices customer={customer} />
            )}
          </ErrorHandlerComponent>
        </Panel>
      </Panels>
    </div>
  );
};

export default CustomerDetail;
