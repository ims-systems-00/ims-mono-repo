import NavigationTabs from "@/components/NavigationTabs";
import ClauseOverview from "./ClauseOverview";
import Timeline from "@/views/shared/Timeline/Timeline";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import SafeHtml from "@/components/HtmlParser/SafeHtml";
import { useState } from "react";
import ComplianceActionsContextProvider from "./contexts/ComplianceActionsContext";
import { UpdateClause } from "./update-clause-form";
import { Attachments } from "@/views/shared/Attachments/Index";
import ClauseEvidences from "./ClauseEvidences";
import ClauseAttachments from "./ClauseAttachments";
import { Label } from "@ims-systems-00/ims-ui-kit";
import { LinkedRisk } from "./evidence/riskEvidence/LinkedRisk";
import { LinkedIncident } from "./evidence/incidentEvidence/LinkedIncident";
import { LinkedCip } from "./evidence/cipEvidence/linkedCip";
import { LikedFile } from "./evidence/fileEvidence/LinkedFile";
import { LinkedDocumentTree } from "./evidence/documentEvidence/LinkedDocumentTree";

export const ComplianceDrawer = ({ compliance, updateDataTable }) => {
  let [processing, setProcessing] = useState({
    action: "load-clause",
    id: null,
    error: false,
  });
  return (
    <ComplianceActionsContextProvider
      value={{ clauseTool: compliance, setProcessing, processing }}
    >
      <h5 className="text-dark">
        {compliance?.control?.clause} - {compliance?.control?.title}
      </h5>
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
                {compliance?.control?.description && (
                  <div className="border rounded-3 p-3 mb-3">
                    <DetailsSectionContent
                      label={"Description: "}
                      value={
                        <SafeHtml
                          html={compliance?.control?.description || ""}
                        />
                      }
                    />
                  </div>
                )}

                {compliance?.control?.moreInfo?.note && (
                  <div className="border rounded-3 p-3 mb-3">
                    <DetailsSectionContent
                      label={"Note: "}
                      value={
                        <SafeHtml
                          html={compliance?.control?.moreInfo?.note || ""}
                        />
                      }
                    />
                  </div>
                )}

                <div className="border rounded-3 p-3 mb-3 ">
                  <ClauseOverview data={compliance} />
                </div>

                {compliance?.compliancePercentage !== 100 &&
                compliance?.control?.childrenClauses?.length > 0 ? (
                  <div className="border rounded-3 p-3 mb-3">
                    You cannot update the parent clause{" "}
                    <strong>Select Control</strong> or <strong>Status</strong>{" "}
                    until all associated child clause fields have been
                    completed. Please ensure that every child clause is fully
                    filled out before proceeding with updates to the parent
                    clause.
                    <hr className="my-2" />
                    <div className="mt-2">
                      <Label className="fw-bold mb-2 d-block">
                        Child Clauses:
                      </Label>
                      <div className="d-flex flex-wrap gap-2">
                        {compliance.control?.childrenClauses.map(
                          (child, index) => (
                            <span
                              key={index}
                              className="bg-light border rounded-pill px-3 py-1 text-dark small"
                            >
                              {child}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-3 p-3 mb-3 ">
                    <div className="mb-3 rounded-3">
                      <strong>Note:</strong> You are updating a{" "}
                      <strong>child clause</strong>. Any changes made to its{" "}
                      <strong>Select Control</strong> or <strong>Status</strong>{" "}
                      will impact associated parent clause progress.{" "}
                    </div>
                    <UpdateClause
                      compliance={compliance}
                      updateDataTable={updateDataTable}
                    />
                  </div>
                )}
              </div>
            ),
          },
          {
            id: "activity",
            text: "Activity",
            icon: <i className="ims-icons-20 icon-icon-activity-24 me-1"></i>,
            component: (
              <div className="px-2 pt-3">
                <DetailsSectionHeader title="Comments (State evidences against this clause)" />
                <Timeline
                  editLabel="comment"
                  editPlaceholder="Comment"
                  horizontalSpacing={true}
                  containerClass="mx-auto sm-10"
                  moduleType="controlstatuses"
                  moduleId={compliance?._id}
                />
              </div>
            ),
          },
          {
            id: "compliance-evidence",
            text: "Compliance Evidence",
            icon: <i className="ims-icons-20 icon-icon-file-24 me-1"></i>,
            component: (
              <div className="px-2 pt-3">
                <LinkedRisk clause={compliance} />
                <LinkedIncident clause={compliance} />
                <LinkedCip clause={compliance} />
                <LinkedDocumentTree clause={compliance} />
                <LikedFile controlStatusId={compliance?._id} />
              </div>
            ),
          },
        ]}
      />
    </ComplianceActionsContextProvider>
  );
};
