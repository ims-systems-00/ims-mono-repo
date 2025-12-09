/**
 * CAUTION: This component is restricted to be coupled with
 * the store. This is meant to be utilised
 * as an independent component only to show case data.
 */
import attachment_placeholder from "@/assets/img/attachment-placeholder.png";
import docx_placeholder from "@/assets/img/docx-placeholder.png";
import jpg_placeholder from "@/assets/img/jpg-placeholder.png";
import pdf_placeholder from "@/assets/img/pdf-placeholder.png";
import png_placeholder from "@/assets/img/png-placeholder.png";
import pptx_placeholder from "@/assets/img/pptx-placeholder.png";
import xlsx_placeholder from "@/assets/img/xlsx-placeholder.png";
import { DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";

const placeholder = new Map();
placeholder.set("pdf", pdf_placeholder);
placeholder.set("png", png_placeholder);
placeholder.set("jpg", jpg_placeholder);
placeholder.set("jpeg", jpg_placeholder);
placeholder.set("ppt", pptx_placeholder);
placeholder.set("pptx", pptx_placeholder);
placeholder.set("doc", docx_placeholder);
placeholder.set("docx", docx_placeholder);
placeholder.set("xls", xlsx_placeholder);
placeholder.set("xlsx", xlsx_placeholder);
placeholder.set("csv", xlsx_placeholder);
function _extractImageFromExtension(name) {
  let splited = name.split(".");
  let extension = splited[splited.length - 1];
  extension = extension.toLowerCase();
  return placeholder.get(extension) || attachment_placeholder;
}

const DocumentStripe = ({
  document,
  isActive,
  isDiabled,
  onClick = () => {},
  actions,
}) => {
  return (
    <React.Fragment>
      {document && (
        <DrawerOpener drawerId="document-viewer">
          <div className="document-stripe d-flex" onClick={onClick}>
            <div className="me-2 flex-shrink-0 d-flex align-items-center justify-contents-center">
              <img
                src={_extractImageFromExtension(document?.name)}
                className="image-document-type-icon"
              />
            </div>
            <div className="document-information flex-grow-1">
              <small className="">
                {document?.repository?.reference} {document?.repository?.name}
              </small>

              <p className="text-dark">{document?.name} </p>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <small className="text-muted">
                    {document?.reference} | V{document?.documentData?.dvID} |{" "}
                    {document?.documentData?.purpose}
                  </small>
                </div>
                <div className="flex-shrink-0">
                  <small className="">
                    <span className="text-muted">Owned by</span>{" "}
                    {document?.created?.by?.name}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </DrawerOpener>
      )}
    </React.Fragment>
  );
};

export default DocumentStripe;
