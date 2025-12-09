import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkEvidence } from "@/services/complianceToolsServices";
import NotificationContext from "@/contexts/notificationContext";
import { useContext } from "react";
import useError from "@/hooks/error";

export const useLinkIncidenceEvidence = () => {
  let notify = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const { handleError } = useError();
  const { isPending, mutate: _linkIncidenceEvidence } = useMutation({
    mutationFn: ({ id, data }) => linkEvidence(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["linkedIncident"],
      });
      notify("This incident has been linked", "success");
    },
    onError: handleError,
  });

  const linkIncidenceEvidence = (id, data) => {
    _linkIncidenceEvidence({ id, data });
  };

  return { linkIncidenceEvidence, isPending };
};
