import { useBuildQueryString } from "@ims-systems-00/ims-react-hooks";
import { useQuery } from "@tanstack/react-query";
import { getlinkEvidence } from "@/services/complianceToolsServices";

export const useGetLinkedCip = (controlStatusId) => {
  const queryHandlers = useBuildQueryString({
    pagination: {
      page: 1,
      size: 30,
    },
    required: {
      value: {
        evidenceType: "cip",
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
    queryKey: ["linkedCip", query],

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
