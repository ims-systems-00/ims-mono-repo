import { useBuildQueryString } from "@ims-systems-00/ims-react-hooks";
import { useQuery } from "@tanstack/react-query";
import { getIncidents } from "@/services/incidentManagenmentService";

export const useGetIncidents = () => {
  const queryHandlers = useBuildQueryString({
    pagination: {
      page: 1,
      size: 10,
    },
  });

  const { query, getQueryString } = queryHandlers;

  const {
    data: response,
    isLoading: isGettingIncidents,
    error,
  } = useQuery({
    queryKey: ["incidents", query],
    queryFn: () => getIncidents({ query: getQueryString() }),
  });

  const { incidents, pagination } = response?.data || {};

  return {
    isGettingIncidents,
    pagination,
    incidents,
    error,
    queryHandlers,
  };
};
