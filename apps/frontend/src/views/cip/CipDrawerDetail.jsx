import Loading from "@/components/Loader/Loading";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import AuditShortDetail from "@/views/audits/AuditShortDetail";
import ComplianceStripe from "@/views/compliance/searchableList/components/ComplianceStripe";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import TimeLine from "../shared/Timeline/Timeline";
import AttachmentsButtons from "./AttachmentsButtons";
import ContinualImprovementOverview from "./ContinualImprovementOverview";
import ContinualImprovementStatus from "./ContinualImprovementStatus";
import USER_ACTIONS from "./actions";
import { useCip } from "./store";
import NavigationTabs from "@/components/NavigationTabs";

const CipDrawerDetail = () => {
  let {
    processing,
    visitingCip: cip,
    isImplementedCip,
    controlsOnVisitingCip,
    removeISOControl,
  } = useCip();
  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_CIP]?.status ? (
        <Loading />
      ) : (
        cip && (
          <React.Fragment>
            <DetailsDrawerHeader data={cip} />
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
                      <div className="border rounded-3 p-3 mb-3">
                        <ContinualImprovementOverview />
                      </div>
                      <div className="border rounded-3 p-3">
                        <DetailsWrapper
                          label={"Opportunity for improvement:"}
                          iconClass={"tim-icons icon-pencil"}
                          value={cip.opportunityForImprovement}
                          labelClass={"pr-2"}
                        />
                        <DetailsWrapper
                          label={"Attachments:"}
                          labelClass={"pr-2"}
                        />
                        <Attachments s3Information={cip.attachments}>
                          <AttachmentsButtons />
                        </Attachments>
                        <DetailsSectionHeader title={`Audit detail`} />
                        {cip?.source?.moduleType === "audits" && (
                          <AuditShortDetail audit={cip?.source?.module} />
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
                      {isImplementedCip(cip) ? (
                        <TimeLine
                          readOnly={true}
                          horizontalSpacing={false}
                          containerClass="mx-auto sm-12"
                          moduleType="cips"
                          moduleId={cip?._id}
                          module={cip}
                        />
                      ) : (
                        <TimeLine
                          editLabel="Actions"
                          editPlaceholder="New comment"
                          horizontalSpacing={true}
                          containerClass="mx-auto sm-12"
                          moduleType="cips"
                          moduleId={cip?._id}
                          module={cip}
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
                      <ContinualImprovementStatus />
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
                    <TaskManagement moduleType="cips" moduleId={cip._id} />
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
                      {processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_CIP]
                        .status && <Loading />}
                      {controlsOnVisitingCip.length > 0 &&
                      !processing[USER_ACTIONS.LOAD_LINKED_CONTROLS_TO_CIP]
                        .status ? (
                        controlsOnVisitingCip.map((data) => (
                          <ComplianceStripe
                            key={data._id}
                            compliance={data}
                            actions={
                              <UncontrolledDropdown size="sm" direction="right">
                                <DropdownToggle
                                  outline
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <i className="ims-icons-20 icon-icon-dotsthreeoutline-24" />
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

export default CipDrawerDetail;
