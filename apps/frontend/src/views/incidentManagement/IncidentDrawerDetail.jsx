import React from "react";
import { useIncident } from "./store";
import USER_ACTIONS from "./actions";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import IncidentOverview from "./IncidentOverview";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import AttachmentButtons from "./AttachmentButtons";
import { Attachments } from "@/views/shared/Attachments/Index";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import AuditShortDetail from "@/views/audits/AuditShortDetail";
import Timeline from "@/views/shared/Timeline/Timeline";
import IncidentStatus from "./IncidentStatus";
import Loading from "@/components/Loader/Loading";
import ComplianceStripe from "@/views/compliance/searchableList/components/ComplianceStripe";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import { IMS_SERVICES } from "@/rolesAndPermissions";
import { ACTIONS } from "@/rolesAndPermissions";
import { EFFECTS } from "@/rolesAndPermissions";
import useAccess from "@/hooks/useAccess";

import NavigationTabs from "@/components/NavigationTabs";

const IncidentDrawerDetail = (props) => {
  let { authUser } = useAccess();
  let {
    processing,
    visitingIncident: incident,
    isResolvedIncident,
    controlsOnVisitingIncident,
    removeISOControl,
    warningWithConfirmMessage,
  } = useIncident();

  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_INCIDENT].status ? (
        <Loading />
      ) : (
        incident && (
          <React.Fragment>
            <DetailsDrawerHeader data={incident} />
            <NavigationTabs
              container={false}
              activeTab="details"
              navigations={[
                {
                  id: "details",
                  text: "Details",
                  icon: <i className="ims-icons-20 icon-icon-list-24 me-1"></i>,
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3 mb-3 ">
                        <IncidentOverview />
                      </div>
                      {incident && (
                        <div className="border rounded-3 p-3 mb-3 ">
                          <DetailsWrapper
                            label={"Description:"}
                            iconClass={"tim-icons icon-pencil"}
                            value={incident?.description}
                            labelClass={"pr-2"}
                          />

                          <DetailsWrapper
                            label={"Affected service:"}
                            iconClass={"tim-icons icon-pencil"}
                            value={incident?.affectedService}
                            labelClass={"pr-2"}
                          />
                          <DetailsWrapper
                            label={"Method of notification:"}
                            value={incident?.methodOfNotification}
                          />

                          {incident?.resolved?.status &&
                          incident?.resolution !== "" ? (
                            <DetailsWrapper
                              label={"Resolution:"}
                              iconClass={"tim-icons icon-pencil"}
                              value={incident?.resolution}
                              labelClass={"pr-2"}
                            />
                          ) : null}

                          {incident?.tagsAndCategories && (
                            <DetailsWrapper
                              label={"Additional Information:"}
                              iconClass={"tim-icons icon-pencil"}
                              value={`Category: ${incident?.tagsAndCategories?.name}`}
                              labelClass={"pr-2"}
                            />
                          )}

                          {incident?.attachments.length > 0 && (
                            <>
                              <DetailsWrapper
                                label={"Attachments"}
                                iconClass={"tim-icons icon-pencil"}
                                value={null}
                                labelClass={"pr-2"}
                              />

                              <Attachments
                                s3Information={incident?.attachments}
                              >
                                <AttachmentButtons />
                              </Attachments>
                            </>
                          )}

                          {incident?.source?.moduleType === "audits" && (
                            <>
                              <DetailsSectionHeader
                                title={`Audit information`}
                              />
                              <DetailsWrapper label={`Audit detail`} />
                              {incident.source.moduleType === "audits" && (
                                <AuditShortDetail
                                  audit={incident?.source?.module}
                                />
                              )}
                            </>
                          )}
                        </div>
                      )}
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
                      {isResolvedIncident() ? (
                        <Timeline
                          readOnly={true}
                          horizontalSpacing={false}
                          containerClass="mx-auto sm-10"
                          moduleType="incidents"
                          moduleId={incident?._id}
                          module={incident}
                        />
                      ) : (
                        <Timeline
                          editLabel="comment"
                          editPlaceholder="Comment"
                          horizontalSpacing={true}
                          containerClass="mx-auto sm-10"
                          moduleType="incidents"
                          moduleId={incident?._id}
                          module={incident}
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
                      <IncidentStatus />
                    </div>
                  ),
                },
                ...(authUser({
                  service: IMS_SERVICES.INCIDENT_MANAGEMENT,
                  action: ACTIONS.READ,
                  effect: EFFECTS.ALLOW,
                })
                  ? [
                      {
                        id: "tasks",
                        text: "Tasks",
                        icon: (
                          <i className="ims-icons-20 icon-icon-notepad-24 me-1"></i>
                        ),
                        component: (
                          <div>
                            <TaskManagement
                              moduleType="incidents"
                              module={incident._id}
                            />
                          </div>
                        ),
                      },
                    ]
                  : []),

                {
                  id: "linkedControls",
                  text: "Linked controls",
                  icon: (
                    <i className="ims-icons-20 icon-icon-shieldcheck-24 me-1"></i>
                  ),
                  component: (
                    <div className="px-2 pt-3">
                      {processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_INCIDENT]
                        .status && <Loading />}
                      {controlsOnVisitingIncident?.length > 0 &&
                      !processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_INCIDENT]
                        .status ? (
                        controlsOnVisitingIncident.map((data) => (
                          <ComplianceStripe
                            warningWithConfirmMessage={
                              warningWithConfirmMessage
                            }
                            key={data._id}
                            compliance={data}
                            actions={
                              <UncontrolledDropdown size="sm" direction="right">
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
        )
      )}
    </React.Fragment>
  );
};

export default IncidentDrawerDetail;
