import { useEffect } from "react";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import Loading from "@/components/Loader/Loading";
import { Link } from "react-router-dom";
import { useGetLinkedIncidents } from "../../hooks/useGetLinkedIncidents";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import { Alert, Spinner } from "@ims-systems-00/ims-ui-kit";
import { useDeleteLinkedIncident } from "@/views/compliance/hooks/useDeleteLinkedIncident";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "@ims-systems-00/ims-ui-kit";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import { useState } from "react";
import { NoEvidenceFound } from "../NoEvidence";
import { draftJSToText } from "@/utils/draftJsToText";

export const LinkedIncident = ({ clause }) => {
  const { isOpen, toggle } = useDualStateController();
  const [selected, setSelected] = useState("");
  const { controlEvidence, refetch, isLoading } = useGetLinkedIncidents(
    clause?._id
  );

  const { deleteLinkedIncident, isLinkedIncidentDeleting } =
    useDeleteLinkedIncident();

  useEffect(() => {
    if (clause?._id) {
      refetch();
    }
  }, [clause]);

  return (
    <div className="mb-3">
      <h5>Linked Incidents</h5>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            {controlEvidence?.length === 0 && (
              <div className="mt-3">
                <NoEvidenceFound text="There are no Incidents linked to this" />
              </div>
            )}
            {controlEvidence?.length > 0 &&
              controlEvidence?.map((evidence) => {
                const incident = evidence?.relatedIncident;

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
                  <div className="flex flex-col gap-4">
                    <div
                      key={incident?._id}
                      className="border rounded-3 p-3 mt-3"
                    >
                      <div>
                        <div className="d-flex align-items-start justify-content-between">
                          <Link
                            to={`/admin/incidentmanagement/${incident?._id}`}
                          >
                            <p className="mb-2 text-dark fw-bold hover-underline">
                              {incident?.reference} — {incident?.title}
                            </p>
                          </Link>
                          <div className="ml-auto">
                            <TooltipButton
                              tooltip="Unlink Incident"
                              onClick={(e) => {
                                setSelected(evidence?._id);
                                toggle();
                              }}
                              name="delete"
                              size="sm"
                              id="delete"
                              color="link"
                              className="btn-link-danger border border-0"
                            >
                              {isLinkedIncidentDeleting ? (
                                <Spinner size="sm" />
                              ) : (
                                <i className="ims-icons-20 icon-icon-trash-24" />
                              )}
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
                          <span className="text-black fw-medium">
                            Priority:
                          </span>{" "}
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
                  </div>
                );
              })}
          </div>
        </>
      )}
      <Modal isOpen={isOpen} toggle={() => toggle()} centered>
        <ModalHeader toggle={() => toggle()}></ModalHeader>
        <ModalBody>
          <h5 className="text-danger mt-2 mb-3">{`You are about to remove this incident from ${clause?.control?.name} compliance toolkit.`}</h5>
          <Alert className="rounded-3 border border-warning" color="warning">
            <p className="text-warning">
              Once you remove this incident, it will no longer be considered as
              supporting evidence for this clause during compliance reviews or
              audits.
            </p>
          </Alert>
          <div className="text-center mt-2 d-flex justify-content-end gap-2">
            <Button onClick={() => toggle()} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              disabled={isLinkedIncidentDeleting}
              onClick={() => {
                deleteLinkedIncident({
                  controlId: clause?._id,
                  evidenceId: selected,
                });
                toggle();
              }}
              className="bg-primary text-white"
            >
              {isLinkedIncidentDeleting ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
