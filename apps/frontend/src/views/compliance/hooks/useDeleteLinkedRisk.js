import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeControlEvidence } from "@/services/complianceToolsServices";

export const useDeleteLinkedRisk = () => {
  const queryClient = useQueryClient();

  const { isPending: isLinkedRiskDeleting, mutate: deleteLinkedRisk } =
    useMutation({
      mutationFn: ({controlId, evidenceId}) => removeControlEvidence(controlId, evidenceId),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["linkedRisk"],
        });
      },
    });

  return { deleteLinkedRisk, isLinkedRiskDeleting };
};
