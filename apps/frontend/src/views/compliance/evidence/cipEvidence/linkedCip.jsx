import { useEffect } from "react";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import Loading from "@/components/Loader/Loading";
import { Link } from "react-router-dom";
import { useGetLinkedCip } from "@/views/compliance/hooks/useGetLinkedCip";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import { Alert, Spinner } from "@ims-systems-00/ims-ui-kit";
import { useDeleteLinkedCip } from "@/views/compliance/hooks/useDeleteLinkedCip";
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

export const LinkedCip = ({ clause }) => {
  const { isOpen, toggle } = useDualStateController();
  const [selected, setSelected] = useState("");
  const { controlEvidence, refetch, isLoading } = useGetLinkedCip(clause?._id);
  const { deleteLinkedCip, isLinkedCipDeleting } = useDeleteLinkedCip();

  useEffect(() => {
    if (clause?._id) {
      refetch();
    }
  }, [clause]);

  return (
    <div className="mb-3">
      <h5>Linked Cips</h5>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="">
          {controlEvidence?.length === 0 && (
            <div className="mt-3">
              <NoEvidenceFound text="There are no Improvements (OFIs) linked to this" />
            </div>
          )}
          {controlEvidence?.length > 0 &&
            controlEvidence?.map((evidence) => {
              const cip = evidence?.relatedCip;
              const status = cip?.implemented?.status
                ? "Implemented"
                : "Not Implemented";

              return (
                <div key={cip?._id} className="border rounded-3 p-3 mt-3">
                  <div>
                    <div className="d-flex align-items-start justify-content-between">
                      <Link to={`/admin/cip/${cip?._id}`}>
                        <p className="mb-2 text-dark fw-bold hover-underline">
                          {cip?.reference} — {cip?.title}
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
                          {isLinkedCipDeleting ? (
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
                        Opportunity For Improvement:
                      </span>{" "}
                      <span>
                        {draftJSToText(cip?.opportunityForImprovement)}
                      </span>
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mt-2 flex-wrap">
                    <p>
                      <span className="text-black fw-medium">
                        Business Unit:
                      </span>{" "}
                      <span>{cip?.group?.name || "N/A"}</span>
                    </p>

                    <p>
                      <span className="text-black fw-medium">
                        Assigned Owner:
                      </span>{" "}
                      <span>{cip?.owner?.name || "N/A"}</span>
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      )}
      <Modal isOpen={isOpen} toggle={() => toggle()} centered>
        <ModalHeader toggle={() => toggle()}></ModalHeader>
        <ModalBody>
          <h5 className="text-danger mt-2 mb-3">{`You are about to remove this CIP from ${clause?.control?.name} compliance toolkit.`}</h5>
          <Alert className="rounded-3 border border-warning" color="warning">
            <p className="text-warning">
              Once you remove this CIP, it will no longer be considered as
              supporting evidence for this clause during compliance reviews or
              audits.
            </p>
          </Alert>

          <div className="text-center mt-2 d-flex justify-content-end gap-2">
            <Button onClick={() => toggle()} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              disabled={isLinkedCipDeleting}
              onClick={() => {
                deleteLinkedCip({
                  controlId: clause?._id,
                  evidenceId: selected,
                });
                toggle();
              }}
              className="bg-primary text-white"
            >
              {isLinkedCipDeleting ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
