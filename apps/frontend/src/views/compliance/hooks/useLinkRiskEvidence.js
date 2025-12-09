import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkEvidence } from "@/services/complianceToolsServices";
import NotificationContext from "@/contexts/notificationContext";
import { useContext } from "react";
import useError from "@/hooks/error";

export const useLinkRiskEvidence = () => {
  let notify = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const { handleError } = useError();
  const { isPending, mutate: _linkRiskEvidence } = useMutation({
    mutationFn: ({ id, data }) => linkEvidence(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["linkedRisk"],
      });
      notify("This risk has been linked", "success");
    },
    onError: handleError,
  });

  const linkRiskEvidence = (id, data) => {
    _linkRiskEvidence({ id, data });
  };

  return { linkRiskEvidence, isPending };
};
