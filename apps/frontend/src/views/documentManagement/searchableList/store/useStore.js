import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import { useEffect, useState } from "react";
import USER_ACTIONS from "./actions";
import { imsLogger } from "@/services/loggerService";
import * as documentManagementApi from "@/services/documentManagement";

export default function useStore(config) {
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuements] = useState([]);
  const [disabledDocuments, setDisabledDocuments] = useState([]);
  const [visitingDocument, setVisitingDocument] = useState(null);
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const documentsQueryUtils = useQuery({
    required: {
      value: {
        status: "Published",
        type: "document",
        sort: { name: 1 },
        documentData: {
          applicableModules: {
            in: config.moduleTypes,
          },
          ...(config.complianceTools && {
            complianceTools: {
              in: config.complianceTools,
            },
          }),
        },
      },
    },
  });
  async function _loadDocuments(qstr = "") {
    try {
      _dispatch({
        [USER_ACTIONS.SEARCH_DOCUMENTS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await documentManagementApi.listNodes({
        query: `${qstr}`,
      });

      // Really bad implementation as could not control the scrolling thing. Need to change later
      setAvailableDocuments((prevDocs) => {
        const combinedDocs = [...prevDocs, ...data.nodes];
        const uniqueDocs = combinedDocs.filter(
          (doc, index, self) =>
            index === self.findIndex((d) => d._id === doc._id)
        );
        return uniqueDocs;
      });

      documentsQueryUtils.updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.SEARCH_DOCUMENTS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err);
      _dispatch({
        [USER_ACTIONS.SEARCH_DOCUMENTS]: {
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
  function visitPrevPage() {
    if (documentsQueryUtils.toolState.pagination.hasPrevPage) {
      documentsQueryUtils.handlePagination({
        page: documentsQueryUtils.toolState.pagination.prevPage,
      });
    }
  }
  function visitNextPage() {
    if (documentsQueryUtils.toolState.pagination.hasNextPage) {
      documentsQueryUtils.handlePagination({
        page: documentsQueryUtils.toolState.pagination.nextPage,
      });
    }
  }
  function toggleDocumentSelection(control) {
    setSelectedDocuements((controls) => {
      let newControls = [];
      if (selectedDocuments.find((c) => c._id === control._id)) {
        /** returns the single deselected control */
        newControls = controls.filter((c) => c._id !== control._id);
        config.onDeselection(control);
      } else {
        /** returns the single newly selected control */
        newControls = [control, ...controls];
        config.onNewSelection(control);
      }
      config.onSelectionChange(newControls);
      return newControls;
    });
  }
  function isDocumentSelected(id) {
    return selectedDocuments.find((c) => c._id === id);
  }
  function isDocumentDisabled(id) {
    return disabledDocuments.find((c) => c._id === id);
  }
  function viewDocument(document) {
    setVisitingDocument(document);
  }
  useEffect(() => {
    _loadDocuments(documentsQueryUtils.getQuery());
  }, [documentsQueryUtils.query]);
  useEffect(() => {}, [documentsQueryUtils.query]);
  useEffect(() => {
    setSelectedDocuements((controls) => {
      return config.preSelectedDocuments;
    });
  }, [config.preSelectedDocuments]);
  useEffect(() => {
    setDisabledDocuments(config.preDisabledDocuments);
  }, [config.preDisabledDocuments]);
  useEffect(() => {
    if (visitingDocument) setDisabledDocuments(config.preDisabledDocuments);
  }, [config.preDisabledDocuments]);
  // useEffect(() => {
  //   documentsQueryUtils.handleRequired({
  //     value: {
  //       status: "Published",
  //       type: "document",
  //       documentData: {
  //         applicableModules: {
  //           in: config.moduleTypes,
  //         },
  //       },
  //     },
  //   });
  // }, []);
  return {
    availableDocuments,
    selectedDocuments,
    processing,
    visitingDocument,
    toggleDocumentSelection,
    searchDocuments,
    visitNextPage,
    visitPrevPage,
    isDocumentSelected,
    isDocumentDisabled,
    viewDocument,
  };
}
