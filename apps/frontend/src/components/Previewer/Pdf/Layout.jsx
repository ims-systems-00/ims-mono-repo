import React, { useState, useRef } from "react";
import Preview from "./Preview";
import ToolBar from "../ToolBar";
import { useCallback } from "react";
import { useContext } from "react";
import { ViewerContext } from "./Context";
import { VIEWER_STATE_ACTIONS } from "./actions";
import { imsLogger } from "@/services/loggerService";
const Layout = ({
  fileDetails = {
    ETag: '"f81d1b47409d90e2f6cbbd9484d3a752"',
    VersionId: "h_a03.FoxGSiBWW53I3PxWnANoGYNDm3",
    Location:
      "https://sandbox-ims-static-resources-bucket.s3.eu-west-2.amazonaws.com/general/test02.pdf",
    key: "general/test02.pdf",
    Key: "general/test02.pdf",
    Bucket: "sandbox-ims-static-resources-bucket",
  },
  previewUrl,
  ...props
}) => {
  const [scale, setScale] = useState(1);
  const mainPannelPageRefs = useRef({});
  const zoomOffset = (value = 0.5) =>
    setScale((currentScale) => {
      let newScale = currentScale + value;
      return newScale > 0.1 && newScale < 2 ? newScale : currentScale;
    });
  const onZoomIn = () => zoomOffset(0.2);
  const onZoomOut = () => zoomOffset(-0.2);
  let { viewerState, dispatchViewerState } = useContext(ViewerContext);
  const scrollToPage = useCallback((pageNumber) => {
    mainPannelPageRefs.current[pageNumber]?.scrollIntoView();
    dispatchViewerState({
      type: VIEWER_STATE_ACTIONS.UPDATE_CURRENT_PAGE,
      payload: { currentPage: pageNumber },
    });
  }, []);

  const onPageChange = useCallback(({ pageNumber }) => {
    scrollToPage(pageNumber);
  }, []);
  const onSideBarPageClick = useCallback(({ pageNumber, event }) => {
    scrollToPage(pageNumber);
  }, []);
  let onPageVisible = useCallback(({ pageNumber }) => {
    imsLogger("on page fired at layout: ", pageNumber);
    dispatchViewerState({
      type: VIEWER_STATE_ACTIONS.UPDATE_CURRENT_PAGE,
      payload: { currentPage: pageNumber },
    });
  }, []);
  let onDocumentLoaded = useCallback(
    (e) => {
      scrollToPage(viewerState?.currentPage);
      dispatchViewerState({
        type: VIEWER_STATE_ACTIONS.UPDATE_TOTAL_PAGES,
        payload: { totalPages: e.numPages },
      });
    },
    [scale]
  );
  return (
    <div className="d-flex flex-column">
      <ToolBar
        page={{
          current: viewerState.currentPage,
          total: viewerState.totalPages,
        }}
        onPageChange={onPageChange}
        fileDetails={fileDetails}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        {...props.toolBarProps}
      />
      <div className="pdf-wrapper flex-grow-1 d-flex">
        {/* <SideBar previewUrl={previewUrl} onPageClick={onSideBarPageClick} /> */}
        <div className="pdf-viewer-main-pannel mx-auto">
          <Preview
            previewUrl={previewUrl}
            scale={scale}
            pageRefs={mainPannelPageRefs}
            onPageVisible={onPageVisible}
            onDocumentLoaded={onDocumentLoaded}
          />
        </div>
      </div>
    </div>
  );
};
export default Layout;
