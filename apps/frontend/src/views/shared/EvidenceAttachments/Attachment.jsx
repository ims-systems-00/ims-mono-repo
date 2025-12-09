// import { downloadFileFromS3 } from '@/services/file-handler-service';
import React from "react";
import attachmentPlaceholder from "../../../assets/img/attachment-placeholder.svg";
import { useEvidenceAttachment } from "./store";
import { FileDropZone } from "@/components/file-uploader/file-drop-zone";
import Attachment from "@/components/file-uploader/attachment";
import { EmptyContent } from "@/components/EmptyContent";
import { downloadFile } from "@/services/fileHandlerService";
import FilePreviewer from "@/components/Previewer/FilePreviewer";
import { DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import { useState } from "react";

export const Attachments = () => {
  let { openDrawer } = useDrawer();
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  
  const handleAttachmentClick = (fileStructure) => {
    setSelectedAttachment(fileStructure);
    openDrawer("document-preview");
  };
  const {
    attachments,
    createControlEvidenceAttachment,
    deleteControlEvidenceAttachment,
    readOnly,
    disableEmptyBlock,
  } = useEvidenceAttachment();

  const handleDownload = async (file) => {
    await downloadFile(file);
  };
  const handleDeleteFile = async (controlId, evidenceId) => {
    deleteControlEvidenceAttachment({ controlId, evidenceId });
  };

  return (
    <>
      {!readOnly && (
        <FileDropZone
          hint="Drop files here or click to upload files"
          disabled={readOnly}
          onLoad={async (files) => {
            console.log("files", files);
            await Promise.all(
              files.map((file) => createControlEvidenceAttachment(file))
            );
          }}
        />
      )}

      {attachments?.length
        ? attachments?.map((file) => (
            <Attachment
              key={file.fileStorage.Key}
              fileStructure={{
                Name: decodeURIComponent(file.fileStorage.Name),
                Key: file.fileStorage.Key,
                Bucket: file.fileStorage.Bucket,
              }}
              onDownload={() => handleDownload(file.fileStorage)}
              onDelete={() =>
                handleDeleteFile(file.controlStatusId._id, file._id)
              }
              onClick={handleAttachmentClick}
              //disableDelete={readOnly}
            />
          ))
        : readOnly &&
          !disableEmptyBlock && (
            <EmptyContent height={200}>
              <div className="h-100 w-100 d-flex bg-secondary-extra-light rounded-3 justify-content-center align-items-center">
                <img src={attachmentPlaceholder} alt="attachment placeholder" />
                <p>No attachments found</p>
              </div>
            </EmptyContent>
          )}

      <DrawerRight drawerId="document-preview">
        <FilePreviewer fileDetails={selectedAttachment} />
      </DrawerRight>
    </>
  );
};
