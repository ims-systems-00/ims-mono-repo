import { useEffect } from "react";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import Loading from "@/components/Loader/Loading";
import { Link } from "react-router-dom";
import { extractImageFromExtension } from "@/utils/extractImageFromExtension";
import { useGetLinkedDocumentTree } from "../../hooks/useGetLinkedDocumentTree";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import { useState } from "react";
import { useDeleteLinkedDocument } from "@/views/compliance/hooks/useDeleteLinkedDocument";
import { Alert, Spinner } from "@ims-systems-00/ims-ui-kit";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "@ims-systems-00/ims-ui-kit";
import { NoEvidenceFound } from "../NoEvidence";

export const LinkedDocumentTree = ({ clause }) => {
  const { isOpen, toggle } = useDualStateController();
  const [selected, setSelected] = useState("");
  const { controlEvidence, refetch, isLoading } = useGetLinkedDocumentTree(
    clause?._id
  );
  const { deleteLinkedDocument, isLinkedDocumentDeleting } =
    useDeleteLinkedDocument();

  useEffect(() => {
    if (clause?._id) {
      refetch();
    }
  }, [clause]);

  return (
    <div className="mb-3">
      <h5>Linked Document Trees</h5>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            {controlEvidence?.length === 0 && (
              <div className="mt-3">
                <NoEvidenceFound text="There are no Documents linked to this" />
              </div>
            )}
            {controlEvidence?.length > 0 &&
              controlEvidence?.map((evidence) => {
                const node = evidence?.relatedDocument;
                return (
                  <div className="flex flex-col gap-4" key={node?._id}>
                    <div className="border rounded-3 p-3 mt-3">
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="d-flex gap-2 mb-2 align-items-center">
                          <img
                            src={extractImageFromExtension(
                              node?.type,
                              node?.name
                            )}
                            alt="..."
                          />
                          <Link
                            to={`/admin/document-repositories/${node?.repository}/nodes/${node?._id}`}
                          >
                            <p className="text-dark fw-bold hover-underline">
                              {node?.name}
                            </p>
                          </Link>
                        </div>
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
                            {isLinkedDocumentDeleting ? (
                              <Spinner size="sm" />
                            ) : (
                              <i className="ims-icons-20 icon-icon-trash-24" />
                            )}
                          </TooltipButton>
                        </div>
                      </div>

                      <BadgeStatus status={node?.status} />

                      {/* <p className="mt-3 mb-2">
                        <span className="text-black font-medium">
                          Description:
                        </span>{" "}
                        <span className="font-semibold">
                          {node?.repository?.description}
                        </span>
                      </p> */}
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
          <h5 className="text-danger mt-2 mb-3">{`You are about to remove this document from ${clause?.control?.name} compliance toolkit.`}</h5>
          <Alert className="rounded-3 border border-warning" color="warning">
            <p className="text-warning">
              Once you remove this document, it will no longer be considered as
              supporting evidence for this clause during compliance reviews or
              audits.
            </p>
          </Alert>
          <div className="text-center mt-2 d-flex justify-content-end gap-2">
            <Button onClick={() => toggle()} className="bg-danger text-white">
              Cancel
            </Button>
            <Button
              disabled={isLinkedDocumentDeleting}
              onClick={() => {
                deleteLinkedDocument({
                  controlId: clause?._id,
                  evidenceId: selected,
                });
                toggle();
              }}
              className="bg-primary text-white"
            >
              {isLinkedDocumentDeleting ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
