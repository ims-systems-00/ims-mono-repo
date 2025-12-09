/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from "react";
import {
  useDropzone
} from "react-dropzone";
import DragNDropImg from "../../assets/img/dragAndDropImage.svg";

const states = { inProgress: "in-progress", static: "static" };

export function FileDropZone({
  onLoad = async (_selectedFiles) => {},
  hint = "Drag 'n' drop, or click to select files",
  height = 200,
  acceptedFileTypes,
  noMultiple,
  disabled,
  clearAll,
}){
  const [loading, setLoading] = useState(states.static);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onDrop = useCallback(
    (
      acceptedFiles,
      fileRejections,
      _event
    ) => {
      const duplicateNames = selectedFiles.map((file) => file.name);
      const newFiles = acceptedFiles.filter(
        (file) => !duplicateNames.includes(file.name)
      );
      setSelectedFiles([...newFiles]);

      // Optional: Handle rejected files
      if (fileRejections.length > 0) {
        fileRejections.forEach((rejection) => {
          console.warn(
            `Rejected file: ${rejection.file.name}`,
            rejection.errors
          );
        });
      }
    },
    [selectedFiles]
  );

  useEffect(() => {
    async function handleLoad() {
      if (selectedFiles.length === 0) return;
      setLoading(states.inProgress);
      try {
        await onLoad(selectedFiles);
      } catch (err) {
        console.error(err);
      }
      setLoading(states.static);
    }
    handleLoad();
  }, [selectedFiles]);

  useEffect(() => {
    if (clearAll) setSelectedFiles([]);
  }, [clearAll]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: !noMultiple,
    disabled,
  });

  return (
    <section>
      <div
        {...getRootProps({
          className:
            "file-dropzone " +
            (loading === states.inProgress ? "blink-element" : ""),
        })}
        style={{ height }}
      >
        <input {...getInputProps()} />
        <div className="d-flex flex-column justify-content-center align-items-center">
          <img src={DragNDropImg} alt="" />
          <p className="text-primary">{hint}</p>
        </div>
      </div>
    </section>
  );
}
