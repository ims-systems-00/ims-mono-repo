import { useBuildQueryString } from "@ims-systems-00/ims-react-hooks";
import { useQuery } from "@tanstack/react-query";
import { listNodes } from "@/services/documentManagement";

export const useGetDocumentTrees = () => {
  const queryHandlers = useBuildQueryString({
    pagination: {
      page: 1,
      size: 10,
    },
    required: {
      value: {
        type: "document",
      },
    },
  });

  const { query, getQueryString } = queryHandlers;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["documenttress", query],
    queryFn: () => listNodes({ query: getQueryString() }),
  });

  const { nodes, pagination } = response?.data || {};
  console.log(response?.data);

  return {
    isLoading,
    pagination,
    nodes,
    error,
    queryHandlers,
  };
};
