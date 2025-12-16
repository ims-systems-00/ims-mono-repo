import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function Guidelines() {
  const [numPages, setNumPages] = useState();
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className="guidelines-container">
      <Row>
        <Col md="8" className="mx-auto">
          <center>
            <Document
              className={"mx-auto"}
              file="/guidelines.pdf"
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(numPages), (el, index) => {
                let pageNum = index + 1;
                return (
                  <div>
                    <Page scale={1.2} className="" pageNumber={pageNum} />
                    {/* <p className="text-center">{pageNum}</p> */}
                  </div>
                );
              })}
            </Document>
          </center>
        </Col>
      </Row>
    </div>
  );
}

export default Guidelines;
