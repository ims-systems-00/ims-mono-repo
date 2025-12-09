import { useBuildQueryString } from "@ims-systems-00/ims-react-hooks";
import { useQuery } from "@tanstack/react-query";
import { getRisks } from "@/services/riskManagementServices";

export const useGetRisks = () => {
  const queryHandlers = useBuildQueryString({
    pagination: {
      page: 1,
      size: 10,
    },
  });

  const { query, getQueryString } = queryHandlers;

  const {
    data: response,
    isLoading: isGettingRisks,
    error,
  } = useQuery({
    queryKey: ["risks", query],
    queryFn: () => getRisks({ query: getQueryString() }),
  });


  const { risks, pagination } = response?.data || {};

  return {
    isGettingRisks,
    pagination,
    risks,
    error,
    queryHandlers,
  };
};
