import pdfPlaceholder from "../assets/img/attachments/pdf-placeholder.png";
import jpgPlaceholder from "../assets/img/attachments/jpg-placeholder.png";
import pngPlaceholder from "../assets/img/attachments/png-placeholder.png";
import xlsxPlaceholder from "../assets/img/attachments/xlsx-placeholder.png";
import pptxPlaceholder from "../assets/img/attachments/pptx-placeholder.png";
import docxPlaceholder from "../assets/img/attachments/docx-placeholder.png";

const fileTypeMap = {
  docx: docxPlaceholder,
  pdf: pdfPlaceholder,
  xlsx: xlsxPlaceholder,
  pptx: pptxPlaceholder,
  jpg: jpgPlaceholder,
  jpeg: jpgPlaceholder,
  png: pngPlaceholder,
};

export function getAttachmentImage(filename) {
  if (!filename) return docxPlaceholder;

  const ext = filename.split(".").pop()?.toLowerCase();

  return ext && fileTypeMap[ext] ? fileTypeMap[ext] : docxPlaceholder;
}
