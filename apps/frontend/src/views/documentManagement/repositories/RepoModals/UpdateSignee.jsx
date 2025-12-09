import useUsers from "@/hooks/useUsers";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import ImsEmailSelect from "@/views/shared/ImsFormElements/ImsEmailSelect";
import { ImsInputCheck } from "@/views/shared/ImsFormElements/Index";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";

const UpdateSignee = ({
  isRepoModalOpen,
  toggleRepoModal,
  docData,
  selectedRow,
  handleSelectedRow,
  signeeList,
  ...props
}) => {
  let { users, lazyLoadUsers } = useUsers();

  let [internalSigneeList, setInternalSigneeList] = React.useState([]); //internal signee list has signee ids
  let [internalSigneeEmails, setInternalSigneeEmails] = React.useState([]);
  let [externalSigneeList, setExternalSigneeList] = React.useState([]); //external signee list has signee emails
  let [showExternalSigneeFields, setShowExternalSigneeFields] =
    React.useState(false);

  React.useEffect(() => {
    if (signeeList && signeeList?.length > 0) {
      setShowExternalSigneeFields(true);
      setInternalSigneeList(
        signeeList?.filter((signee) => signee.user.externalEmail === null)
      );
      setExternalSigneeList(
        signeeList?.filter((signee) => signee.user.internalRef === null)
      );
    }
  }, [signeeList]);
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);
  React.useEffect(() => {
    if (internalSigneeList.length > 0) {
      setInternalSigneeEmails(() => {
        return internalSigneeList.map((signeeId) => {
          let user = users.find((user) => user._id === signeeId);
          return user.email;
        });
      });
    }
  }, [internalSigneeList]);
  return (
    <Modal
      centered
      backdrop="static"
      isOpen={isRepoModalOpen === "updateSignee"}
      toggle={() => {
        toggleRepoModal("");
        handleSelectedRow(null);
        setShowExternalSigneeFields(false);
      }}
    >
      <ModalHeader
        toggle={() => {
          toggleRepoModal("");
          handleSelectedRow(null);
          setShowExternalSigneeFields(signeeList.length > 0 ? true : false);
        }}
        className="mb-3"
      ></ModalHeader>
      <ModalBody>
        <div>
          <ImsEmailSelect
            isHorizontal={true}
            label="Select Internal Signee"
            suggestionsType="Internal"
            name="emails"
            emails={users.length ? users.map((user) => user.email) : []}
            // onChange={handleChange}
            placeholder="Select Emails"
            value={internalSigneeEmails}
          />
        </div>
        <div className="mt-4">
          {signeeList && signeeList.length > 0 && (
            <ImsInputCheck
              onChange={(e) => {
                setShowExternalSigneeFields(e.target.checked);
              }}
              isHorizontal={true}
              label="Add External Signee"
            />
          )}

          {showExternalSigneeFields && (
            <>
              <ImsEmailSelect
                isHorizontal={true}
                label="Select External Signee"
                suggestionsType="External"
                name="emails"
                emails={users.length ? users.map((user) => user.email) : []}
                // onChange={handleChange}
                placeholder="Select Emails"
                value={externalSigneeList}
              />
              <ImsInputText
                label="Message"
                placeholder="Message"
                type="textarea"
                rows="6"
                name="message"
                isHorizontal={true}
                // value={data.description}
                // onChange={handleChange}
                // error={errors.description}
              />
            </>
          )}
        </div>
        <div className="ims-faded-button d-flex justify-content-end">
          <Button
            onClick={() => {
              toggleRepoModal("");
              handleSelectedRow(null);
              setShowExternalSigneeFields(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => {}}>Add Signee</Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default UpdateSignee;
