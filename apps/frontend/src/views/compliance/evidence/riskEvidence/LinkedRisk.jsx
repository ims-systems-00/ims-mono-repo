import { useEffect } from "react";
import { useGetLinkedRisks } from "../../hooks/useGetLinkedRisks";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import Loading from "@/components/Loader/Loading";
import { Link } from "react-router-dom";
import { useDeleteLinkedRisk } from "@/views/compliance/hooks/useDeleteLinkedRisk";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import { Alert, Spinner } from "@ims-systems-00/ims-ui-kit";
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

export const LinkedRisk = ({ clause }) => {
  const { isOpen, toggle } = useDualStateController();
  const [selected, setSelected] = useState("");
  const { controlEvidence, refetch, isLoading } = useGetLinkedRisks(
    clause?._id
  );
  const { deleteLinkedRisk, isLinkedRiskDeleting } = useDeleteLinkedRisk();

  useEffect(() => {
    if (clause?._id) {
      refetch();
    }
  }, [clause]);

  return (
    <div className="mb-3">
      <h5>Linked Risks</h5>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {controlEvidence?.length === 0 && (
            <div className="mt-3">
              <NoEvidenceFound text="There are no Risks linked to this" />
            </div>
          )}
          {controlEvidence?.length > 0 &&
            controlEvidence?.map((evidence) => {
              const risk = evidence?.relatedRisk;
              const score = risk?.score?.total?.current || 0;

              const status = risk?.mitigated?.status
                ? "Mitigated"
                : risk?.accepted?.status
                ? "Accepted"
                : risk?.escalated?.status
                ? "Escalated"
                : "Open";

              return (
                <div className="flex flex-col  gap-4" key={risk?._id}>
                  <div className="border rounded-3 p-3 mt-3">
                    <div>
                      <div className="d-flex align-items-start justify-content-between">
                        <Link to={`/admin/risks/${risk?._id}`}>
                          <p className="mb-2 text-dark fw-bold hover-underline">
                            {risk?.reference} — {risk?.title}
                          </p>
                        </Link>
                        <div className="ml-auto">
                          <TooltipButton
                            tooltip="Unlink Risk"
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
                            {isLinkedRiskDeleting ? (
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
                        <span>{draftJSToText(risk?.description)}</span>
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-2 flex-wrap">
                      <p>
                        <span className="text-black font-medium">
                          Business Unit:
                        </span>{" "}
                        <span>{risk?.group?.name || "N/A"}</span>
                      </p>

                      <p>
                        <span className="text-black font-medium">
                          Risk Score:
                        </span>{" "}
                        <span className="font-semibold">{score}</span>
                      </p>

                      <p>
                        <span className="text-black font-medium">Owner:</span>{" "}
                        <span>{risk?.owner?.name || "N/A"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
      <Modal isOpen={isOpen} toggle={() => toggle()} centered>
        <ModalHeader toggle={() => toggle()}></ModalHeader>
        <ModalBody>
          <h5 className="text-danger mt-2 mb-3">{`You are about to remove this risk from ${clause?.control?.name} compliance toolkit.`}</h5>
          <Alert className="rounded-3 border border-warning" color="warning">
            <p className="text-warning">
              Once you remove this risk, it will no longer be considered as
              supporting evidence for this clause during compliance reviews or
              audits.
            </p>
          </Alert>
          <div className="text-center mt-2 d-flex justify-content-end gap-2">
            <Button onClick={() => toggle()} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              disabled={isLinkedRiskDeleting}
              onClick={() => {
                deleteLinkedRisk({
                  controlId: clause?._id,
                  evidenceId: selected,
                });
                toggle();
              }}
              className="bg-primary text-white"
            >
              {isLinkedRiskDeleting ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
