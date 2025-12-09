import useProcessingControl from "@/hooks/useProcessingControl";
import { useContext, useEffect, useState } from "react";
import USER_ACTIONS from "./actions";
import useTemplateCompiler from "@/hooks/useTemplateCompiler";
import * as aiApi from "@/services/ai";
import useQuery from "@/hooks/useQuery";
import usePaginationState from "@/hooks/usePaginationState";
import NotificationContext from "@/contexts/notificationContext";
import { imsLogger } from "@/services/loggerService";
import moment from "moment";

export default function useStore(config) {
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const [template, setTemplate] = useState(null);
  const [source, setSource] = useState(null);
  const [data, setData] = useState(null);
  const [report, setReport] = useState([]);
  const { compile } = useTemplateCompiler();
  const [savedResponses, setSavedResponses] = useState([]);
  const [visitingResponse, setVisitingResponse] = useState(null);
  const [selectedContentsInAResponse, setSelectedContentsInAResponse] =
    useState("");
  let savedResponseQuery = useQuery({});
  const { pagination, updatePagination } = usePaginationState();
  let notify = useContext(NotificationContext);

  /** crud management */

  function isReportReady() {
    const unfinished = report.find((r) => !r.response);
    return unfinished ? false : true;
  }

  function selectContentsInAResponse(content) {
    setSelectedContentsInAResponse(content);
  }

  async function createAIResponse() {
    if (!isReportReady())
      return notify("Please wait until the report is ready.", "warning");
    try {
      _dispatch({
        [USER_ACTIONS.CREATE_AI_RESPONSE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      const { data } = await aiApi.createAIResponse({
        moduleType: config.source.moduleType,
        module: config.source.module,
        template: {
          ...template,
          reportStructure: report,
        },
      });
      setSavedResponses((r) => [data.aiResponse, ...r]);
      notify("Analysis saved.", "success");
      _dispatch({
        [USER_ACTIONS.CREATE_AI_RESPONSE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err);
      notify("Failed to save analysis", "danger");
      _dispatch({
        [USER_ACTIONS.CREATE_AI_RESPONSE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
    clearAnalysis();
  }
  async function _listAIResponses(query = "") {
    try {
      _dispatch({
        [USER_ACTIONS.LIST_AI_RESPONSE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      const { data } = await aiApi.listAIResponses({ query });
      setSavedResponses(data.aiResponses);
      updatePagination(data.pagination);
      _dispatch({
        [USER_ACTIONS.LIST_AI_RESPONSE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.LIST_AI_RESPONSE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }

  async function getAIResponse(id) {
    try {
      _dispatch({
        [USER_ACTIONS.GET_AI_RESPONSE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      await aiApi.getAIResponse(id);
      _dispatch({
        [USER_ACTIONS.GET_AI_RESPONSE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.LOAD_RISK]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function deleteAIResponse(id) {
    try {
      _dispatch({
        [USER_ACTIONS.DELETE_AI_RESPONSE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await aiApi.deleteAIResponse(id);
      notify(
        moment(data.aiResponse.createdAt).format("DD/MM/YYYY HH:MM") +
          " analysis history deleted.",
        "success"
      );
      setSavedResponses((r) => r.filter((r) => r._id !== id));
      _dispatch({
        [USER_ACTIONS.DELETE_AI_RESPONSE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.DELETE_AI_RESPONSE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  async function updateAIResponse(id) {
    try {
      _dispatch({
        [USER_ACTIONS.UPDATE_AI_RESPONSE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      const { data } = await aiApi.updateAIResponse(id, {
        template: { ...template, reportStructure: report },
      });
      setSavedResponses((resp) =>
        resp.map((r) => (r._id === id ? data.aiResponse : r))
      );
      _dispatch({
        [USER_ACTIONS.UPDATE_AI_RESPONSE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      _dispatch({
        [USER_ACTIONS.UPDATE_AI_RESPONSE]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  }
  /** ui management */

  function loadMoreSavedAIResponses() {
    savedResponseQuery.handlePagination({ page: pagination.nexPage, size: 20 });
  }

  function updateResponseInTheReport(index, response) {
    setReport(
      report.map((r, i) => {
        return i === index ? { ...r, response } : r;
      })
    );
  }

  function startAnalysis() {
    setReport(template.reportStructure);
  }
  function clearAnalysis() {
    setReport([]);
  }
  function visitSavedResponse(r) {
    setVisitingResponse(r);
  }
  function _compileFullTemplate() {
    let template = { ...config.template }; // it is very important not to mute the main object
    template.dataDisplay = compile(config.template.dataDisplay, config.data);
    template.context = compile(config.template.context, config.data);
    setTemplate(template);
  }
  useEffect(() => {
    if (config.data && config.template) {
      _compileFullTemplate();
      savedResponseQuery.handleFilter({
        value: {
          source: config.source,
        },
      });
      setData(config.data);
    }
    setSource(config.source);
  }, [config.data]);

  useEffect(() => {
    _listAIResponses(savedResponseQuery.getQuery());
  }, [savedResponseQuery.query]);

  return {
    processing,
    data,
    report,
    template,
    source,
    savedResponses,
    visitingResponse,
    selectedContentsInAResponse,
    onCreateNewTask: config.onCreateNewTask,
    visitSavedResponse,
    startAnalysis,
    clearAnalysis,
    createAIResponse,
    getAIResponse,
    loadMoreSavedAIResponses,
    deleteAIResponse,
    updateResponseInTheReport,
    selectContentsInAResponse,
  };
}
