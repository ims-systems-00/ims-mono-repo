import { useMutation, useQueryClient } from "@tanstack/react-query";
import { imsLogger } from "@/services/loggerService";
import { addControlFileEvidence } from "@/services/complianceToolsServices";

export const useCreateFileEvidence = () => {
  const queryClient = useQueryClient();

  const { mutate: attachFileEvidence, isPending: isAttachmentCreating } =
    useMutation({
      mutationFn: async ({ controlId, evidenceData }) => {
        if (!controlId) {
          throw new Error("Control ID is required");
        }

        if (!evidenceData) {
          throw new Error("Evidence data is required");
        }

        try {
          const response = await addControlFileEvidence(
            controlId,
            evidenceData
          );
          return response.data;
        } catch (error) {
          imsLogger("useComplianceEvidence", error.response || error);
          throw error;
        }
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["controlFileEvidences", variables.controlId],
        });
      },
      onError: (error) => {
        console.error("Error attaching file evidence:", error);
      },
    });

  return {
    createAttachment: attachFileEvidence,
    isAttachmentCreating,
  };
};

export default useCreateFileEvidence;
