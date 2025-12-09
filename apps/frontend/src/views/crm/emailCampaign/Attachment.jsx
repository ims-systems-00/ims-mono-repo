import { downloadFile } from "@/services/fileHandlerService";
import USER_ACTIONS from "./actions";

const Attachment = ({ attachment, processing }) => {
  return (
    <div>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => downloadFile(attachment)}
        className="text-info"
      >
        {processing[USER_ACTIONS.DOWNLOAD_ATTACHMENTS].status &&
        processing[USER_ACTIONS.DOWNLOAD_ATTACHMENTS].id === attachment._id
          ? "Downloading..."
          : attachment.Name}{" "}
        <br></br>
      </span>
    </div>
  );
};

export default Attachment;
