import Loading from "@/components/Loader/IMSLoading";
import { getSignedUrl } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
import React, { useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";
import ToolBar from "./ToolBar";
const MemoisedPage = React.memo(Page);
const LoadingPdf = () => {
  return (
    <div className="mt-5">
      <Loading />
      <h4 className="m-3">Preparing your document</h4>
    </div>
  );
};
const ViewPdf = ({ fileDetails = {}, toolBarProps, onPageClick }) => {
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(2);
  const [scale, setScale] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const pageRefs = useRef({});
  const scrollIntoView = ({ pageNumber }) => {
    pageRefs.current[pageNumber]?.scrollIntoView({ behavior: "smooth" });
  };
  const generatePreviewUrl = async () => {
    try {
      let { data } = await getSignedUrl(fileDetails);
      setPreviewUrl(data.url);
    } catch (err) {
      imsLogger(err);
    }
  };
  useEffect(() => {
    generatePreviewUrl();
  }, []);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumberOfPages(numPages);
    setCurrentPageNumber(1);
  };
  const zoomOffset = (value = 0.5) =>
    setScale((currentScale) => currentScale + value);
  const onZoomIn = () => zoomOffset(0.3);
  const onZoomOut = () => zoomOffset(-0.3);
  return (
    <>
      <ToolBar
        page={{
          current: currentPageNumber,
          total: numberOfPages,
        }}
        fileDetails={fileDetails}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onPageChange={({ pageNumber }) => {
          scrollIntoView({ pageNumber });
          // setCurrentPageNumber(pageNumber);
        }}
        {...toolBarProps}
      />
      {/* <center>
        <div className="pdf-wrapper flex-grow-1 d-flex">
          <div className="pdf-viewer-main-pannel mx-auto">
            <Document
              file={{
                url: previewUrl,
              }}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(err) => imsLogger(err)}
              loading={<LoadingPdf />}
            >
              {Array.from(new Array(numberOfPages), (el, index) => (
                <div
                  ref={(el) => {
                    pageRefs.current[index + 1] = el;
                  }}
                >
                  <Page
                    className={"mb-2"}
                    key={`page_${index + 1}`}
                    width={600}
                    pageNumber={index + 1}
                    scale={scale}
                    loading={`Loading page ${index + 1}`}
                    onClick={(e) => {
                      scrollIntoView({ pageNumber: index + 1 });
                      onPageClick({
                        pageNumber: index + 1,
                        element: pageRefs.current[index + 1],
                      });
                    }}
                  ></Page>
                </div>
              ))}
            </Document>
          </div>
        </div>
      </center> */}
    </>
  );
};

export default ViewPdf;
