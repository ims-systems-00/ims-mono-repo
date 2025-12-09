import { useBuildQueryString } from "@ims-systems-00/ims-react-hooks";
import { useQuery } from "@tanstack/react-query";
import { getlinkEvidence } from "@/services/complianceToolsServices";

export const useGetLinkedDocumentTree = (controlStatusId) => {
  const queryHandlers = useBuildQueryString({
    pagination: {
      page: 1,
      size: 30,
    },
    required: {
      value: {
        evidenceType: "document-management",
      },
    },
  });

  const { query, getQueryString } = queryHandlers;

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["linkedDocumentTress", query],
    queryFn: () =>
      getlinkEvidence(controlStatusId, { query: getQueryString() }),
      enabled: !!controlStatusId,
  });

  const { controlEvidence, pagination } = response?.data || {};

  return {
    isLoading,
    pagination,
    controlEvidence,
    error,
    queryHandlers,
    refetch,
  };
};
