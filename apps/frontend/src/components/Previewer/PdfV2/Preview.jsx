import Loading from "@/components/Loader/Loading";
import useIntersectionObserver from "@/hooks/useIntersectonObserver";
import React, { useState, useCallback, createRef, useRef } from "react";
import { useEffect } from "react";
import { Document, Page } from "react-pdf";
import { imsLogger } from "@/services/loggerService";
import { getScrollParent } from "@/utils/elementHandler";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import useViewer from "./store/useViewer";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PageWithAdvancedAbility = ({ pageNumber }) => {
  const { changePage, scale } = useViewer();
  const pageElement = useRef();
  const [intersectionThreshold, setIntersectionThreshold] = useState(0.5);
  const observerCallback = useCallback(
    (entries) => {
      imsLogger(
        "observer response: ",
        entries[0].isIntersecting,
        "for",
        pageNumber
      );
      if (pageElement?.current) {
        let scrollableParent = getScrollParent(pageElement?.current);
        scrollableParent.onscroll = function (e) {
          if (entries[0].isIntersecting) {
            /**
             * handle onPageVisible logic
             */
            // changePage(pageNumber);
          }
        };
      }
    },
    [pageNumber, pageElement?.current, intersectionThreshold]
  );
  useEffect(() => {
    if (pageElement?.current) {
      let scrollableParent = getScrollParent(pageElement?.current);
      function _getThreshold() {
        /**
         * threshold algorithm:
         * 1. measure ratio between root and page height (r/p)
         * 2. check the if root is bigger or not
         * 3. if root bigger threshold 1
         * 4. if root is smaller threshold ratio - .1 offset
         */
        let rootHeight = scrollableParent?.clientHeight;
        let pageHeight = pageElement?.current?.clientHeight;
        let ratio = rootHeight / pageHeight;
        if (ratio > 1) return 1;
        return parseFloat(ratio - 0.1).toFixed(2);
      }
      setIntersectionThreshold(_getThreshold());
    }
  }, [pageElement]);
  useIntersectionObserver(pageElement?.current, {
    observerConfig: {
      root: getScrollParent(pageElement?.current),
      threshold: intersectionThreshold,
    },
    observerCallback,
  });
  return (
    <>
      <div ref={pageElement} className="shadow-md m-4 rounded overflow-hidden">
        <Page
          pageNumber={pageNumber}
          scale={scale}
          loading={`Loading page ${pageNumber}`}
          onClick={(e) => {}}
        ></Page>
      </div>
      <span className="text-secondary mt-2">
        <b>{pageNumber}</b>
      </span>
    </>
  );
};
const Preview = ({}) => {
  const { previewUrl, mainPannelPageRefs, changeNumberOfPages, totalPages } =
    useViewer();
  return (
    <React.Fragment>
      <center>
        <Document
          file={previewUrl}
          onLoadSuccess={({ numPages, ...rest }) => {
            changeNumberOfPages(numPages);
          }}
          onLoadError={(err) => imsLogger(err)}
          loading={
            <div className="p-5">
              <Loading text="Loading document..." />
            </div>
          }
        >
          {Array.from(new Array(totalPages), (el, index) => (
            <div
              key={`page_${index + 1 + Date.now() + Math.random()}`}
              ref={(el) => {
                if (mainPannelPageRefs.current)
                  mainPannelPageRefs.current[index + 1] = el;
              }}
            >
              <PageWithAdvancedAbility pageNumber={index + 1} />
            </div>
          ))}
        </Document>
      </center>
    </React.Fragment>
  );
};
let MemoisedPreview = React.memo(Preview);
export default MemoisedPreview;
