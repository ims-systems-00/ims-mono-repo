import useDualStateController from "@/hooks/useDualStateController";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import CreateFolderForm from "../FolderForm";
import USER_ACTIONS from "../store/actions";
import useRepository from "../store/useRepository";

const Createfolder = () => {
  const { isOpen: isCreateForlderFormOpen, toggle: toggleCreateFolderForm } =
    useDualStateController();
  let { processing, createFolderNode } = useRepository();
  return (
    <React.Fragment>
      <Button
        disabled={
          processing[USER_ACTIONS.MOVE_NODE].status ||
          processing[USER_ACTIONS.LOAD_CHILD_NODES].status
        }
        size="sm"
        color="info"
        className="btn "
        onClick={toggleCreateFolderForm}
      >
        <i className="fa-solid fa-folder-plus" />{" "}
        {processing[USER_ACTIONS.ADD_FOLDER].status ||
        processing[USER_ACTIONS.LOAD_CHILD_NODES].status
          ? "... ..."
          : "Create folder"}
      </Button>
      <Modal
        isOpen={isCreateForlderFormOpen}
        toggle={toggleCreateFolderForm}
        centered
        backdrop={false}
      >
        <ModalBody>
          <CreateFolderForm onSubmit={createFolderNode} />
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggleCreateFolderForm}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

const Footeractions = ({ selectionNode, onMoveSubmit = () => {} }) => {
  let { processing, visitingNode } = useRepository();
  return (
    <React.Fragment>
      <Button
        disabled={
          processing[USER_ACTIONS.MOVE_NODE].status ||
          processing[USER_ACTIONS.LOAD_CHILD_NODES].status
        }
        size="sm"
        color="info"
        className="btn "
        onClick={() => {
          onMoveSubmit(selectionNode, visitingNode);
        }}
      >
        <i className="fa-solid fa-paste" />{" "}
        {processing[USER_ACTIONS.MOVE_NODE].status ||
        processing[USER_ACTIONS.LOAD_CHILD_NODES].status
          ? "... ..."
          : "Move here"}
      </Button>
      <Createfolder />
    </React.Fragment>
  );
};

export default Footeractions;
