import Loading from "@/components/Loader/Loading";
import NotificationContext from "@/contexts/notificationContext";
import useProcessingControl from "@/hooks/useProcessingControl";
import { Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSignaturesOnNode,
  removeSignatures,
} from "@/services/documentManagement/index";
import { imsLogger } from "@/services/loggerService";
import { capitalize } from "@/utils/capitalize";
import USER_ACTIONS from "@/views/documentManagement/actions";
import AuthoriserList from "./AuthoriserList";
import SigneeList from "./SigneeList";

const DocumentPanel = ({ ...props }) => {
  const [signeeList, setSigneeList] = useState([]);
  const { id: repoId } = useParams();
  const { docDescription } = props || {};
  const {
    _id,
    type,
    name,
    created,
    documentData,
    folderData,
    reference,
    status,
  } = docDescription || {};
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_NODE },
    { action: USER_ACTIONS.LOAD_SIGNEE },
    { action: USER_ACTIONS.REMOVE_REVIEWER },
    { action: USER_ACTIONS.ADD_SIGNEE },
  ]);
  const notify = useContext(NotificationContext);

  const getSignee = async (nodeId) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_SIGNEE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getSignaturesOnNode(repoId, nodeId);
      setSigneeList(data.usersForSignature);
      dispatch({
        [USER_ACTIONS.LOAD_SIGNEE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_SIGNEE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex);
    }
  };
  const removeSignee = async (nodeId, signData) => {
    try {
      dispatch({
        [USER_ACTIONS.REMOVE_REVIEWER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      await removeSignatures(repoId, nodeId, signData);
      setSigneeList((prev) => {
        return prev.filter((sign) => !signData.signatures.includes(sign._id));
      });
      notify("Signature removed successfully", "success");
      dispatch({
        [USER_ACTIONS.REMOVE_REVIEWER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.REMOVE_REVIEWER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex);
    }
  };
  React.useEffect(() => {
    if (type === "document") {
      getSignee(_id);
    }
  }, [type, _id]);
  return (
    <div className="repo-panel-container">
      <Table borderless className="repo-panel-table">
        <tbody>
          <tr>
            <td className="w-50">Reference</td>
            <td>{reference}</td>
          </tr>
          <tr>
            <td>{type === "folder" ? "Folder" : "Document"} Name</td>
            <td className="doc-name">{name}</td>
          </tr>
          <tr>
            <td>Created By</td>
            <td>{created?.by.name}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{capitalize(type)}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{status}</td>
          </tr>
          <tr>
            <td>Modified By</td>
            <td>{created?.by.name}</td>
          </tr>
          <tr>
            <td>Modified On</td>
            <td>
              {moment(
                type === "folder"
                  ? folderData?.modified?.on
                  : documentData?.modified?.on
              ).format("LL")}
            </td>
          </tr>
          <tr>
            <td>Created Date</td>
            <td>{moment(created?.on).format("LL")}</td>
          </tr>
        </tbody>
      </Table>
      {processing[USER_ACTIONS.LOAD_SIGNEE].status ? (
        <Loading />
      ) : (
        <>
          <div className="my-2">
            <SigneeList
              heading="Internal Signee List"
              signeeTableList={signeeList.filter(
                (signee) => signee.type === "Internal"
              )}
              removeSignee={removeSignee}
              node={docDescription}
            />
          </div>
          <div className="my-2">
            <SigneeList
              heading="External Signee List"
              signeeTableList={signeeList.filter(
                (signee) => signee.type === "External"
              )}
              removeSignee={removeSignee}
              node={docDescription}
            />
          </div>
          <div className="my-2">
            <AuthoriserList
              heading={`Authorisers of ${reference}`}
              authoriserTableList={documentData?.authorisation}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentPanel;
