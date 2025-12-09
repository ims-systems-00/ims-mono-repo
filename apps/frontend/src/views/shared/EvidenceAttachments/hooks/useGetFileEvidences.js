import { useQuery } from "@tanstack/react-query";
import { useBuildQueryString } from "@ims-systems-00/ims-react-hooks";
import { getControlFileEvidences } from "@/services/complianceToolsServices";

export const useGetFileEvidences = ({ controlId }) => {
  const { query, getQueryString, handlePagination, ...queryHandlers } =
    useBuildQueryString({
      filter: {
        value: {
          evidenceType: "raw-file",
        },
      },
      pagination: {
        page: 1,
        size: 10,
      },
    });
  const {
    data,
    isLoading: isGettingAttachments,
    error,
  } = useQuery({
    queryKey: ["controlFileEvidences", controlId],
    queryFn: async () => {
      const response = await getControlFileEvidences(controlId, {
        queryString: getQueryString(),
      });
      return response.data;
    },
    enabled: !!controlId,
  });

  const { controlEvidence, pagination } = data || {};

  return {
    attachments: controlEvidence,
    isGettingAttachments,
    pagination,
    error,
    handlePagination,
    queryHandlers,
  };
};

export default useGetFileEvidences;
