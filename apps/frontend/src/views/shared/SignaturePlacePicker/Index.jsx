import {
  Button,
  Col,
  Input,
  InputGroup,
  Row,
  Alert,
  Badge,
} from "@ims-systems-00/ims-ui-kit";
import { createRef, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { imsLogger } from "@/services/loggerService";
import { Rnd } from "react-rnd";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import React from "react";
import * as fileHandlerService from "@/services/fileHandlerService";
import Loading from "@/components/Loader/Loading";

function isWordFile(fileName = "") {
  for (let ext of ["doc", "docx"]) {
    if (fileName.endsWith(ext)) return true;
  }
  return false;
}

export function SignatureplacePicker({
  fileDetails,
  onConfirm = () => {},
  onDragStop = () => {},
  onChange = () => {},
  onPageChange = () => {},
}) {
  const [previewUrl, setPreiewUrl] = useState(null);
  const [totalPages, setTotalPages] = useState(20);
  const [curretPage, setCurretPage] = useState(1);
  const [drgaState, setDragState] = useState(null);
  const [addedLocations, setAddedLocations] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const pageElement = createRef();

  useEffect(() => {
    const getUrl = async () => {
      try {
        if (isWordFile(fileDetails.Name)) {
          let url = await fileHandlerService.getDocumentPreview(fileDetails);
          setPreiewUrl(url);
        } else {
          let { data } = await fileHandlerService.getSignedUrl(fileDetails);
          setPreiewUrl(data.url);
        }
      } catch (err) {
        imsLogger(err);
      }
    };
    getUrl();
  }, []);

  const _prepareAccumulatedEventData = () => {
    const parentWidth =
      pageElement?.current?.getBoundingClientRect().width || 0;
    const parentHeight =
      pageElement?.current?.getBoundingClientRect().height || 0;
    const topLeftInPercentage = {
      x: parseFloat((drgaState?.x / parentWidth).toFixed(2)),
      y: parseFloat((drgaState?.y / parentHeight).toFixed(2)),
    };
    const event = {
      signaturePosition: { topLeftInPercentage },
      pageNumber: curretPage,
    };
    return event;
  };

  const _onChange = () => {
    onChange(_prepareAccumulatedEventData());
  };

  const _onAddLocation = () => {
    if (!drgaState) {
      return;
    }

    const newLocation = _prepareAccumulatedEventData();

    // Check if this location already exists
    const existingIndex = addedLocations.findIndex(
      (loc) =>
        loc.pageNumber === newLocation.pageNumber &&
        Math.abs(
          loc.signaturePosition.topLeftInPercentage.x -
            newLocation.signaturePosition.topLeftInPercentage.x
        ) < 0.01 &&
        Math.abs(
          loc.signaturePosition.topLeftInPercentage.y -
            newLocation.signaturePosition.topLeftInPercentage.y
        ) < 0.01
    );

    if (existingIndex === -1) {
      setAddedLocations((prev) => [...prev, newLocation]);

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);

      // Reset drag state for next placement
      setDragState(null);
    }
  };

  const _onDone = () => {
    // Send all added locations to parent component
    onConfirm(addedLocations);
  };

  const _onPageChange = (page) => {
    setCurretPage(page);
    onPageChange(page);
    _onChange();
  };

  const _onDragStop = (e, d) => {
    setDragState(d);
    onDragStop(d);
  };

  const _nextPage = () => {
    if (curretPage + 1 <= totalPages) _onPageChange(curretPage + 1);
  };

  const _prevPage = () => {
    if (curretPage - 1 >= 1) _onPageChange(curretPage - 1);
  };

  const _onInputChange = (e) => {
    let value = e.currentTarget.value;
    value = parseInt(value);
    if (value && value >= 0 && value <= totalPages) return _onPageChange(value);
  };

  const removeLocation = (index) => {
    setAddedLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllLocations = () => {
    setAddedLocations([]);
  };

  return (
    <React.Fragment>
      <Row>
        <Col md={12}>
          <Alert color="info" className="mb-3">
            <strong>Instructions:</strong> Drag the signature box to your
            desired location on the document. Click "Add Location" to add it to
            your list, then drag to another position and repeat. Click "Done"
            when finished.
          </Alert>
        </Col>
      </Row>

      {/* Show added locations */}
      {addedLocations.length > 0 && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="border rounded p-3 bg-light">
              <h6 className="mb-2 d-flex justify-content-between align-items-center">
                Added Locations ({addedLocations.length})
                <Button
                  size="sm"
                  color="outline-danger"
                  onClick={clearAllLocations}
                >
                  Clear All
                </Button>
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {addedLocations.map((location, index) => (
                  <Badge
                    key={index}
                    color="success"
                    className="d-flex align-items-center"
                  >
                    Page {location.pageNumber}: (
                    {location.signaturePosition.topLeftInPercentage.x.toFixed(
                      2
                    )}
                    ,{" "}
                    {location.signaturePosition.topLeftInPercentage.y.toFixed(
                      2
                    )}
                    )
                    <Button
                      size="sm"
                      color="link"
                      className="text-white p-0 ml-1"
                      onClick={() => removeLocation(index)}
                    >
                      <i className="fa-solid fa-times" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Success message */}
      {showSuccessMessage && (
        <Row className="mb-3">
          <Col md={12}>
            <Alert color="success" className="mb-0 py-2">
              <i className="fa-solid fa-check me-1" />
              Location added successfully! Drag to another position or click
              "Done" when finished.
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={12}>
          <InputGroup>
            <Button size="sm" onClick={_prevPage} className="">
              <i className="fa-solid fa-arrow-left-long" />
            </Button>
            <Input
              type="number"
              bsSize="sm"
              className="text-center my-auto"
              placeholder="Select page"
              value={curretPage}
              onChange={_onInputChange}
            />
            <Button size="sm" onClick={_nextPage} className="">
              <i className="fa-solid fa-arrow-right-long" />
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col md="12">
          {previewUrl ? (
            <Document
              file={previewUrl}
              onLoadSuccess={({ numPages, ...rest }) => {
                setTotalPages(numPages);
              }}
              onLoadError={(err) => imsLogger(err)}
              loading={<Loading text={`Loading document...`} />}
            >
              <div ref={pageElement} className="shadow-md m-4 overflow-hidden">
                <Page
                  canvasRef={pageElement}
                  width={570}
                  pageNumber={curretPage}
                  scale={1}
                >
                  <Rnd
                    enableResizing={false}
                    bounds={"parent"}
                    onDragStop={_onDragStop}
                    minHeight={70}
                    maxHeight={70}
                    minWidth={140}
                    maxWidth={140}
                    style={{
                      border: 2,
                      borderColor: "#1d8bf8",
                      borderStyle: "solid",
                      color: "#1d8bf8",
                      backgroundColor: "rgba(29,139,248,.12)",
                      borderRadius: 5,
                    }}
                  >
                    <span
                      className="text-center my-3"
                      style={{ color: "#1d8bf8" }}
                    >
                      Signature
                    </span>
                  </Rnd>
                </Page>
              </div>
              <center>
                <small className="text-center">
                  <span className="text-primary">{curretPage}</span>/
                  {totalPages}{" "}
                </small>
              </center>
            </Document>
          ) : (
            <Loading text="Processing document..." />
          )}
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md="12">
          <div className="d-flex justify-content-between">
            <Button
              size="sm"
              color="primary"
              className="flex-grow-1 me-2"
              onClick={_onAddLocation}
              disabled={!drgaState}
            >
              <i className="fa-solid fa-plus me-1" />
              Add Location
            </Button>
            <Button
              size="sm"
              color="success"
              className="flex-grow-1"
              onClick={_onDone}
              disabled={addedLocations.length === 0}
            >
              <i className="fa-solid fa-check me-1" />
              Done ({addedLocations.length})
            </Button>
          </div>
        </Col>
      </Row>

      {!drgaState && (
        <Row className="mt-2">
          <Col md={12}>
            <Alert color="warning" className="mb-0">
              <i className="fa-solid fa-exclamation-triangle me-1" />
              Please drag the signature box to a location before adding it.
            </Alert>
          </Col>
        </Row>
      )}

      {drgaState && addedLocations.length === 0 && (
        <Row className="mt-2">
          <Col md={12}>
            <Alert color="info" className="mb-0">
              <i className="fa-solid fa-info-circle me-1" />
              Great! Now click "Add Location" to add this position to your list.
            </Alert>
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
}
