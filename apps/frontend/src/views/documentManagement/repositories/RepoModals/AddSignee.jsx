import RepoButton from "@/components/Button/Index";
import Loading from "@/components/Loader/Loading";
import FilePreviewer from "@/components/Previewer/FilePreviewer";
import IMSSelectDropdown from "@/components/SelectDropdown/IMSSelectDropdown";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import useUsers from "@/hooks/useUsers";
import { Button, Col, Label, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  addExternalSignature,
  addInternalSignature,
  getNode,
  getSignaturesOnNode,
  removeSignatures,
} from "@/services/documentManagement/index";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import USER_ACTIONS from "@/views/documentManagement/actions";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import ImsEmailSelect from "@/views/shared/ImsFormElements/ImsEmailSelect";
import { ImsInputCheck } from "@/views/shared/ImsFormElements/Index";
import SigneeList from "../RepositoryFragments/SigneeList";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";

const AddSignee = () => {
  // get query params
  const { id: repoId, nodeId } = useParams();
  const history = useHistory();

  let { query, toolState } = useQuery({
    required: {
      value: {
        sort: "-type name",
      },
    },
    filter: {
      value: {
        parentNode: nodeId,
        status: "Published",
      },
    },
  });

  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_NODE },
    { action: USER_ACTIONS.LOAD_SIGNEE },
    { action: USER_ACTIONS.REMOVE_REVIEWER },
    { action: USER_ACTIONS.ADD_SIGNEE },
  ]);

  const [signeeList, setSigneeList] = useState([]);
  const [node, setNode] = useState({});
  const [sigPos, setSigPos] = React.useState({
    x: 0.1,
    y: 0.85,
  });

  const getSingleNode = async (nodeId) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_NODE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getNode(repoId, nodeId);
      setNode(data.node);
      dispatch({
        [USER_ACTIONS.LOAD_NODE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      dispatch({
        [USER_ACTIONS.LOAD_NODE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(err || err.response);
    }
  };
  React.useEffect(() => {
    getSingleNode(toolState?.filter?.value?.parentNode);
  }, [query]);

  const getSignee = async (nodeId) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_SIGNEE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await getSignaturesOnNode(repoId, nodeId);
      setSigneeList(data.usersForSignature);
      dispatch({
        [USER_ACTIONS.LOAD_SIGNEE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_SIGNEE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex);
    }
  };
  //remove signature
  const removeSignee = async (nodeId, signData) => {
    try {
      dispatch({
        [USER_ACTIONS.REMOVE_REVIEWER]: {
          status: true,
          error: false,
          id: null,
        },
      });
      await removeSignatures(repoId, nodeId, signData);
      setSigneeList((prev) => {
        return prev.filter((sign) => !signData.signatures.includes(sign._id));
      });
      notify("Signature removed successfully", "success");
      dispatch({
        [USER_ACTIONS.REMOVE_REVIEWER]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.REMOVE_REVIEWER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex);
    }
  };
  const addSignee = async (nodeId, signeeData) => {
    try {
      dispatch({
        [USER_ACTIONS.ADD_SIGNEE]: {
          status: true,
          error: false,
          id: null,
        },
      });

      // Create signature locations array in the new format
      const signatureLocations = [
        {
          startX: sigPos.x,
          startY: sigPos.y,
          pageNumber: signeeData?.pageNumber || 1,
        },
      ];

      if (signeeData && signeeData?.users?.length > 0) {
        await addInternalSignature(repoId, nodeId, {
          users: signeeData.users,
          signatureLocations: signatureLocations,
        });
      }
      if (signeeData && signeeData?.emails?.length > 0) {
        await addExternalSignature(repoId, nodeId, {
          emails: signeeData.emails,
          signatureLocations: signatureLocations,
          message: signeeData.message,
        });
      }
      const { data } = await getSignaturesOnNode(repoId, nodeId);
      setSigneeList(data.usersForSignature);
      notify("Signee added successfully", "success");
      dispatch({
        [USER_ACTIONS.ADD_SIGNEE]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.ADD_SIGNEE]: {
          status: false,
          error: true,
          id: null,
        },
      });
      notify("Signee could not be added", "danger");
      imsLogger(ex);
    }
  };
  let [processingSignee, setProcessingSignee] = React.useState(false);
  let [showExternalSigneeFields, setShowExternalSigneeFields] = React.useState(
    signeeList.some((signee) => (signee?.type !== "External" ? true : false))
  );
  let { users, lazyLoadUsers } = useUsers();
  useEffect(() => {
    lazyLoadUsers();
  }, []);
  let notify = React.useContext(NotificationContext);
  const dataSet = {
    data: {
      users: [],
      emails: [],
      message: "",
      pageNumber: 1,
    },
    errors: {},
  };
  const schema = {
    users: IVal.array().max(50).label("Select Internal Signee"),
    emails: IVal.array().max(50).label("Select External Signee"),
    message: IVal.label("Message"),
    pageNumber: IVal.number().required().label("Page Number"),
  };

  const [selectedPage, setSelectedPage] = React.useState(1);

  const [totalPages, setTotalPages] = React.useState(0);
  const getTotalPages = (totalPages) => {
    setTotalPages(totalPages);
  };

  const { dataModel, handleChange, handleSubmit, validate, handleFileChange } =
    useForm(dataSet, schema);
  let { data, errors } = dataModel;
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  const handleClearForm = () => {
    dataModel.data = {
      users: [],
      emails: [],
      message: "",
      pageNumber: 1,
    };
    dataModel.errors = {};
    // setShowExternalSigneeFields(false);
    setSelectedPage(1);
  };

  React.useEffect(() => {
    if (node?.type === "document") {
      getSignee(node._id);
    }
  }, [node]);

  let { entityAccessControl } = useAccess();

  const [scale, setScale] = React.useState(1);
  const handleScale = (value) => {
    setScale(value);
  };
  const zoomOffset = (value = 0.5) => {
    handleScale((currentScale) => {
      let newScale = currentScale + value;
      return newScale > 0.1 && newScale < 2 ? newScale : currentScale;
    });
  };
  const onZoomIn = () => {
    zoomOffset(0.2);
  };
  const onZoomOut = () => {
    zoomOffset(-0.2);
  };
  return (
    <div className="content">
      <div className="repository-container p-5">
        <i
          onClick={() => {
            history.push(`/admin/document-repositories/${repoId}`);
          }}
          className="ims-icons-20 icon-back-regular back-button"
        ></i>
        <div>
          {processing[USER_ACTIONS.LOAD_SIGNEE].status ||
          processing[USER_ACTIONS.LOAD_NODE].status ? (
            <Loading />
          ) : (
            <>
              {entityAccessControl({
                users:
                  [
                    node?.created?.by?._id,
                    node?.repository?.created?.by,
                    node?.repository?.owner,
                  ] || [],
                effect: "Allow",
              }) ? (
                <Row>
                  <Col lg="9">
                    <div className="d-flex justify-content-end my-4 me-3">
                      {onZoomIn && (
                        <div className="me-3">
                          <div onClick={onZoomIn} className="">
                            <RepoButton>
                              <span>
                                {/* Zoom In */}
                                <i className="tim-icons icon-simple-add" />
                              </span>
                            </RepoButton>
                          </div>
                        </div>
                      )}
                      {onZoomOut && (
                        <div>
                          <div onClick={onZoomOut} className="">
                            <RepoButton>
                              <span>
                                {/* Zoom Out */}
                                <i className="tim-icons icon-simple-delete ml-1" />
                              </span>
                            </RepoButton>
                          </div>
                        </div>
                      )}
                    </div>
                    <FilePreviewer
                      showRnd={true}
                      selectedPage={selectedPage}
                      setSigPos={setSigPos}
                      getTotalPages={getTotalPages}
                      scale={scale}
                      fileDetails={{
                        ...node?.documentData?.storageInfo,
                        _id: node?.documentData?._id,
                      }}
                      modalView={false}
                      onDownload={() => {
                        // handleDownload(key, docData?.VersionId);
                      }}
                      onPreviewClose={() => {}}
                      // {...props}
                    />
                  </Col>
                  <Col lg="3">
                    <div>
                      <ImsEmailSelect
                        isHorizontal={true}
                        label="Select Internal Signee"
                        suggestionsType="Internal"
                        name="users"
                        emails={
                          users.length ? users.map((user) => user.name) : []
                        }
                        // value={signeeList
                        //   .filter((signee) => signee.type === "Internal")
                        //   .map((signee) => {
                        //     let user = users.find(
                        //       (user) => user._id === signee.user.internalRef._id
                        //     );
                        //     return user?.name;
                        //   })}
                        signeeList={signeeList}
                        users={users}
                        onChange={handleChange}
                        placeholder="Select Emails"
                        processingSignee={processingSignee}
                        setProcessingSignee={setProcessingSignee}
                      />
                    </div>
                    <div className="mt-4">
                      <ImsInputCheck
                        onChange={(e) => {
                          setShowExternalSigneeFields(e.target.checked);
                        }}
                        isHorizontal={true}
                        label="Add External Signee"
                      />
                      {showExternalSigneeFields && (
                        <>
                          <ImsEmailSelect
                            isHorizontal={true}
                            label="Select External Signee"
                            suggestionsType="External"
                            name="emails"
                            emails={
                              users.length
                                ? users.map((user) => user.email)
                                : []
                            }
                            onChange={handleChange}
                            // value={signeeList
                            //   .filter((signee) => signee.type === "External")
                            //   .map((signee) => signee.user.externalEmail)}
                            placeholder="Select Emails"
                            signeeList={signeeList}
                            processingSignee={processingSignee}
                            setProcessingSignee={setProcessingSignee}
                          />
                          <ImsInputText
                            label="Message"
                            placeholder="Message"
                            type="textarea"
                            rows="6"
                            name="message"
                            isHorizontal={true}
                            value={data.message}
                            onChange={handleChange}
                            // error={errors.description}
                          />
                        </>
                      )}
                    </div>
                    <div className="mt-2">
                      <Label
                        style={{
                          fontSize: "16px",
                        }}
                        className="text-dark ims-label"
                      >
                        Page Number
                      </Label>
                      <IMSSelectDropdown
                        label="Page Number"
                        name="pageNumber"
                        onSelect={(value) => {
                          setSelectedPage(value);
                          handleChange({
                            currentTarget: {
                              name: "pageNumber",
                              value: value,
                            },
                          });
                        }}
                        showValue={true}
                        disabled={totalPages === 0}
                        buttonText={"Select Page"}
                        listItems={Array.from(Array(totalPages).keys()).map(
                          (item) => {
                            return item + 1;
                          }
                        )}
                      />
                    </div>
                    <div className="ims-faded-button d-flex justify-content-end">
                      <Button
                        disabled={
                          processing[USER_ACTIONS.ADD_SIGNEE].status
                            ? true
                            : data.users.length === 0 &&
                              data.emails.length === 0
                            ? true
                            : false
                        }
                        onClick={() => {
                          setProcessingSignee(true);
                          addSignee(node?._id, data);
                          handleClearForm();
                        }}
                      >
                        Send for signatures
                      </Button>
                    </div>
                    <div className="my-2">
                      <SigneeList
                        heading="Internal Signee List"
                        signeeTableList={signeeList.filter(
                          (signee) => signee.type === "Internal"
                        )}
                        removeSignee={removeSignee}
                        node={node}
                        // {...props}
                      />
                    </div>
                    <div className="my-2">
                      <SigneeList
                        heading="External Signee List"
                        signeeTableList={signeeList.filter(
                          (signee) => signee.type === "External"
                        )}
                        removeSignee={removeSignee}
                        node={node}
                        // {...props}
                      />
                    </div>
                  </Col>
                </Row>
              ) : (
                <div className="">
                  <ErrorHandlerComponent
                    hasError={true}
                    errorMessage="You are not authorized to view this page"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSignee;
