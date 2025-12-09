import { Button } from "@ims-systems-00/ims-ui-kit";
import { deleteFileFromS3 } from "@/services/fileHandlerService";

const ConfirmUpload = ({
  photoUrl,
  blobFileData,
  setCroppedImage,
  setNewImage,
  stagedFile,
  toggleModal,
  setOpenScreen,
  setFile,
  ...props
}) => {
  const {
    file,
    handleUpload,
    validate = () => {},
    processing = false,
  } = props || {};
  return (
    <div>
      <h3 className="text-center text-info  mb-3 mb-0 font-weight-600">
        Please Confirm
      </h3>
      <div>
        <div className="d-flex flex-column align-items-center justify-content-between">
          <div className="preview-image d-flex align-items-center mb-3">
            <img src={photoUrl} alt="Preview" />
          </div>
          <span className="text-center text-danger my-3 font-weight-600">
            Are you sure you want to upload this photo?
          </span>
        </div>
        <div className="d-flex justify-content-center">
          <Button
            className=""
            color="danger"
            onClick={() => {
              setOpenScreen("photoUpload");
              setFile(null);
              blobFileData = null;
              setCroppedImage(null);
              setNewImage(null);
              if (stagedFile) deleteFileFromS3(stagedFile?.Key);
            }}
          >
            No
          </Button>
          <Button
            onClick={(e) => {
              handleUpload && handleUpload(e);
              if (file || blobFileData) {
                setFile(null);
                blobFileData = null;
                setCroppedImage(null);
                setNewImage(null);
              }
              setOpenScreen("photoUpload");
              // toggleModal();
            }}
            color="success"
            className=""
            name="attach"
            disabled={validate() ? true : processing?.action === "attach-iamge"}
          >
            {processing.action === "attach-iamge" ? "Processing" : "Yes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUpload;
