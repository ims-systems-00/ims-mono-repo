import { Modal, ModalBody, ModalHeader } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import ConfirmUpload from "./ConfirmUpload";
import ImageEditor from "./ImageEditor";
import PhotoUpload from "./PhotoUpload";
import PreviewEdited from "./PreviewEdited";

const Index = ({
  photoUrl,
  avatar,
  modalOpen,
  toggleModal,
  file,
  setFile,
  formUpload = false,
  openFormEditor,
  setOpenFormEditor,
  ...props
}) => {
  const [openScreen, setOpenScreen] = React.useState("photoUpload");
  /**
   * OpenScreen names are:
   * photoUpload
   * photoEditor
   * photoPreview
   * photoConfirm
   */
  const [newImage, setNewImage] = React.useState(null);
  let [stagedFile, setStagedFile] = React.useState(null);
  const [croppedImage, setCroppedImage] = React.useState(null);
  const { url, file: blobFile } = croppedImage || {};
  const { name: blobName, size, type } = blobFile || {};
  let blobFileData;
  if (file) {
    blobFileData = new File(
      [blobFile],
      `${Date.now()}-${parseInt(Math.random() * 1000)}-${file?.name}`,
      {
        lastModified: file?.lastModified,
        lastModifiedDate: file?.lastModifiedDate,
        name: `${Date.now()}-${parseInt(Math.random() * 1000)}-${file?.name}`,
        size,
        type: file?.type,
      }
    );
  } else {
    blobFileData = new File(
      [blobFile],
      `${Date.now()}-${parseInt(Math.random() * 1000)}-${blobName}`,
      {
        lastModified: new Date().getTime(),
        lastModifiedDate: new Date(),
        name: `${Date.now()}-${parseInt(Math.random() * 1000)}-${blobName}`,
        size,
        type,
      }
    );
  }

  return (
    <>
      <Modal
        backdrop={openScreen === "photoUpload" ? true : "static"}
        keyboard={false}
        isOpen={modalOpen}
        toggle={toggleModal}
        className="editor-modal"
      >
        <ModalHeader
          toggle={() => {
            toggleModal();
            setFile(null);
            setNewImage(null);
            setOpenScreen("photoUpload");
          }}
          className="pb-3"
        ></ModalHeader>

        <ModalBody>
          {openScreen === "photoUpload" && !formUpload ? (
            <PhotoUpload
              photoUrl={photoUrl}
              avatar={avatar}
              modalOpen={modalOpen}
              toggleModal={toggleModal}
              file={file}
              setFile={setFile}
              newImage={newImage}
              setNewImage={setNewImage}
              openScreen={openScreen}
              setOpenScreen={setOpenScreen}
              {...props}
            />
          ) : openScreen === "photoEditor" || (formUpload && openFormEditor) ? (
            <ImageEditor
              toggleModal={toggleModal}
              setOpenScreen={setOpenScreen}
              photoUrl={photoUrl}
              newImage={newImage}
              setNewImage={setNewImage}
              croppedImage={croppedImage}
              setCroppedImage={setCroppedImage}
              setFile={setFile}
              formUpload={formUpload}
              openFormEditor={openFormEditor}
              setOpenFormEditor={setOpenFormEditor}
              {...props}
            />
          ) : openScreen === "photoPreview" ? (
            <PreviewEdited
              toggleModal={toggleModal}
              url={url}
              blobFile={blobFile}
              blobFileData={blobFileData}
              setOpenScreen={setOpenScreen}
              previewImageUrl={croppedImage && croppedImage}
              setCroppedImage={setCroppedImage}
              setNewImage={setNewImage}
              stagedFile={stagedFile}
              setStagedFile={setStagedFile}
              file={file}
              setFile={setFile}
              setOpenFormEditor={setOpenFormEditor}
              {...props}
            />
          ) : openScreen === "photoConfirm" ? (
            <ConfirmUpload
              photoUrl={url}
              blobFileData={blobFileData}
              setCroppedImage={setCroppedImage}
              setNewImage={setNewImage}
              stagedFile={stagedFile}
              toggleModal={toggleModal}
              setOpenScreen={setOpenScreen}
              setFile={setFile}
              {...props}
            />
          ) : null}
        </ModalBody>
      </Modal>
    </>
  );
};

export default Index;
