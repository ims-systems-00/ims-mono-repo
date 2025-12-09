import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import { useEffect, useState } from "react";
import * as documentManagementApi from "@/services/documentManagement";
import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "./actions";

export default function useStore(config) {
  const [overviewDocuments, setOverviewDocuments] = useState([]);
  const [visitingOverviewDocument, setVisitingOverviewDocument] =
    useState(null);
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const documentsQueryUtils = useQuery({
    required: {
      value: {
        status: "Published",
        sort: { name: 1 },
        type: "document",
        documentData: {
          purpose: config?.purpose,
        },
      },
    },
  });
  async function _loadOverviewDocuments(qstr = "") {
    try {
      _dispatch({
        [USER_ACTIONS.LIST_DOCUMENTS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagementApi.listNodes({
        query: `${qstr}`,
      });
      if (data.pagination?.currentPage === 1)
        setOverviewDocuments(data.nodes || []);
      else
        setOverviewDocuments((prevChildren) => [
          ...prevChildren,
          ...data.nodes,
        ]);
      if (data.pagination?.hasNextPage) {
        documentsQueryUtils.handlePagination({
          page: data.pagination.nextPage,
        });
      }
      _dispatch({
        [USER_ACTIONS.LIST_DOCUMENTS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err, err.message);
      _dispatch({
        [USER_ACTIONS.LIST_DOCUMENTS]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  function searchDocuments(keywords) {
    documentsQueryUtils.handleSearch({ value: { clientSearch: keywords } });
  }
  function viewDocument(document) {
    setVisitingOverviewDocument(document);
  }
  useEffect(() => {
    _loadOverviewDocuments(documentsQueryUtils.getQuery());
  }, [documentsQueryUtils.query]);

  return {
    overviewDocuments,
    processing,
    visitingOverviewDocument,
  };
}
