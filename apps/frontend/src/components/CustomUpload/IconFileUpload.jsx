import { Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
const DocUpload = ({
  addBtnColor,
  addBtnClasses,
  changeBtnColor,
  changeBtnClasses,
  removeBtnColor,
  removeBtnClasses,
  onUpload = () => {},
}) => {
  const fileInput = React.useRef(null);
  const handleDocumentChange = (e) => {
    onUpload(e.target.files[0]);
  };
  const handleClick = (e) => {
    fileInput.current.click();
  };
  return (
    <>
      <Button
        onClick={handleClick}
        color="info"
        size="sm"
        className="btn-icon like btn-success"
      >
        <i className="tim-icons icon-upload" />
      </Button>
      <input
        type="file"
        onChange={handleDocumentChange}
        hidden
        ref={fileInput}
      />
    </>
  );
};

export default DocUpload;
