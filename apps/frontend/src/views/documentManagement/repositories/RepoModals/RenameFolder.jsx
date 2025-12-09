import useForm from "@/hooks/useForm";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { mapToNodeModel } from "@/services/documentManagement/index";
import IVal from "@/validations/validator";
import ImsInputText from "@/views/shared/ImsFormElements/ImsInputText";
import useRepository from "../store/repository/useRepository";

const RenameFolder = ({
  isRepoModalOpen,
  toggleRepoModal,
  handleSelectedRow,
  selectedRow,
  uploadFolderRef,
}) => {
  let { repository } = useRepository();
  const dataSet = {
    data: {
      name: "",
    },
    errors: {},
  };
  const schema = {
    name: IVal.string().required().label("Name"),
  };

  let _renameNode = async () => {
    // try {
    //   dispatch({
    //     [USER_ACTIONS.RENAME_DOCUMENT]: {
    //       status: true,
    //       error: false,
    //       id: null,
    //     },
    //   });
    //   let { data } = await updateFolderNodeMetaData(
    //     repository._id,
    //     selectedRow._id,
    //     dataModel.data
    //   );
    //   refreshNode && refreshNode(data.node);
    //   notify("Folder renamed successfully", "success");
    //   dispatch({
    //     [USER_ACTIONS.RENAME_DOCUMENT]: {
    //       status: false,
    //       error: false,
    //       id: null,
    //     },
    //   });
    // } catch (err) {
    //   dispatch({
    //     [USER_ACTIONS.RENAME_DOCUMENT]: {
    //       status: false,
    //       error: true,
    //       id: null,
    //     },
    //   });
    //   imsLogger(err || err.message);
    // }
  };

  React.useEffect(
    () =>
      selectedRow
        ? setDataModel(mapToNodeModel(selectedRow))
        : setDataModel(dataSet),
    [selectedRow]
  );
  const {
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
    setDataModel,
  } = useForm(dataSet, schema);
  let { data, errors } = dataModel;
  return (
    <div>
      <Modal
        centered
        ref={uploadFolderRef}
        backdrop={false}
        isOpen={isRepoModalOpen === "Rename"}
        toggle={() => {
          toggleRepoModal("");
          handleSelectedRow({});
        }}
        className="repo-modal-container"
      >
        <div className="repo-modal">
          <ModalHeader
            className="mb-3"
            toggle={() => {
              toggleRepoModal("");
              handleSelectedRow({});
            }}
          ></ModalHeader>
          <ModalBody>
            <h4 className="font-weight-600">{"Rename Folder"}</h4>
            <Form>
              <ImsInputText
                label="Name"
                name="name"
                isHorizontal={true}
                value={data.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Name"
              />
              <div className="d-flex justify-content-end align-items-center mt-2">
                <div className="ims-faded-button">
                  <Button onClick={() => toggleRepoModal("")}>Cancel</Button>

                  <Button
                    className="text-info"
                    onClick={(e) => {
                      _renameNode();
                      toggleRepoModal("");
                    }}
                  >
                    Rename
                  </Button>
                </div>
              </div>
            </Form>
          </ModalBody>
        </div>
      </Modal>
    </div>
  );
};

export default RenameFolder;
