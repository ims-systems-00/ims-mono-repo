import useProcessingControl from "@/hooks/useProcessingControl";
import { useCallback, useEffect, useRef, useState } from "react";
import { USER_ACTIONS } from "./actions";
import * as fileHandlerService from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
const useViewerStore = ({ fileDetails, onPageClick = () => {} }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scale, setScale] = useState(1);
  const mainPannelPageRefs = useRef({});
  const { processing, dispatch: _dispatch } = useProcessingControl(
    Object.keys(USER_ACTIONS).map((action) => {
      return { action: USER_ACTIONS[action] };
    })
  );
  const _generatePreviewUrl = async () => {
    try {
      _dispatch({
        [USER_ACTIONS.API_LOAD]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await fileHandlerService.getSignedUrl(fileDetails);
      setPreviewUrl(data.url);
      _dispatch({
        [USER_ACTIONS.API_LOAD]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err);
      _dispatch({
        [USER_ACTIONS.API_LOAD]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };
  useEffect(() => {
    _generatePreviewUrl();
  }, []);
  const _scrollToPage = useCallback((pageNumber) => {
    mainPannelPageRefs.current[pageNumber]?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);
  const _zoomOffset = (value = 0.5) =>
    setScale((currentScale) => {
      let newScale = currentScale + value;
      return newScale > 0.1 && newScale < 2 ? newScale : currentScale;
    });
  const zoomIn = () => _zoomOffset(0.2);
  const zoomOut = () => _zoomOffset(-0.2);
  const jumpToPage = useCallback((pageNumber) => {
    _scrollToPage(pageNumber);
    setCurrentPage(pageNumber);
  }, []);
  const changePage = useCallback((pageNumber) => {
    imsLogger("on page fired at layout: ", pageNumber);
    setCurrentPage(pageNumber);
  }, []);
  const changeNumberOfPages = useCallback((numPages) => {
    setTotalPages(numPages);
  }, []);
  const allOnPageHandler = (e) => {
    onPageClick(e);
  };
  return {
    currentPage,
    totalPages,
    previewUrl,
    processing,
    mainPannelPageRefs,
    scale,
    fileDetails,
    zoomIn,
    zoomOut,
    changePage,
    changeNumberOfPages,
    jumpToPage,
    allOnPageHandler,
  };
};
export default useViewerStore;
