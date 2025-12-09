import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeControlEvidence } from "@/services/complianceToolsServices";

export const useDeleteLinkedCip = () => {
  const queryClient = useQueryClient();

  const { isPending: isLinkedCipDeleting, mutate: deleteLinkedCip } =
    useMutation({
      mutationFn: ({ controlId, evidenceId }) =>
        removeControlEvidence(controlId, evidenceId),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["linkedCip"],
        });
      },
    });

  return { deleteLinkedCip, isLinkedCipDeleting };
};
