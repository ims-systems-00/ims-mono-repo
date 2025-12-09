import Loading from "@/components/Loader/Loading";
import FilePreviewer from "@/components/Previewer/FilePreviewer";
import useAccess from "@/hooks/useAccess";
import useDualStateController from "@/hooks/useDualStateController";
import {
  Button,
  Card,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  UncontrolledAlert,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentSessionData } from "@/services/authService";
import TimeLine from "@/views/shared/Timeline/Timeline";
import ShareDocumentForm from "../repository/ShareDocumentForm";
import UploadFileForm from "../repository/UploadFileForm";
import AddRevisionForm from "./AddRevisionForm";
import AuditTrail from "./auditTrail/Index";
import AuthorisationForm from "./AuthorisationForm";
import ConformanceCard from "./ConformanceCard";
import MetaInformation from "./MetaInformation";
import RequestSignatureForm from "./requestSignatures/Index";
import SignatureBadge from "./SignatureBadge";
import SignatureForm from "./SignatureForm";
import SignatureRequestCard from "./SignatureRquestCard";
import SignaureTable from "./SignaturesTable";
import useDocument from "./store/useDocument";
import VersionsTable from "./VersionsTable";
import InformationForm from "./InformationForm";
import Box from "@/components/Box/Index";
const Content = (props) => {
  let {
    processing,
    toolKits,
    document,
    signDocument,
    getSignatureDataForInternalUser,
    getAuthorisationDataForAuthoriser,
    handleVersionAuthorisation,
    hasPendingAuthorisationByTheUser,
    hasPendingSignatureByTheInternalUser,
    hasOwnership,
    signatures,
    shareDocument,
    addRevision,
    isPublished,
    isUnderAuthorisation,
    isSignatureAllowedForFileType,
    getSignatureDataForExternalUser,
    uploadNewVersion,
    updateDocumentMetaData,
  } = useDocument();
  const { isOpen: isRequestSignatureOpen, toggle: toggleRequestSignature } =
    useDualStateController();
  const { isOpen: isCommentsOpen, toggle: toggleComments } =
    useDualStateController();
  const { isOpen: isReviewOpen, toggle: toggleReview } =
    useDualStateController();
  const { isOpen: isSignatureOpen, toggle: toggleSignature } =
    useDualStateController();
  const { isOpen: isShareOpen, toggle: toggleShare } = useDualStateController();
  const { isOpen: isSignaturelistOpen, toggle: toggleSignaturelist } =
    useDualStateController();
  const { isOpen: isVersionsOpen, toggle: toggleVersions } =
    useDualStateController();
  const { isOpen: isAddRevisionOpen, toggle: toggleAddRevision } =
    useDualStateController();
  const { isOpen: isNewVersionFormOpen, toggle: toggleNewVersionForm } =
    useDualStateController();
  const { isOpen: isInfoFormOpen, toggle: toggleInfoForm } =
    useDualStateController();
  const history = useHistory();
  const { hasLimitedAccess, authUser } = useAccess();
  return (
    <Row>
      <Modal
        isOpen={isNewVersionFormOpen}
        centered
        toggle={toggleNewVersionForm}
      >
        <ModalBody>
          <UploadFileForm
            node={document}
            noMultiple
            onSubmit={(data) => {
              uploadNewVersion(data);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleNewVersionForm}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={isRequestSignatureOpen}
        centered
        toggle={toggleRequestSignature}
      >
        <ModalBody>
          <RequestSignatureForm onComplete={toggleRequestSignature} />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleRequestSignature}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isSignatureOpen} centered toggle={toggleSignature}>
        <ModalBody>
          <SignatureForm
            signature={
              getSignatureDataForInternalUser(
                getCurrentSessionData()?.user?._id
              ) || getSignatureDataForExternalUser(hasLimitedAccess()?.email)
            }
            onSubmit={(data) => {
              signDocument(data);
              toggleSignature();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleSignature}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        modalClassName="modal-view"
        isOpen={isSignaturelistOpen}
        centered
        toggle={toggleSignaturelist}
      >
        <ModalBody>
          <SignaureTable />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleSignaturelist}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isShareOpen} centered toggle={toggleShare}>
        <ModalBody>
          <ShareDocumentForm
            onSubmit={(data) => {
              shareDocument(data);
              toggleShare();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleShare}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isReviewOpen} centered toggle={toggleReview}>
        <ModalBody>
          <AuthorisationForm
            authorisation={getAuthorisationDataForAuthoriser(
              getCurrentSessionData()?.user?._id
            )}
            onSubmit={(data) => {
              handleVersionAuthorisation(data);
              toggleReview();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleReview}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isCommentsOpen} centered toggle={toggleComments}>
        <ModalBody>
          <h5 className="text-center mt-2 mb-2">Activities</h5>
          <TimeLine
            moduleType="documenttrees"
            moduleId={document?._id}
            metaInfo={{ threadId: document?.documentData?.threadId }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleComments}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isVersionsOpen} centered toggle={toggleVersions}>
        <ModalBody>
          <VersionsTable />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleVersions}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isAddRevisionOpen} centered toggle={toggleAddRevision}>
        <ModalBody>
          <AddRevisionForm
            onSubmit={(data) => {
              addRevision(data);
              toggleAddRevision();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleAddRevision}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isInfoFormOpen} centered toggle={toggleInfoForm}>
        <ModalBody>
          <InformationForm
            node={document}
            toolKits={toolKits}
            onSubmit={async (data) => {
              await updateDocumentMetaData(data);
              toggleInfoForm();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleInfoForm}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Col>
        {isUnderAuthorisation() &&
          !hasPendingAuthorisationByTheUser(
            getCurrentSessionData()?.user?._id
          ) && (
            <UncontrolledAlert color="info">
              <i className="fa-solid fa-code-pull-request" /> One or more
              authorisers still have not authorised this document to be
              published. The document will be published after all authorisers
              have approved.
            </UncontrolledAlert>
          )}
        {hasPendingAuthorisationByTheUser(
          getCurrentSessionData()?.user?._id
        ) && (
          <UncontrolledAlert color="primary">
            <i className="fa-solid fa-code-pull-request" />{" "}
            {document?.created?.by?.name} requires your authorisation on this
            document to be published in the repository.{" "}
            <Link to="#" onClick={toggleReview} className=" py-0 alert-link">
              Review now <i className="fa-solid fa-file-circle-check" />
            </Link>
          </UncontrolledAlert>
        )}
        {hasPendingSignatureByTheInternalUser(
          getCurrentSessionData()?.user?._id
        ) && (
          <UncontrolledAlert color="primary">
            <i className="fa-solid fa-signature" />{" "}
            {document?.created?.by?.name} has requested for your signature on
            this document.{" "}
            <Link to="#" onClick={toggleSignature} className=" py-0 alert-link">
              Sign this document <i className="fa-solid fa-pen-nib" />
            </Link>
          </UncontrolledAlert>
        )}
      </Col>
      <Col md="12" className="mb-1">
        <Box>
          <Button
            size="sm"
            color="secondary"
            className="border-0"
            onClick={() => history.goBack()}
          >
            <i className="ims-icons-20 icon-icon-arrowleft-24" />
          </Button>
          {isUnderAuthorisation() &&
            hasOwnership(getCurrentSessionData()?.user?._id) && (
              <>
                <Button
                  size="sm"
                  color="secondary"
                  onClick={toggleAddRevision}
                  className="border-0"
                >
                  Add revision <i className="fa-solid fa-file-lines" />
                </Button>
              </>
            )}
          {!isUnderAuthorisation() &&
            hasOwnership(getCurrentSessionData()?.user?._id) && (
              <>
                {document.status === "Rejected" &&
                document?.documentData?.dvID === 1 ? null : (
                  <Button
                    size="sm"
                    color="secondary"
                    onClick={toggleNewVersionForm}
                    className="border-0"
                  >
                    <i className="ims-icons-20 icon-icon-fileplus-24" /> Add new
                    version
                  </Button>
                )}
              </>
            )}
          {hasOwnership(getCurrentSessionData()?.user?._id) &&
            isSignatureAllowedForFileType() &&
            isPublished() && (
              <>
                {" "}
                <Button
                  size="sm"
                  color="secondary"
                  onClick={toggleRequestSignature}
                  className="border-0"
                >
                  <i className="ims-icons-20 icon-icon-checkcircle-24" />{" "}
                  Request signatures
                </Button>
              </>
            )}
          {signatures.length && isSignatureAllowedForFileType() ? (
            <>
              <Button
                size="sm"
                color="secondary"
                className="border-0"
                onClick={toggleSignaturelist}
              >
                <i className="ims-icons-20 icon-icon-note-24" /> View signatures
              </Button>
            </>
          ) : null}
          {getCurrentSessionData()?.user?._id && (
            <Button
              size="sm"
              color="secondary"
              onClick={toggleComments}
              className="border-0"
            >
              <i className="ims-icons-20 icon-icon-activity-24" /> Activities
            </Button>
          )}
          {hasPendingAuthorisationByTheUser(
            getCurrentSessionData()?.user?._id
          ) && (
            <React.Fragment>
              <Button
                size="sm"
                color="secondary"
                onClick={toggleReview}
                className="border-0"
              >
                <i className="ims-icons-20 icon-icon-key-24" /> Auth requests
              </Button>
            </React.Fragment>
          )}
          {getCurrentSessionData()?.user?._id && (
            <React.Fragment>
              <Button
                size="sm"
                color="secondary"
                onClick={toggleVersions}
                className="border-0"
              >
                <i className="ims-icons-20 icon-icon-notebook-24" /> Versions
              </Button>
              {authUser({
                service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
                action: ACTIONS.CREATE,
                effect: EFFECTS.ALLOW,
              }) && (
                <React.Fragment>
                  <Button
                    size="sm"
                    color="secondary"
                    onClick={toggleShare}
                    className="border-0"
                  >
                    <i className="ims-icons-20 icon-icon-share-24" /> Share
                  </Button>
                  {hasOwnership(getCurrentSessionData()?.user?._id) && (
                    <Button
                      size="sm"
                      color="secondary"
                      onClick={toggleInfoForm}
                      className="border-0"
                    >
                      <i className="ims-icons-20 icon-icon-alert-circle-24" />{" "}
                      Settings
                    </Button>
                  )}
                </React.Fragment>
              )}
              <AuditTrail />
            </React.Fragment>
          )}
        </Box>
      </Col>
      <Col md="8">
        {document ? (
          <Box>
            <FilePreviewer
              fileDetails={document?.documentData?.storageInfo || null}
            />
          </Box>
        ) : (
          <Loading text="Loading document..." />
        )}
      </Col>
      <Col md="4">
        <SignatureRequestCard onSignatureOpen={toggleSignature} />
        <SignatureBadge />
        <MetaInformation />
        <ConformanceCard />
      </Col>
    </Row>
  );
};

export default Content;
