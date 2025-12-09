import classNames from "classnames";
import useDualStateController from "@/hooks/useDualStateController";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Badge,
} from "@ims-systems-00/ims-ui-kit";
import { SignatureplacePicker } from "@/views/shared/SignaturePlacePicker/Index";
import useDocument from "../store/useDocument";
import AddExternalEmails from "./AddExternalEmails";
import AddInternalUsers from "./AddInternalUsers";
import FinalList from "./FinalList";
import MessageForm from "./MessageForm";
import useRequestSignature from "./store/useRequestSignature";
const Content = () => {
  const { isOpen: isAddInternalSigneeOpen, toggle: toggleInternalSignee } =
    useDualStateController();
  const { isOpen: isAddExternalnalSigneeOpen, toggle: toggleExterrnalSignee } =
    useDualStateController();
  const { isOpen: isCordSelectorOpen, toggle: toggleCordsSelector } =
    useDualStateController();
  const {
    selectedInternalUserIds,
    selectedExternalEmails,
    hasSignaureConfigModifed,
    areAllConditionsComplete,
    message,
    signaturePageNumber,
    signatureCords,
    signatureLocations,
    modifySignatureConfig,
    removeSignatureLocation,
    clearSignatureLocations,
    onComplete,
  } = useRequestSignature();
  const { document, addExternalSignee, addInternalSignee } = useDocument();

  const handleSendForSignature = () => {
    // Create signature locations array in the required format
    const signatureLocationsPayload = signatureLocations.map((location) => ({
      startX: location.startX,
      startY: location.startY,
      pageNumber: location.pageNumber,
    }));

    if (selectedExternalEmails.length > 0) {
      addExternalSignee({
        emails: selectedExternalEmails,
        signatureLocations: signatureLocationsPayload,
        message: message,
      });
    }

    if (selectedInternalUserIds.length > 0) {
      addInternalSignee({
        users: selectedInternalUserIds,
        signatureLocations: signatureLocationsPayload,
        message: message,
      });
    }

    onComplete({ selectedInternalUserIds, selectedExternalEmails });
  };

  return (
    <>
      <h5 className="text-center mt-2 mb-2">Request signatures</h5>
      <span className="text-center">
        {" "}
        Select your audience and location of signature.
      </span>
      <Row>
        <Col
          md="12"
          className="d-flex justify-content-center align-items-center"
        >
          <Button
            onClick={toggleInternalSignee}
            className={classNames("", {
              "text-success": selectedInternalUserIds.length,
            })}
          >
            {selectedInternalUserIds.length ? (
              <i className="fa-solid fa-circle-check" />
            ) : (
              <i className="fa-regular fa-circle" />
            )}{" "}
            Internal
          </Button>
          <Modal
            isOpen={isAddInternalSigneeOpen}
            toggle={toggleInternalSignee}
            centered
          >
            <ModalBody>
              <AddInternalUsers />
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                color="danger"
                className=" btn-block ml-auto"
                onClick={toggleInternalSignee}
              >
                Done
              </Button>
            </ModalFooter>
          </Modal>
          <Button
            onClick={toggleExterrnalSignee}
            className={classNames("", {
              "text-success": selectedExternalEmails.length,
            })}
          >
            {selectedExternalEmails.length ? (
              <i className="fa-solid fa-circle-check" />
            ) : (
              <i className="fa-regular fa-circle" />
            )}{" "}
            External
          </Button>
          <Modal
            isOpen={isAddExternalnalSigneeOpen}
            toggle={toggleExterrnalSignee}
            centered
          >
            <ModalBody>
              <AddExternalEmails />
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                color="danger"
                className=" btn-block ml-auto"
                onClick={toggleExterrnalSignee}
              >
                Done
              </Button>
            </ModalFooter>
          </Modal>{" "}
          <Button
            onClick={toggleCordsSelector}
            className={classNames("", {
              "text-success": hasSignaureConfigModifed(),
            })}
          >
            {hasSignaureConfigModifed() ? (
              <i className="fa-solid fa-circle-check" />
            ) : (
              <i className="fa-regular fa-circle" />
            )}{" "}
            Location
          </Button>
          <Modal
            isOpen={isCordSelectorOpen}
            toggle={toggleCordsSelector}
            centered
            size="lg"
          >
            <ModalBody>
              <SignatureplacePicker
                fileDetails={document?.documentData?.storageInfo}
                onConfirm={(locations) => {
                  // Handle multiple locations from the picker
                  locations.forEach((location) => {
                    modifySignatureConfig(location);
                  });
                  toggleCordsSelector();
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                color="danger"
                className=" btn-block ml-auto"
                onClick={toggleCordsSelector}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Col>

        {/* Display selected signature locations */}
        {signatureLocations.length > 0 ? (
          <Col md="12" className="mt-3">
            <div className="border rounded p-3">
              <h6 className="mb-2">
                Signature Locations ({signatureLocations.length})
                <Button
                  size="sm"
                  color="outline-danger"
                  className="ml-2"
                  onClick={clearSignatureLocations}
                >
                  Clear All
                </Button>
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {signatureLocations.map((location, index) => (
                  <Badge
                    key={index}
                    color="primary"
                    className="d-flex align-items-center"
                  >
                    Page {location.pageNumber}: ({location.startX.toFixed(2)},{" "}
                    {location.startY.toFixed(2)})
                    <Button
                      size="sm"
                      color="link"
                      className="text-white p-0 ml-1"
                      onClick={() => removeSignatureLocation(index)}
                    >
                      <i className="fa-solid fa-times" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </Col>
        ) : (
          <Col md="12" className="mt-3">
            <div className="border rounded p-3 bg-light">
              <div className="text-center text-muted">
                <i className="fa-solid fa-map-marker-alt fa-2x mb-2" />
                <p className="mb-0">No signature locations selected yet.</p>
                <small>
                  Click "Location" to add signature positions on your document.
                </small>
              </div>
            </div>
          </Col>
        )}

        <Col md="12">
          <MessageForm />
          <FinalList />
        </Col>
        <Col md="12 mt-2">
          <Button
            size="sm"
            color="primary"
            className="btn-block"
            disabled={!areAllConditionsComplete()}
            onClick={handleSendForSignature}
          >
            Send this document for signature{" "}
            {areAllConditionsComplete() ? (
              <i className="fa-solid fa-circle-check" />
            ) : null}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Content;
