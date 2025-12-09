import { useEffect, useState } from "react";
import Officeloader from "./Office/Index";
import Pdf from "./PdfV2/Index";
import PreviewUnavailable from "./PreviewUnavilable";
import ViewImage from "./ViewImage";
const imageExtensions = ["jpeg", "jpg", "png", "svg"];
const officeExtensions = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"];
const pdfExtensions = ["pdf"];
const allowedExtensions = [
  ...imageExtensions,
  ...officeExtensions,
  ...pdfExtensions,
];
const FilePreviwer = ({
  fileDetails,
  onDownload,
  onPreviewClose,
  onPageClick = (e) => {},
}) => {
  let [fileExtension, setExtension] = useState(null);
  function _extractExtension() {
    let key = fileDetails?.key || fileDetails?.Key;
    if (!key) return;
    let splited = key.split(".");
    let extension = splited[splited.length - 1];
    if (allowedExtensions.includes(extension.toLowerCase()))
      setExtension(extension);
  }
  useEffect(() => _extractExtension(), [fileDetails]);
  return (
    <>
      {!fileExtension ? (
        <PreviewUnavailable
          toolBarProps={{ onDownload, onPreviewClose, fileDetails }}
        />
      ) : (
        <>
          {pdfExtensions.includes(fileExtension) && (
            <Pdf fileDetails={fileDetails} onPageClick={onPageClick} />
          )}
          {officeExtensions.includes(fileExtension) && (
            <Officeloader fileDetails={fileDetails} />
          )}
          {imageExtensions.includes(fileExtension) && (
            <ViewImage
              imageInfo={fileDetails}
              toolBarProps={{ onDownload, onPreviewClose }}
            />
          )}
        </>
      )}
    </>
  );
};

export default FilePreviwer;
