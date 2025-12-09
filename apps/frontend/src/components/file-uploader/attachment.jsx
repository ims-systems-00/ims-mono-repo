import { useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { ImAttachment } from "react-icons/im";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import { getAttachmentImage } from "@/utils/attathmentImages";
import { LoadingSpinner } from "@/components/LoadingSpinner";
function haveSameFileStructure(
  obj1,
  obj2 = {
    Name: "",
    Key: "",
    Bucket: "",
  }
) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
  }

  return true;
}
const states = {
  inProgress: "in-progress",
  static: "static",
};
export function Attachment({
  fileStructure = {
    Name: "",
    Key: "",
    Bucket: "",
  },
  disableDelete = false,
  onDownload = async () => {},
  onDelete = async () => {},
  onClick = () => {},
}) {
  const [downloadState, setDownloadState] = useState(states.static);
  const [deleteState, setDeleteState] = useState(states.static);
  let { openDrawer } = useDrawer();
  if (!haveSameFileStructure(fileStructure))
    return (
      <div className="bg-secondary-extra-light rounded-2 mb-2 p-3 d-flex align-items-center">
        <ImAttachment size={20} />
        <div className="ms-3">
          <p className="text-dark">Invalid attachment.</p>
          <small className="text-secondary">
            This attachment has been removed or not found.
          </small>
        </div>
      </div>
    );

  async function handleDownload() {
    try {
      setDownloadState(states.inProgress);
      await onDownload();
    } catch (err) {
      console.log(err);
    }
    setDownloadState(states.static);
  }
  async function handleDelete() {
    try {
      setDeleteState(states.inProgress);
      await onDelete();
    } catch (err) {
      console.log(err);
    }
    setDeleteState(states.static);
  }
  return (
    <div className="bg-secondary-extra-light rounded-3 mb-2 p-2 d-flex justify-content-between">
      <div
        style={{ cursor: "pointer" }}
        onClick={() => onClick(fileStructure)}
        className=" d-flex gap-3 align-items-center"
      >
        <img
          src={getAttachmentImage(fileStructure.Name)}
          style={{ width: 20 }}
        />
        <div>
          <p className="text-dark  hover-underline">{fileStructure.Name} </p>
        </div>
      </div>
      {/* </span> */}
      <div>
        <UncontrolledDropdown className="mt-row-actions">
          <DropdownToggle size="sm" outline className="border-0">
            {deleteState === states.inProgress ||
            downloadState === states.inProgress ? (
              <LoadingSpinner height={20} />
            ) : (
              <HiOutlineDotsHorizontal />
            )}
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem onClick={handleDownload}>
              {downloadState === states.inProgress ? (
                <LoadingSpinner height={20} />
              ) : (
                <AiOutlineDownload />
              )}{" "}
              Download
            </DropdownItem>
            {!disableDelete && (
              <DropdownItem onClick={handleDelete}>
                {deleteState === states.inProgress ? (
                  <LoadingSpinner height={20} />
                ) : (
                  <RiDeleteBin5Line />
                )}{" "}
                Delete
              </DropdownItem>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  );
}

export default Attachment;
