import React, { useState } from "react";
import { useGetIncidents } from "../../hooks/useGetIncidents";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import SearchInput from "@/components/SearchInput/search-input";
import { Pagination } from "@/components/Pagination/pagination";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "@ims-systems-00/ims-ui-kit";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import { useLinkIncidenceEvidence } from "../../hooks/useLinkIncidentEvidence";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import { draftJSToText } from "@/utils/draftJsToText";

export const IncidentFinder = ({ clause }) => {
  const { incidents, queryHandlers, pagination } = useGetIncidents();
  const { isOpen, toggle } = useDualStateController();
  const { isPending, linkIncidenceEvidence } = useLinkIncidenceEvidence();
  const [selected, setSelected] = useState("");

  return (
    <div className="pt-3">
      <>
        <SearchInput queryHandlers={queryHandlers} />

        {incidents?.length === 0 ? (
          <div className="text-center mt-3 text-gray-500 italic">
            No incidents found.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {incidents?.map((incident) => {
              const status = incident?.resolved?.status
                ? "Resolved"
                : incident?.escalated?.status
                ? "Escalated"
                : "Open";

              const priorityColor =
                incident?.priority === "P4"
                  ? "text-success"
                  : incident?.priority === "P3"
                  ? "text-info"
                  : incident?.priority === "P2"
                  ? "text-warning"
                  : "text-danger";

              return (
                <div key={incident?._id} className="border rounded-3 p-3 mt-3">
                  <div>
                    <div className="d-flex align-items-start justify-content-between">
                      <h5 className="mb-2">
                        {incident?.reference} — {incident?.title}
                      </h5>
                      <div className="ml-auto">
                        <TooltipButton
                          style={{ cursor: "pointer" }}
                          tooltip="Link Incident"
                          onClick={(e) => {
                            setSelected(incident?._id);
                            toggle();
                          }}
                          name="delete"
                          size="sm"
                          id="delete"
                          color="link"
                          className="btn-link-primary border border-0"
                        >
                          <i className="ims-icons-20 icon-icon-plus-24" />
                        </TooltipButton>
                      </div>
                    </div>
                    <BadgeStatus status={status} />

                    <p className="mt-2">
                      <span className="text-black font-medium">
                        Description:
                      </span>{" "}
                      <span>{draftJSToText(incident?.description)}</span>
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mt-2 flex-wrap">
                    <p>
                      <span className="text-black fw-medium">
                        Business Unit:
                      </span>{" "}
                      <span>{incident?.group?.name || "N/A"}</span>
                    </p>

                    <p>
                      <span className="text-black fw-medium">Priority:</span>{" "}
                      <span className={`${priorityColor}`}>
                        {incident?.priority}
                      </span>
                    </p>

                    <p>
                      <span className="text-black fw-medium">Owner:</span>{" "}
                      <span>{incident?.owner?.name || "N/A"}</span>
                    </p>
                  </div>
                </div>
              );
            })}

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={pagination?.totalResults}
              currentPage={pagination?.currentPage || 1}
              onPageChange={(page) => queryHandlers.handlePagination(page)}
              size={pagination?.size}
            />
          </div>
        )}
      </>

      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <h5 className="text-danger mt-2 mb-3">{`You are about to link this incident to ${clause?.control?.name} compliance toolkit.`}</h5>
          <Alert className="rounded-3 border border-warning" color="warning">
            <p className="text-warning">
              This incident will be classed as an evidence of implementation of
              this clause when auditors are auditing your organisation.
            </p>
          </Alert>

          <div className="text-center mt-2 d-flex justify-content-end gap-2">
            <Button onClick={toggle} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={() => {
                linkIncidenceEvidence(clause?._id, {
                  evidenceType: "incident-management",
                  relatedIncident: selected,
                });
                toggle();
              }}
              className="bg-primary text-white"
            >
              {isPending ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
