import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeControlEvidence } from "@/services/complianceToolsServices";

export const useDeleteLinkedDocument = () => {
  const queryClient = useQueryClient();

  const { isPending: isLinkedDocumentDeleting, mutate: deleteLinkedDocument } =
    useMutation({
      mutationFn: ({ controlId, evidenceId }) =>
        removeControlEvidence(controlId, evidenceId),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["linkedDocumentTress"],
        });
      },
    });

  return { deleteLinkedDocument, isLinkedDocumentDeleting };
};
