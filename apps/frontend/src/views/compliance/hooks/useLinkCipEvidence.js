import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkEvidence } from "@/services/complianceToolsServices";
import NotificationContext from "@/contexts/notificationContext";
import { useContext } from "react";
import useError from "@/hooks/error";

export const useLinkCipEvidence = () => {
  let notify = useContext(NotificationContext);
  const { handleError } = useError();
  const queryClient = useQueryClient();
  const { isPending, mutate: _linkCipEvidence } = useMutation({
    mutationFn: ({ id, data }) => linkEvidence(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["linkedCip"],
      });
      notify("This cip has been linked", "success");
    },
    onError: handleError,
  });

  const linkCipEvidence = (id, data) => {
    _linkCipEvidence({ id, data });
  };

  return { linkCipEvidence, isPending };
};
