import attachment_placeholder from "@/assets/img/attachment-placeholder.png";
import docx_placeholder from "@/assets/img/docx-placeholder.png";
import jpg_placeholder from "@/assets/img/jpg-placeholder.png";
import pdf_placeholder from "@/assets/img/pdf-placeholder.png";
import png_placeholder from "@/assets/img/png-placeholder.png";
import pptx_placeholder from "@/assets/img/pptx-placeholder.png";
import xlsx_placeholder from "@/assets/img/xlsx-placeholder.png";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import useProcessingControl from "@/hooks/useProcessingControl";
import { downloadFile } from "@/services/fileHandlerService";
import { Button, Col, Row, Spinner } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import USER_ACTIONS from "./actions";
import { Preview } from "./Preview";
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

const Attachment = ({ attachment, children }) => {
  let { processing } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_DOCUMENT },
    { action: USER_ACTIONS.DELETE_DOCUMENT },
    { action: USER_ACTIONS.DOWNLOAD_DOCUMENT },
  ]);
  const [previewIsOpen, setPreviewIsOpen] = React.useState(false);
  const togglePreview = () => {
    setPreviewIsOpen((isOpen) => !isOpen);
  };
  let key = attachment?.key || attachment?.Key;
  function _extractImageFromExtension(key) {
    if (!key) return attachment_placeholder;
    let splited = key.split(".");
    let extension = splited[splited.length - 1];
    extension = extension.toLowerCase();
    return placeholder.get(extension) || attachment_placeholder;
  }
  return (
    <React.Fragment>
      <Row className="gx-0">
        {/* <Col xs="1" className="p-0 d-flex justify-content-center  align-items-center">
          
        </Col> */}
        <img
          src={_extractImageFromExtension(key)}
          className="mt-2 ml-3"
          style={{
            width: "16px",
            height: "20px",
          }}
          alt="..."
        />
        <Col
          // lg="6"
          // md="5"
          // xs="5"
          className=" d-flex align-items-center text-elipsis p-0"
        >
          <Button
            id="attachment-name"
            tag="span"
            className="btn-icon text-primary text-elipsis"
            onClick={() => {
              togglePreview();
            }}
          >
            <span
              data-toggle="tooltip"
              data-placement="top"
              title={attachment?.Name}
              className="font-size-body-2"
            >
              {attachment.metaText && attachment.metaText} {attachment?.Name}
            </span>

            {attachment?.modified?.by && attachment?.modified?.on && (
              <span
                id="modified-by"
                className="text-secondary my-auto text-elipsis font-size-caption  "
                key={attachment?._id}
              >
                {" "}
                Modified by{" "}
                {attachment?.modified?.by &&
                  attachment?.modified?.by?.name} on{" "}
                {moment(attachment?.modified?.on).format("DD/MM/YYYY")}
              </span>
            )}
          </Button>
        </Col>

        <Col xs="2" className=" d-flex align-items-center text-elipsis">
          <span className="float-right">
            <TooltipButton
              size="sm"
              id="detail"
              className="border-0"
              color="link"
              tooltip="Download"
              onClick={() => {
                downloadFile(attachment);
              }}
            >
              {processing[USER_ACTIONS.DOWNLOAD_DOCUMENT].status &&
              processing[USER_ACTIONS.DOWNLOAD_DOCUMENT].id ===
                attachment?._id ? (
                <Spinner size="sm" />
              ) : (
                <i className="ims-icons-20 icon-icon-download-24" />
              )}
            </TooltipButton>
            {React.Children.map(children, (child) => (
              <React.Fragment key={child.key}>
                {React.cloneElement(child, { attachment })}
              </React.Fragment>
            ))}
          </span>
        </Col>
      </Row>
      <Preview
        data={attachment}
        onDownload={() => downloadFile(attachment)}
        isOpen={previewIsOpen}
        toggle={togglePreview}
      />
    </React.Fragment>
  );
};

export default Attachment;
