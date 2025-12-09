import NotificationContext from "@/contexts/notificationContext";
import { useContext } from "react";
import { deleteFileFromS3 } from "@/services/fileHandlerService";
import { downloadFileFromS3 } from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";

const useFiles = ({
  downloadStart = () => {},
  downloadEnd = () => {},
  deleteStart = () => {},
  deleteEnd = () => {},
}) => {
  let notify = useContext(NotificationContext);
  async function handleDownload(key, versionId) {
    try {
      downloadStart();
      await downloadFileFromS3(key, versionId);
      notify("Document downloaded successfully", "success");
    } catch (ex) {
      imsLogger("useFiles", ex.response || ex);
      notify(
        "Document download failed. Unknown server error occurred",
        "danger"
      );
    }
    downloadEnd();
  }
  async function handleDelete(key) {
    try {
      deleteStart();
      await deleteFileFromS3(key);
      notify("Attachment downloaded successfully", "success");
    } catch (ex) {
      imsLogger("useFiles", ex.response || ex);
      notify(
        "Attachment remove failed. Unknown server error occurred",
        "danger"
      );
    }
    deleteEnd();
  }
  return {
    handleDownload,
    handleDelete,
  };
};
export default useFiles;
