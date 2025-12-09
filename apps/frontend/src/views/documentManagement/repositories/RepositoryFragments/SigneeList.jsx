import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useFiles from "@/hooks/useFiles";
import useProcessingControl from "@/hooks/useProcessingControl";
import { useContext } from "react";
import USER_ACTIONS from "@/views/documentManagement/actions";

const SigneeList = ({
  heading = "Signee List",
  signeeTableList = [],
  removeSignee,
  node = {},
  ...props
}) => {
  const { selectedRow } = props || {};
  const notify = useContext(NotificationContext);
  let { entityAccessControl } = useAccess();
  let { dispatch, processing } = useProcessingControl([
    { action: USER_ACTIONS.DOWNLOAD_DOCUMENT },
  ]);

  let { handleDownload } = useFiles({
    downloadStart: () =>
      dispatch({
        [USER_ACTIONS.DOWNLOAD_DOCUMENT]: {
          status: true,
          error: false,
          // id: docData?.VersionId,
        },
      }),
    downloadEnd: () =>
      dispatch({
        [USER_ACTIONS.DOWNLOAD_DOCUMENT]: {
          status: false,
          error: false,
          id: null,
        },
      }),
  });

  const downloadFile = async (docData) => {
    try {
      dispatch({
        [USER_ACTIONS.DOWNLOAD_DOCUMENT]: {
          status: true,
          error: false,
          id: docData?.VersionId,
        },
      });
      await handleDownload(
        docData?.key ? docData?.key : docData?.Key,
        docData?.VersionId
      );
      dispatch({
        [USER_ACTIONS.DOWNLOAD_DOCUMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (error) {
      dispatch({
        [USER_ACTIONS.DOWNLOAD_DOCUMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Error while downloading file", "danger");
    }
  };
  return (
    <>
      {signeeTableList.length > 0 && (
        <div className="signee-list-container">
          <div className="signee-list-header">
            <h4>{heading}</h4>
          </div>
          <div className="signee-list-body table-responsive">
            <table className="w-100 table-sm">
              <thead>
                <tr>
                  <th>Signee</th>
                  <th>Status</th>
                  {/* <th>Download</th>
                  <th>Remove</th> */}
                </tr>
              </thead>
              <tbody>
                {signeeTableList.map((signee) => {
                  return (
                    <tr>
                      <td
                        data-toggle="tooltip"
                        title={
                          heading === "Internal Signee List"
                            ? signee?.user?.internalRef?.name
                            : heading === "External Signee List" &&
                              signee?.user?.externalEmail
                        }
                      >
                        {heading === "Internal Signee List"
                          ? signee?.user?.internalRef?.name
                          : heading === "External Signee List" &&
                            signee?.user?.externalEmail
                              ?.split("@")[0]
                              .substring(0, 13)}
                      </td>
                      <td
                        className={`${
                          signee.status === "Signed"
                            ? "text-success"
                            : "text-secondary"
                        }`}
                      >
                        {signee.status}
                      </td>

                      {entityAccessControl({
                        users:
                          [
                            node?.created?.by?._id,
                            node?.repository?.created?.by,
                            node?.repository?.owner,
                          ] || [],
                        effect: "Allow",
                      }) && (
                        <>
                          <td className="download-signed-doc">
                            <span>
                              {processing[USER_ACTIONS.DOWNLOAD_DOCUMENT]
                                ?.status ? (
                                <i
                                  className={`ims-icons-20 icon-download-regular  ${
                                    signee.status === "Signed"
                                      ? "text-success"
                                      : "text-secondary"
                                  }`}
                                ></i>
                              ) : (
                                <i
                                  onClick={() => {
                                    if (signee.status === "Signed") {
                                      downloadFile(signee?.data?.signedCopy);
                                    } else {
                                      notify(
                                        "Please wait for the signee to sign",
                                        "info"
                                      );
                                    }
                                  }}
                                  className={`ims-icons-20 icon-download-regular ${
                                    signee.status === "Signed"
                                      ? "text-success"
                                      : "text-secondary"
                                  }`}
                                ></i>
                              )}
                            </span>
                          </td>
                          <td className="delete-signee">
                            <span
                              onClick={() => {
                                removeSignee(selectedRow?._id, {
                                  signatures: [signee._id],
                                });
                              }}
                              className="text-danger"
                            >
                              <i className="ims-icons-20 icon-icon-trash-24"></i>
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default SigneeList;
