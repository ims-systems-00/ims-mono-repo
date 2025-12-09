import Loading from "@/components/Loader/Loading";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import NavigationTabs from "@/components/NavigationTabs";
import React from "react";
import AuditShortDetail from "@/views/audits/AuditShortDetail";
import ComplianceStripe from "@/views/compliance/searchableList/components/ComplianceStripe";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import TimeLine from "../shared/Timeline/Timeline";
import AttachmentButtons from "./AttachmentButtons";
import RiskOverview from "./RiskOverview";
import RiskScore from "./RiskScore";
import RiskStatus from "./RiskStatus";
import USER_ACTIONS from "./actions";
import { useRisk } from "./store";

const RiskDrawerDetail = (props) => {
  let {
    processing,
    visitingRisk: risk,
    controlsOnVisitingRisk,
    removeISOControl,
    isMitigatedRisk,
    warningWithConfirmMessage,
  } = useRisk();
  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_RISK]?.status ? (
        <Loading />
      ) : (
        risk && (
          <React.Fragment>
            <DetailsDrawerHeader data={risk} />
            <React.Fragment>
              <NavigationTabs
                container={false}
                activeTab="details"
                navigations={[
                  {
                    id: "details",
                    text: "Details",
                    icon: (
                      <i className="ims-icons-20 icon-icon-list-24 me-1"></i>
                    ),
                    component: (
                      <div className="px-2 pt-3">
                        <div className="border rounded-3 p-3 mb-3">
                          <RiskOverview />
                        </div>
                        <div className="border rounded-3 p-3">
                          <DetailsWrapper
                            label={"Description:"}
                            iconClass={"tim-icons icon-pencil"}
                            value={risk.description}
                            labelClass={"pr-2"}
                          />
                          <DetailsWrapper
                            label={"Mitigations:"}
                            iconClass={"tim-icons icon-pencil"}
                            value={risk.controlsAndMitigation}
                            labelClass={"pr-2"}
                          />
                          <DetailsWrapper
                            label={"Acceptance rationale:"}
                            iconClass={"tim-icons icon-pencil"}
                            value={risk.acceptanceRational}
                            labelClass={"pr-2"}
                          />

                          {risk?.tagsAndCategories && (
                            <DetailsWrapper
                              label={"Additional Information:"}
                              iconClass={"tim-icons icon-pencil"}
                              value={`Category: ${risk?.tagsAndCategories?.name}`}
                              labelClass={"pr-2"}
                            />
                          )}

                          {risk?.attachments?.length > 0 && (
                            <>
                              <DetailsWrapper
                                label={"Attachments:"}
                                iconClass={"tim-icons icon-pencil"}
                                value={null}
                                labelClass={"pr-2"}
                              />
                              <Attachments s3Information={risk?.attachments}>
                                <AttachmentButtons />
                              </Attachments>
                            </>
                          )}
                          <DetailsWrapper label={"Risk Score:"} />
                          <RiskScore />

                          {risk?.source?.moduleType === "audits" && (
                            <React.Fragment>
                              <DetailsSectionHeader title={`Audit detail`} />

                              <AuditShortDetail audit={risk?.source?.module} />
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: "activity",
                    text: "Activity",
                    icon: (
                      <i className="ims-icons-20 icon-icon-activity-24 me-1"></i>
                    ),
                    component: (
                      <div className="px-2 pt-3">
                        {isMitigatedRisk(risk) ? (
                          <TimeLine
                            readOnly={true}
                            horizontalSpacing={false}
                            containerClass="mx-auto sm-12"
                            moduleType="risks"
                            moduleId={risk?._id}
                          />
                        ) : (
                          <TimeLine
                            editLabel="Comment"
                            editPlaceholder="New comment"
                            horizontalSpacing={true}
                            containerClass="mx-auto sm-12"
                            moduleType="risks"
                            moduleId={risk?._id}
                            isHorizontal={false}
                          />
                        )}
                      </div>
                    ),
                  },
                  {
                    id: "lifeCycle",
                    text: "Life Cycle",
                    icon: (
                      <i className="ims-icons-20 icon-icon-clock-24 me-1"></i>
                    ),
                    component: (
                      <div className="px-2 pt-3">
                        <RiskStatus />
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
                        <TaskManagement moduleType="risks" module={risk._id} />
                      </div>
                    ),
                  },
                  {
                    id: "linkedControls",
                    text: "Linked controls",
                    icon: (
                      <i className="ims-icons-20 icon-icon-shieldcheck-24 me-1"></i>
                    ),
                    component: (
                      <div className="px-2 pt-3">
                        {processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_RISK]
                          .status && <Loading />}
                        {controlsOnVisitingRisk?.length > 0 &&
                        !processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_RISK]
                          .status ? (
                          controlsOnVisitingRisk.map((data) => (
                            <ComplianceStripe
                              warningWithConfirmMessage={
                                warningWithConfirmMessage
                              }
                              key={data._id}
                              compliance={data}
                              actions={
                                <UncontrolledDropdown
                                  size="sm"
                                  direction="right"
                                >
                                  <DropdownToggle
                                    outline
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                    className="border"
                                  >
                                    <i className="fa-solid fa-ellipsis-h" />
                                  </DropdownToggle>
                                  <DropdownMenu bottom>
                                    <DropdownItem
                                      onClick={(e) => {
                                        removeISOControl({
                                          toolkits: [],
                                          controls: [data?.control?._id],
                                        });
                                      }}
                                    >
                                      Remove
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              }
                            />
                          ))
                        ) : (
                          <p className="text-secondary text-center">
                            There are no controls linked to this
                          </p>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </React.Fragment>
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
};

export default RiskDrawerDetail;
