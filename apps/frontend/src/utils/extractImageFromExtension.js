import attachment_placeholder from "@/assets/img/attachment-placeholder.png";
import docx_placeholder from "@/assets/img/docx-placeholder.png";
import folder_placeholder from "@/assets/img/folder.svg";
import jpg_placeholder from "@/assets/img/jpg-placeholder.png";
import pdf_placeholder from "@/assets/img/pdf-placeholder.png";
import png_placeholder from "@/assets/img/png-placeholder.png";
import pptx_placeholder from "@/assets/img/pptx-placeholder.png";
import xlsx_placeholder from "@/assets/img/xlsx-placeholder.png";

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

export function extractImageFromExtension(type, name) {
  if (type === "document") {
    let splited = name.split(".");
    let extension = splited[splited.length - 1];
    extension = extension.toLowerCase();
    return placeholder.get(extension) || attachment_placeholder;
  }
  if (type === "folder") {
    return folder_placeholder;
  }
}
