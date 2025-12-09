import { Button, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./utils/cropImage";
import { imsLogger } from "@/services/loggerService";

const ImageEditor = ({
  photoUrl,
  newImage,
  setNewImage,
  toggleModal,
  croppedImage,
  setCroppedImage,
  setOpenScreen,
  setFile,
  formUpload,
  openFormEditor,
  setOpenFormEditor,
  ...props
}) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const resetImage = () => {
    setZoom(1);
    setRotation(0);
  };
  const cropImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        newImage ? newImage : photoUrl,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
    } catch (error) {
      imsLogger(error);
    }
  };

  return (
    <>
      <div>
        <h3 className="mb-3 text-center text-danger font-weight-600">
          Edit Image
        </h3>
        <div>
          <div className="crop-container">
            <Cropper
              image={newImage ? newImage : photoUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={cropComplete}
            />
          </div>

          <div className="my-4 controls">
            {/* Range inputs from zoom and rotate */}
            <Row className=" mb-3">
              <Col className="d-flex flex-column ">
                <label htmlFor="zoom-range" className="form-label text-center">
                  Zoom: {zoomPercentage(zoom)}
                </label>
                <input
                  type="range"
                  className="form-range mx-auto"
                  id="zoom-range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                />
              </Col>
              <Col className="d-flex flex-column my-3 my-sm-0">
                <label
                  htmlFor="rotate-range"
                  className="form-label text-center"
                >
                  Straighten {rotation}°
                </label>
                <input
                  type="range"
                  className="form-range mx-auto"
                  id="rotate-range"
                  min="-360"
                  max="360"
                  // step="01"
                  value={rotation}
                  onChange={(e) => setRotation(e.target.value)}
                />
              </Col>
            </Row>
            {/* Buttons for cropping zooming, rotation */}

            <div className="d-flex justify-content-center mt-3">
              <Button
                color="danger"
                className=""
                onClick={() => {
                  setFile(null);
                  setNewImage(null);
                  setZoom(1);
                  setRotation(0);
                  toggleModal();
                  setOpenScreen("photoUpload");
                  setCroppedImage(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className=""
                color="primary"
                onClick={() => {
                  cropImage();
                  setZoom(1);
                  setRotation(0);
                  setOpenScreen("photoPreview");
                  if (formUpload) {
                    setOpenFormEditor(false);
                  }
                }}
              >
                Crop
              </Button>
              {Number(zoom > 1) || Number(rotation) !== 0 ? (
                <Button onClick={resetImage} className="" color="info">
                  Reset
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageEditor;

const zoomPercentage = (zoom) => {
  return `${Math.round(zoom * 100)}%`;
};
