import { UncontrolledAlert } from "@ims-systems-00/ims-ui-kit";
import { Link, useHistory } from "react-router-dom";
import { getCurrentSessionData } from "@/services/authService";
import useRepository from "./store/useRepository";
const ImportantAlerts = () => {
  const {
    hasPendingAuthorisation,
    hasPendingSignature,
    viewAuthorisationRequest,
  } = useRepository();
  const history = useHistory();
  return (
    <>
      {hasPendingAuthorisation && (
        <UncontrolledAlert color="primary">
          <i className="fa-solid fa-code-pull-request" /> There are pending
          documents waiting for your approval.{" "}
          <Link
            onClick={() =>
              viewAuthorisationRequest(getCurrentSessionData()?.user?._id)
            }
            to="#"
            className=" py-0 alert-link"
          >
            View now
          </Link>
        </UncontrolledAlert>
      )}
      {hasPendingSignature && (
        <UncontrolledAlert color="primary">
          <i className="fa-solid fa-signature" />
          There are pending documents waiting for your signature.{" "}
          <Link
            to="/admin/document-signatures/requests"
            className=" py-0 alert-link"
          >
            View now
          </Link>
        </UncontrolledAlert>
      )}
    </>
  );
};

export default ImportantAlerts;
