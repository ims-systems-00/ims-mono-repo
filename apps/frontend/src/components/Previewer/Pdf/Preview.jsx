import useIntersectionObserver from "@/hooks/useIntersectonObserver";
import { imsLogger } from "@/services/loggerService";
import { getScrollParent } from "@/utils/elementHandler";
import React, { useCallback, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
const PageWithAdvancedAbility = ({
  showPageNumber = false,
  pageNumber,
  onPageVisible = () => {},
  ...rest
}) => {
  let [pageElement, setPageElement] = useState();
  let [intersectionThreshold, setIntersectionThreshold] = useState(0.5);
  const observerCallback = useCallback(
    (entries) => {
      imsLogger(
        "observer response: ",
        entries[0].isIntersecting,
        "for",
        pageNumber
      );
      if (pageElement) {
        let scrollableParent = getScrollParent(pageElement);
        scrollableParent.onscroll = function (e) {
          if (entries[0].isIntersecting)
            onPageVisible({
              pageNumber,
            });
        };
      }
    },
    [pageNumber, onPageVisible, pageElement, intersectionThreshold]
  );
  useEffect(() => {
    if (pageElement) {
      let scrollableParent = getScrollParent(pageElement);
      function _getThreshold() {
        /**
         * threshold algorithm:
         * 1. measure ratio between root and page height (r/p)
         * 2. check the if root is bigger or not
         * 3. if root bigger threshold 1
         * 4. if root is smaller threshold ratio - .1 offset
         */
        let rootHeight = scrollableParent.clientHeight;
        let pageHeight = pageElement.clientHeight;
        let ratio = rootHeight / pageHeight;
        if (ratio > 1) return 1;
        return parseFloat(ratio - 0.1).toFixed(2);
      }
      setIntersectionThreshold(_getThreshold());
    }
  }, [pageElement]);
  useIntersectionObserver(pageElement, {
    observerConfig: {
      root: getScrollParent(pageElement),
      threshold: intersectionThreshold,
    },
    observerCallback,
  });
  return (
    <>
      <div className="shadow-md m-4 rounded overflow-hidden">
        <Page
          canvasRef={setPageElement}
          pageNumber={pageNumber}
          {...rest}
        ></Page>
      </div>
      {showPageNumber && (
        <span className="text-secondary mt-2">
          <b>{pageNumber}</b>
        </span>
      )}
    </>
  );
};
const Preview = ({
  showPageNumber = false,
  pageRefs = {},
  previewUrl,
  scale,
  onPageClick = () => {},
  onPageVisible = () => {},
  onDocumentLoaded = () => {},
}) => {
  const [numberOfPages, setNumberOfPages] = useState(0);
  const onDocumentLoadSuccess = ({ numPages, ...rest }) => {
    setNumberOfPages(numPages);
    onDocumentLoaded({ numPages, ...rest });
  };
  return (
    <>
      <center>
        <Document
          file={{
            url: previewUrl,
          }}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => imsLogger(err)}
          loading={"Loafing pages"}
        >
          {Array.from(new Array(numberOfPages), (el, index) => (
            <div
              ref={(el) => {
                if (pageRefs.current) pageRefs.current[index + 1] = el;
              }}
            >
              <PageWithAdvancedAbility
                containerId={"imspdf-page-wrapper-" + index + 1}
                key={`page_${index + 1 + Date.now() + Math.random()}`}
                pageNumber={index + 1}
                scale={scale}
                loading={`Loading page ${index + 1}`}
                onPageVisible={onPageVisible}
                showPageNumber={showPageNumber}
              />
            </div>
          ))}
        </Document>
      </center>
    </>
  );
};
let MemoisedPreview = React.memo(Preview);
export default MemoisedPreview;
