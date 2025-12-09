import { useBuildQueryString } from "@ims-systems-00/ims-react-hooks";
import { useQuery } from "@tanstack/react-query";
import { getCIPs } from "@/services/continualImprovementServices";

export const useGetCips = () => {
  const queryHandlers = useBuildQueryString({
    pagination: {
      page: 1,
      size: 10,
    },
  });

  const { query, getQueryString } = queryHandlers;

  const {
    data: response,
    isLoading: isGettingCips,
    error,
  } = useQuery({
    queryKey: ["cips", query],
    queryFn: () => getCIPs({ query: getQueryString() }),
  });

  const { cips, pagination } = response?.data || {};

  return {
    isGettingCips,
    pagination,
    cips,
    error,
    queryHandlers,
  };
};
