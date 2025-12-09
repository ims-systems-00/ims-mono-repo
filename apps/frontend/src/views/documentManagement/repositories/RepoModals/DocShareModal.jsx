import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
} from "@ims-systems-00/ims-ui-kit";
import { useEffect } from "react";
import IVal from "@/validations/validator";
import ImsEmailSelect from "@/views/shared/ImsFormElements/ImsEmailSelect";
import { ImsInputText } from "@/views/shared/ImsFormElements/Index";
import useRepository from "../store/repository/useRepository";
import {} from "@ims-systems-00/ims-ui-kit";

const DocShareModal = ({
  isRepoModalOpen,
  toggleRepoModal,
  handleSelectedRow,
}) => {
  let { users, lazyLoadUsers } = useUsers();
  useEffect(() => {
    lazyLoadUsers();
  }, []);
  let { repository } = useRepository();
  const dataSet = {
    data: {
      emails: [],
      message: "",
    },
    errors: {},
  };
  const schema = {
    emails: IVal.array().min(1).max(50).required().label("Email"),
    message: IVal.label("Message"),
  };
  let _shareDoc = async () => {
    // try {
    //   dispatch({
    //     [USER_ACTIONS.SHARE_DOCUMENT]: {
    //       status: true,
    //       error: false,
    //       id: null,
    //     },
    //   });
    //   let { data } = await shareDocument(
    //     repository._id,
    //     selectedRow._id,
    //     dataModel.data
    //   );
    //   notify(`${data.node.reference} shared successfully`, "success");
    //   dispatch({
    //     [USER_ACTIONS.SHARE_DOCUMENT]: {
    //       status: false,
    //       error: false,
    //       id: null,
    //     },
    //   });
    // } catch (err) {
    //   dispatch({
    //     [USER_ACTIONS.SHARE_DOCUMENT]: {
    //       status: false,
    //       error: true,
    //       id: null,
    //     },
    //   });
    //   imsLogger(err || err.message);
    // }
  };
  const { dataModel, handleChange, validate } = useForm(dataSet, schema);
  let { data, errors } = dataModel;
  return (
    <div>
      <Modal
        centered
        backdrop={false}
        isOpen={isRepoModalOpen === "Share"}
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
          >
            <h4 className="font-weight-600">Share document</h4>
          </ModalHeader>
          <ModalBody>
            <Form>
              <ImsEmailSelect
                suggestionsType="All"
                label="Email"
                name="emails"
                isHorizontal={true}
                emails={users.length ? users.map((user) => user.email) : []}
                onChange={handleChange}
                placeholder="Select Emails"
              />
              <ImsInputText
                label="Message"
                placeholder="Message"
                type="textarea"
                rows="6"
                name="message"
                value={data.description}
                onChange={handleChange}
                error={errors.description}
              />
              <div className="d-flex justify-content-end align-items-center mt-2">
                <div className="ims-faded-button">
                  <Button onClick={() => toggleRepoModal("")}>Cancel</Button>
                  <Button
                    className="text-info"
                    disabled={validate() ? true : false}
                    onClick={(e) => {
                      _shareDoc();
                      toggleRepoModal("");
                    }}
                  >
                    Share
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

export default DocShareModal;
