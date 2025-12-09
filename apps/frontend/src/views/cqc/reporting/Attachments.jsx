import { downloadFile } from "@/services/fileHandlerService";

const Attachments = ({ attachment, processing }) => {
  return (
    <>
      <span>{attachment.key || attachment.Key} </span>
      <span
        style={{ cursor: "pointer" }}
        key={attachment._id}
        onClick={() => downloadFile(attachment)}
        className="text-info"
      >
        {processing.action === "download-attachment" &&
        processing.id === attachment._id
          ? "Downloading..."
          : "Download"}{" "}
      </span>
      <br></br>
    </>
  );
};

export default Attachments;
