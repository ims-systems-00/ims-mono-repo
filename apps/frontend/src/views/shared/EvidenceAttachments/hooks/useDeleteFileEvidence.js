import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeControlEvidence } from "@/services/complianceToolsServices";

export const useDeleteFileEvidence = () => {
  const queryClient = useQueryClient();

  const { isPending: isAttachmentDeleting, mutate: deleteAttachment } =
    useMutation({
      mutationFn: ({controlId, evidenceId}) => removeControlEvidence(controlId, evidenceId),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["controlFileEvidences", variables.controlId],
        });
      },
    });

  return { deleteAttachment, isAttachmentDeleting };
};
