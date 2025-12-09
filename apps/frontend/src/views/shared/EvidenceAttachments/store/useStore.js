import useCreateFileEvidence from "../hooks/useCreateFileEvidence";
import { useDeleteFileEvidence } from "../hooks/useDeleteFileEvidence";
import useGetFileEvidences from "../hooks/useGetFileEvidences";

export function useStore({ controlId = null }) {
  const {
    attachments,
    queryHandlers: queryHandler,
    pagination,
  } = useGetFileEvidences({ controlId });

  const { createAttachment, isAttachmentCreating } = useCreateFileEvidence();
  const {
    deleteAttachment: deleteControlEvidenceAttachment,
    isAttachmentDeleting,
  } = useDeleteFileEvidence();
  function createControlEvidenceAttachment(evidenceData) {
    return createAttachment({
      controlId,
      evidenceData,
    });
  }

  console.log("attachments", attachments);

  return {
    attachments,
    pagination,
    queryHandler,
    createControlEvidenceAttachment,
    isAttachmentCreating,
    deleteControlEvidenceAttachment,
    isAttachmentDeleting,
    // createAttachmentAndAddToList,
    // deleteAttachmentFromList,
  };
}
