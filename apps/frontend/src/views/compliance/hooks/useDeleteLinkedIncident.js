import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeControlEvidence } from "@/services/complianceToolsServices";

export const useDeleteLinkedIncident = () => {
  const queryClient = useQueryClient();

  const { isPending: isLinkedIncidentDeleting, mutate: deleteLinkedIncident } =
    useMutation({
      mutationFn: ({ controlId, evidenceId }) =>
        removeControlEvidence(controlId, evidenceId),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["linkedIncident"],
        });
      },
    });

  return { deleteLinkedIncident, isLinkedIncidentDeleting };
};
