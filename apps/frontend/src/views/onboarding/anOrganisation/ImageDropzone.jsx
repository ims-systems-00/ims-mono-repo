import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useDropzone } from "react-dropzone";
import { readFileAsDataUrl } from "../../../utils/readFile";
import ImageEditor from "./ImageEditor";
import { Button } from "@ims-systems-00/ims-ui-kit";
import imagePickerBg from "../../../assets/img/image-picker-bg.svg";

export default function ImageDropZone({
  hint = "+",
  url,
  onChange = () => {},
  disabled,
  position = "center",
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [editing, setEditing] = useState(false);
  const onDrop = React.useCallback(
    async (acceptedFiles, rejectedFiles) => {
      setSelectedFile(null);
      let imageSrc = await readFileAsDataUrl(acceptedFiles[0]);
      setImageSrc(imageSrc);
      setSelectedFile(acceptedFiles[0]);
      /** as soon as new file is droped we open editor */
      setEditing(true);
    },
    [selectedFile]
  );
  useEffect(() => {
    if (url) {
      setImageSrc(url);
    }
  }, [url]);
  const { getRootProps, getInputProps } = useDropzone({
    // accept: {
    //   "image/jpeg": [],
    //   "image/png": [],
    // },
    onDrop,
    multiple: false,
    disabled: disabled,
  });
  return (
    <section
      className={classNames("", {
        "mx-auto": position === "center",
      })}
    >
      {editing ? (
        <ImageEditor
          photoUrl={imageSrc}
          onCropConfirm={(image) => {
            setImageSrc(image.url);
            onChange({
              ...image,
              file: new File([image.blob], selectedFile?.name, {
                lastModified: selectedFile?.lastModified,
                lastModifiedDate: selectedFile?.lastModifiedDate,
                name: selectedFile.name,
                size: image?.blob?.size,
                type: selectedFile?.type,
              }),
            });
            setEditing(false);
          }}
          onCropCancel={() => {
            setEditing(false);
          }}
          position={position}
        />
      ) : (
        <div
          {...getRootProps({
            className: classNames("image-dropzone mb-2", {
              "mx-auto": position === "center",
            }),
          })}
        >
          <input {...getInputProps()} />

          {imageSrc ? (
            <img width="100%" src={imageSrc} />
          ) : (
            <React.Fragment>
              <img className="w-25" src={imagePickerBg} />
              <p className="text-primary  mt-2 ">
                <b>{hint}</b>
              </p>
            </React.Fragment>
          )}
        </div>
      )}
      {imageSrc && !editing && (
        <div
          className={classNames("", {
            "d-flex justify-content-center": position === "center",
          })}
        >
          <Button size="sm" outline {...getRootProps({})}>
            Change
          </Button>
        </div>
      )}
    </section>
  );
}
