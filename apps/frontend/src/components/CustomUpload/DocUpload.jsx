import PropTypes from "prop-types";
import React from "react";

import { Button } from "@ims-systems-00/ims-ui-kit";

import defaultImage from "@/assets/img/image-placeholder.jpg";
import defaultAvatar from "@/assets/img/placeholder.jpg";

import {
  default as doc_placeholder,
  default as pdf_placeholder,
  default as pptx_placeholder,
  default as xlsx_placeholder,
} from "@/assets/img/image-placeholder.jpg";

const DocUpload = ({
  avatar,
  addBtnColor,
  addBtnClasses,
  changeBtnColor,
  changeBtnClasses,
  removeBtnColor,
  removeBtnClasses,
  onUpload = () => {},
}) => {
  const [file, setFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(
    avatar ? defaultAvatar : defaultImage
  );
  const allowedTypes = [
    "pdf",
    "pptx",
    "doc",
    "docx",
    "docm",
    "txt",
    "dotm",
    "csv",
    "png",
    "jpg",
    "jpeg",
    "xlsx",
  ];
  const placeHolders = {
    pdf: pdf_placeholder,
    pptx: pptx_placeholder,
    doc: doc_placeholder,
    docx: doc_placeholder,
    docm: doc_placeholder,
    dotm: doc_placeholder,
    xlsx: xlsx_placeholder,
  };
  const fileInput = React.useRef(null);
  const handleDocumentChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      let extension = file.name.split(".").pop().toLowerCase(),
        isSuccess = allowedTypes.indexOf(extension) > -1;
      if (isSuccess) {
        setFile(file);
        setImagePreviewUrl(placeHolders[extension]);
      }
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = (file) => {
    onUpload(file);
    setFile(null);
    setImagePreviewUrl(avatar ? defaultAvatar : defaultImage);
    fileInput.current.value = null;
  };
  const handleClick = () => {
    fileInput.current.click();
  };
  const handleRemove = () => {
    setFile(null);
    setImagePreviewUrl(avatar ? defaultAvatar : defaultImage);
    fileInput.current.value = null;
  };
  return (
    <div className="fileinput text-center">
      <input type="file" onChange={handleDocumentChange} ref={fileInput} />
      <div className={"thumbnail" + (avatar ? " img-circle" : "")}>
        <img src={imagePreviewUrl} alt="..." />
      </div>
      <div>
        {file === null ? (
          <Button
            color={addBtnColor}
            className={addBtnClasses}
            onClick={() => handleClick()}
          >
            {avatar ? "Select" : "Select"}
          </Button>
        ) : (
          <span>
            <Button
              size="sm"
              color={changeBtnColor}
              className={changeBtnClasses}
              onClick={() => handleClick()}
            >
              Change
            </Button>
            {avatar ? <br /> : null}
            <Button
              size="sm"
              color={removeBtnColor}
              className={removeBtnClasses}
              onClick={() => handleRemove()}
            >
              <i className="fa fa-times" />
            </Button>
            <Button
              size="sm"
              color={removeBtnColor}
              className={removeBtnClasses}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(file);
              }}
            >
              <i className="fas fa-upload"></i>
            </Button>
          </span>
        )}
      </div>
    </div>
  );
};

DocUpload.defaultProps = {
  avatar: false,
  removeBtnClasses: "btn-round",
  removeBtnColor: "danger",
  addBtnClasses: "btn-round",
  addBtnColor: "primary",
  changeBtnClasses: "btn-round",
  changeBtnColor: "primary",
};

DocUpload.propTypes = {
  avatar: PropTypes.bool,
  removeBtnClasses: PropTypes.string,
  removeBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link",
  ]),
  addBtnClasses: PropTypes.string,
  addBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link",
  ]),
  changeBtnClasses: PropTypes.string,
  changeBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link",
  ]),
};

export default DocUpload;
