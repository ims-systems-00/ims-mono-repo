import React from "react";
// @ims-systems-00/ims-ui-kit components
import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useQuery from "@/hooks/useQuery";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { imsLogger } from "@/services/loggerService";
import {
  getSupplier,
  getSupplierIncidents,
} from "@/services/supplierManagementServices";
import { getCurrentUserInfo } from "@/services/userServices";
import IncidentManagement from "@/views/incidentManagement/IncidentManagement";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import ContractsButtons from "../ContractsButtons";
import KpiObjective from "../KpiObjective";
import KpiObjectiveForm from "../KpiObjectiveForm";
import OnboardingsButtons from "../OnboardingsButtons";
import SlasButtons from "../SlasButtons";
import SupplierForm from "../SupplierForm";
import SupplierOverview from "../SupplierOverview";
import { useSupplier } from "../store";
import SupplierFormContainer from "./SupplierFormContainer";
import SupplierActions from "../SupplierActions";
import USER_ACTIONS from "../actions";
import TaskManagement from "@/views/taskManagement/TaskManagement";

const SupplierDetail = (props) => {
  let { processing, visitingSupplier: supplier, addKpi } = useSupplier();
  let { authUser } = useAccess();
  return (
    <div className="content">
      <Panels
        navLinks={
          authUser({
            service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
            action: ACTIONS.CREATE,
            effect: EFFECTS.ALLOW,
          })
            ? ["Details", "Manage incidents"]
            : ["Details", "Manage incidents"]
        }
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
        <h4 className="mb-3 text-primary fw-bold">Supplier details</h4>
        <Panel panelId="Details">
          <ErrorHandlerComponent
            hasError={processing.error}
            errorMessage="This supplier has been deleted or removed"
          >
            {processing[USER_ACTIONS.LOAD_SUPPLIER].status ? (
              <Loading />
            ) : (
              supplier && (
                <Row>
                  <Col xl="5" md="5" sm="12">
                    <DetailsSidebar
                      title="Details"
                      iconClass="ims-icons-20 icon-document-regular"
                      label={`Added on ${moment(supplier?.created?.on).format(
                        "DD/MM/YYYY"
                      )}`}
                    >
                      <SupplierActions />
                      <SupplierOverview />
                    </DetailsSidebar>
                  </Col>
                  <Col xl="7" md="7" sm="12" className="mb-3">
                    <SwitchableView
                      viewTitle={supplier.name}
                      canSwitch={authUser({
                        service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
                        action: ACTIONS.CREATE,
                        effect: EFFECTS.ALLOW,
                      })}
                    >
                      <SecondaryWrapperChild>
                        <>
                          <SupplierFormContainer />
                        </>
                      </SecondaryWrapperChild>
                      <PrimaryWrapperChild>
                        <Row>
                          <Col md="12" className="mb-2">
                            <DetailsSectionContent
                              label={`Service provision:`}
                              value={supplier.serviceProvision}
                            />
                          </Col>
                          <Col md="12">
                            <DetailsSectionContent
                              label={"KPI/Objectives:"}
                              value={supplier.kpiObjectives.map(
                                (kpi, index) => (
                                  <p className="text-secondary">
                                    KPI-{index}. {kpi.value}
                                  </p>
                                )
                              )}
                            />
                          </Col>
                        </Row>
                        <br></br>
                        <DetailsSectionHeader title={`Contracts`} />
                        <Row>
                          <Col md="12" className="mb-4">
                            <Attachments s3Information={supplier.contractFiles}>
                              <ContractsButtons />
                            </Attachments>
                          </Col>
                        </Row>
                        <DetailsSectionHeader title={`SLAs`} />
                        <Row>
                          <Col md="12" className="mb-4">
                            <Attachments s3Information={supplier.slaFiles}>
                              <SlasButtons />
                            </Attachments>
                          </Col>
                        </Row>
                        <DetailsSectionHeader title={`Onboarding documents`} />
                        <Row>
                          <Col md="12" className="mb-4">
                            <Attachments
                              s3Information={supplier.onBoardingFiles}
                            >
                              <OnboardingsButtons />
                            </Attachments>
                          </Col>
                          <Col md="12">
                            <TaskManagement
                              moduleType="suppliers"
                              module={supplier._id}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12" className="mb-4">
                            <KpiObjectiveForm
                              onSubmit={async (data) => {
                                await addKpi(data);
                              }}
                            />
                            {supplier.kpiObjectives.map((kpi) => (
                              <KpiObjective kpi={kpi} key={kpi._id} />
                            ))}
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
          <ErrorHandlerComponent
            hasError={processing.error}
            errorMessage="This supplier has been deleted or removed"
          >
            {processing.action === "load-supplier" ? (
              <Loading />
            ) : (
              supplier && (
                <IncidentManagement
                  moduleType="suppliers"
                  moduleId={supplier._id}
                />
              )
            )}
          </ErrorHandlerComponent>
        </Panel>
      </Panels>
    </div>
  );
};

export default SupplierDetail;
