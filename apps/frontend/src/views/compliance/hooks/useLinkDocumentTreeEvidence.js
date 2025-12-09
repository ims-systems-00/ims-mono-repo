import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkEvidence } from "@/services/complianceToolsServices";
import NotificationContext from "@/contexts/notificationContext";
import { useContext } from "react";
import useError from "@/hooks/error";

export const useLinkDocumemtTreeEvidence = () => {
  let notify = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const { handleError } = useError();
  const { isPending, mutate: _linkDocumentTreeEvidence } = useMutation({
    mutationFn: ({ id, data }) => linkEvidence(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["linkedDocumentTress"],
      });
      notify("This document tree has been linked", "success");
    },
    onError: handleError,
  });

  const linkDocumentTreeEvidence = (id, data) => {
    _linkDocumentTreeEvidence({ id, data });
  };

  return { linkDocumentTreeEvidence, isPending };
};
