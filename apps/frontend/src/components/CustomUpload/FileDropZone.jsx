import {
  Card,
  CardBody,
  Col,
  Progress,
  Row,
  Spinner,
} from "@ims-systems-00/ims-ui-kit";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  deleteFileFromS3,
  uploadFileToS3,
} from "@/services/fileHandlerService";
import { imsLogger } from "@/services/loggerService";
function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]})`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

function Attachment({ file, name, onStage, onUnstage, ...props }) {
  let [processing, setProcessing] = useState({
    action: null,
    id: null,
  });
  let [uploading, setUploading] = useState({ status: false, progress: 0 });
  let [stagedFile, setStagedFile] = React.useState(null);
  React.useEffect(() => {
    async function _uploadFile() {
      setUploading((prevState) => ({ ...prevState, status: true }));
      const config = {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploading((prevState) => ({
            ...prevState,
            progress: percentCompleted,
          }));
        },
      };
      try {
        setProcessing({ action: "upload" });
        let { data } = await uploadFileToS3(file, name, config);
        setStagedFile(data.uploadInformation);
        onStage(data.uploadInformation);
      } catch (error) {
        imsLogger("FileDropZone", error);
      }
      setProcessing({ action: null, id: null });
      setUploading({ status: false, progress: 0 });
    }
    _uploadFile();
  }, [file]);
  const onDelete = async (e) => {
    try {
      setProcessing({ action: "delete" });
      stagedFile && (await deleteFileFromS3(stagedFile.key || stagedFile.Key));
      stagedFile && onUnstage(file, stagedFile);
    } catch (error) {
      imsLogger("FileDropZone", error);
    }
    setProcessing({ action: null, id: null });
  };
  return (
    <Col md="4">
      <Card className="card-attachments border border-default">
        <CardBody>
          <p className="mb-1 font-size-subtitle-2">
            <i className="ims-icons-20 icon-icon-paperclip-24" /> {file.path}{" "}
          </p>
          <p className="m-0 font-size-subtitle-2">
            {!processing.action ? (
              <i
                onClick={onDelete}
                className="ims-icons-20 icon-icon-trash-24 text-danger"
              />
            ) : (
              <Spinner color="danger" size={"sm"} />
            )}{" "}
            {processing.action === "delete" ? (
              <span className="text-danger">Removing...</span>
            ) : (
              bytesToSize(file.size)
            )}{" "}
            {uploading.status && (
              <span className="text-warning">Uploading...</span>
            )}
          </p>
          {uploading.status && uploading.progress < 100 && (
            <Progress value={uploading.progress} />
          )}
        </CardBody>
      </Card>
    </Col>
  );
}

export default function FileDropZone({
  onLoad = () => {},
  hint = "Drag 'n' drop, or click to select files",
  ...props
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [stagedFiles, setStagedFiles] = useState([]);
  const onDrop = React.useCallback((acceptedFiles, rejectedFiles) => {
    setSelectedFiles((previousFiles) => [...previousFiles, ...acceptedFiles]);
  }, []);
  React.useEffect(() => {
    onLoad(stagedFiles);
  }, [stagedFiles]);
  React.useEffect(() => {
    props.clearAll && setSelectedFiles([]);
    props.clearAll && setStagedFiles([]);
  }, [props.clearAll]);
  const handleRemoveLocal = (deleteFile) =>
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.path !== deleteFile.path)
    );
  const addToStagedFiles = (stagedFile) =>
    setStagedFiles((prevFiles) => [...prevFiles, stagedFile]);
  const removeFromStagedFiles = (unStagedFile) =>
    setStagedFiles((prevFiles) =>
      prevFiles.filter((file) => {
        let filekey = file.Key || file.key;
        let unstageKey = unStagedFile.Key || unStagedFile.key;
        return filekey !== unstageKey;
      })
    );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: props.noMultiple ? false : true,
    disabled: props.disabled,
  });
  return (
    <section>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>{hint}</p>
      </div>
      <aside>
        <Row>
          {selectedFiles.map((file) => (
            <Attachment
              key={file.path}
              file={file}
              name={props.name}
              onUnstage={(local, staged) => {
                handleRemoveLocal(local);
                removeFromStagedFiles(staged);
              }}
              onStage={addToStagedFiles}
            />
          ))}
        </Row>
      </aside>
    </section>
  );
}
