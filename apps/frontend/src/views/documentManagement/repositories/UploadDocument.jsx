import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Form, ImsInputSelect } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import {
  addDocumentToRepository,
  addReviewers,
} from "@/services/documentManagement/index";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsFormSectionDevider,
  ImsInputCheck,
  ImsInputDropZone,
} from "@/views/shared/ImsFormElements/Index";
import USER_ACTIONS from "../actions";
const UploadDocument = ({
  repository,
  document,
  processing,
  dispatch,
  isPending,
  addToDocumentsTable,
}) => {
  let repositoryId = repository._id;
  let notify = React.useContext(NotificationContext);
  let { users, lazyLoadUsers } = useUsers();
  let { entityAccessControl } = useAccess();
  const dataSet = {
    data: {
      storageInfo: [],
      signature: false,
      authorisation: false,
      signees: [],
      authorisers: [],
    },
    errors: {},
  };
  const schema = {
    storageInfo: IVal.array().min(1).label("document detail"),
    signature: IVal.label("Signature"),
    authorisation: IVal.label("Authorisation"),
    signees: IVal.array().label("Signee"),
    authorisers: IVal.array().label("Authiorisers"),
  };
  const { dataModel, handleChange, handleSubmit, validate, handleFileChange } =
    useForm(dataSet, schema);
  let handleDocumentUpload = async (e) => {
    try {
      dispatch({
        [USER_ACTIONS.UPLOAD_DOCUMENT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await addDocumentToRepository(
        repositoryId,
        dataModel.data
      );
      addToDocumentsTable && addToDocumentsTable(data.document);
      if (dataModel.data.signature) {
        let signedData = await addReviewers({
          repositoryId: repositoryId,
          documentId: data.document._id,
          type: "signature",
          users: _checkoutAllSelection(dataModel.data.signees),
        });
      }
      if (dataModel.data.authorisation) {
        let authoriserData = await addReviewers({
          repositoryId: repositoryId,
          documentId: data.document._id,
          type: "authorisation",
          users: _checkoutAllSelection(dataModel.data.authorisers),
        });
      }
      notify(
        dataModel.data.authorisation
          ? `${data.document.reference} has been sent for authorisation. Once approved it will be published in ${repository.reference} ${repository.name}.`
          : `${data.document.reference} has been uploaded to ${repository.reference} ${repository.name}.`,
        "success"
      );
      dispatch({
        [USER_ACTIONS.UPLOAD_DOCUMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.UPLOAD_DOCUMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("New document could not be added", "danger");
      imsLogger("UploadDocument", ex.response || ex);
    }
  };
  let _addSigneeAndAuthoriser = async (e) => {
    try {
      dispatch({
        [USER_ACTIONS.ADD_SIGNEE_AND_AUTHORISER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      if (dataModel.data.signature) {
        let signedData = await addReviewers({
          repositoryId: repositoryId,
          documentId: document?._id,
          type: "signature",
          users: _checkoutAllSelection(dataModel.data.signees),
        });
      }
      if (dataModel.data.authorisation) {
        let authoriserData = await addReviewers({
          repositoryId: repositoryId,
          documentId: document?._id,
          type: "authorisation",
          users: _checkoutAllSelection(dataModel.data.authorisers),
        });
      }
      notify("Signee and authorisers amended successfully", "success");
      dispatch({
        [USER_ACTIONS.ADD_SIGNEE_AND_AUTHORISER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.ADD_SIGNEE_AND_AUTHORISER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("New document could not be added", "danger");
      imsLogger("UploadDocument", ex.response || ex);
    }
  };
  let { data, errors } = dataModel;

  React.useEffect(() => {
    lazyLoadUsers();
  }, []);
  function _checkoutAllSelection(data) {
    return data?.map((itm) => itm.value).includes("*")
      ? repository?.privacy === "Organisational"
        ? users.map((user) => user._id)
        : users
            .filter((user) =>
              filterUsersByGroup(user.membership, repository?.group?._id)
            )
            .map((user) => user._id)
      : data.map((item) => item.value);
  }
  function _shouldDisableUserOption(name) {
    return data && data[name]?.map((itm) => itm.value).includes("*");
  }
  let isSignable = () => {
    return (
      repository?.privacy === "Organisational" ||
      repository?.privacy === "Business unit"
    );
  };
  const userOptions = ({ optionsDisabled }) => {
    let dropDownUsers = [
      {
        value: "*",
        label: "Select all",
      },
      ...(repository?.privacy === "Organisational"
        ? users.map((user) => ({
            value: user._id,
            label: `${user.name} ${optionsDisabled ? "(selected)" : ""}`,
            isDisabled: optionsDisabled,
          }))
        : users
            .filter((user) =>
              filterUsersByGroup(user.membership, repository?.group?._id)
            )
            .map((user) => ({
              value: user._id,
              label: `${user.name} ${optionsDisabled ? "(selected)" : ""}`,
              isDisabled: optionsDisabled,
            }))),
    ];
    return dropDownUsers;
  };
  return (
    <>
      <Form action="/" className="form-horizontal" method="get">
        {repository && (
          <>
            {!document && (
              <ImsInputDropZone
                label="File"
                clearAll={!data.storageInfo.length}
                name="general"
                noMultiple={true}
                disabled={data.storageInfo.length}
                onLoad={(files) => handleFileChange(files, "storageInfo")}
              />
            )}
            {!isPending && isSignable() && (
              <>
                <ImsFormSectionDevider
                  label="Signature"
                  deviderText="The uploaded document will be sent to the selected users to sign off."
                />
                <ImsInputCheck
                  checked={data.signature}
                  label={`Do  you want this document to be signed by the users`}
                  name="signature"
                  value={data.signature}
                  onChange={handleChange}
                  error={errors.signature}
                />
                {data.signature && (
                  <ImsInputSelect
                    isMulti
                    label="Select signee"
                    name="signees"
                    disabled={entityAccessControl({
                      users: [
                        repository?.created?.by?._id,
                        repository?.owner?._id,
                      ],
                      effect: "Allow",
                    })}
                    value={data.signees}
                    className="react-select default"
                    classNamePrefix="react-select"
                    onChange={handleChange}
                    options={userOptions({
                      optionsDisabled: _shouldDisableUserOption("signees"),
                    })}
                  />
                )}
              </>
            )}
          </>
        )}
        <ImsButtonGroup>
          {document ? (
            <Button
              name="signe&Authorise"
              onClick={(e) => handleSubmit(e, _addSigneeAndAuthoriser)}
              disabled={
                validate()
                  ? true
                  : processing[USER_ACTIONS.ADD_SIGNEE_AND_AUTHORISER].status
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing[USER_ACTIONS.ADD_SIGNEE_AND_AUTHORISER].status
                ? "Processing"
                : "Add assignee"}
            </Button>
          ) : (
            <Button
              name="upload"
              onClick={(e) => handleSubmit(e, handleDocumentUpload)}
              disabled={
                validate()
                  ? true
                  : processing[USER_ACTIONS.UPLOAD_DOCUMENT].status
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing[USER_ACTIONS.UPLOAD_DOCUMENT].status
                ? "Processing"
                : "Upload document"}
            </Button>
          )}
        </ImsButtonGroup>
      </Form>
    </>
  );
};

export default UploadDocument;
