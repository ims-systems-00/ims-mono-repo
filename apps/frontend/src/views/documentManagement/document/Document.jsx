import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery/index.js";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentSessionData } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import {
  getDocumentFromRepository,
  getReviews,
} from "@/services/repositoryServices";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import TimeLine from "@/views/shared/Timeline/Timeline";
import USER_ACTIONS from "../actions";
import AddSignee from "./AddSignee";
import HandleReview from "./HandleReview";
import Reviewer from "./Reviewer";

const Document = (props) => {
  let { authUser, entityAccessControl } = useAccess();
  let [signee, setSignee] = useState([]);
  let [authorisers, setAuthorisers] = useState([]);
  let [document, setDocument] = useState(null);
  let notify = React.useContext(NotificationContext);
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_SIGNEE, status: true, hasMore: true },
    { action: USER_ACTIONS.LOAD_AUTHORISER, status: true, hasMore: true },
    { action: USER_ACTIONS.ADD_SIGNEE },
    { action: USER_ACTIONS.ADD_AUTHORISER },
    { action: USER_ACTIONS.REMOVE_SIGNEE },
    { action: USER_ACTIONS.REMOVE_AUTHORISER },
    { action: USER_ACTIONS.UPLOAD_DOCUMENT },
    { action: USER_ACTIONS.ADD_SIGNEE_AND_AUTHORISER },
    { action: USER_ACTIONS.REMOVE_REVIEWER },
    { action: USER_ACTIONS.HANDLE_REVIEW },
    { action: USER_ACTIONS.LOAD_DOCUMENT },
  ]);

  let repositoryId =
    (props.match && props.match.params.repositoryId) || props?.repository?._id;
  let documentId =
    (props.match && props.match.params.id) || (props.view && props.view._id);
  let {
    query: authoriserQuery,
    getQuery: authoriserGetQuery,
    updatePagination: authoriserUpdatePagination,
  } = useQuery({
    required: {
      value: {
        repository: repositoryId,
        document: documentId,
        type: "authorisation",
      },
    },
  });

  let {
    query: signeeQuery,
    getQuery: signeeGetQuery,
    updatePagination: signeeUpdatePagination,
  } = useQuery({
    required: {
      value: {
        repository: repositoryId,
        document: documentId,
        type: "signature",
      },
    },
  });

  const fetchVersion = async (qStr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_DOCUMENT]: {
          status: true,
          error: false,
          hasMore: true,
        },
      });
      let { data } = await getDocumentFromRepository(repositoryId, documentId);
      setDocument(data.document);
      dispatch({
        [USER_ACTIONS.LOAD_DOCUMENT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_DOCUMENT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  const fetchSignee = async (qStr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_SIGNEE]: {
          status: true,
          error: false,
          hasMore: true,
        },
      });
      let { data } = await getReviews(repositoryId, {
        query: `${qStr}`,
      });
      setSignee((prevData) => [...prevData, ...data.usersForReview]);
      signeeUpdatePagination(data.pagination);
      dispatch({
        [USER_ACTIONS.LOAD_SIGNEE]: {
          status: false,
          error: false,
          hasMore: data.pagination.hasNextPage,
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
      imsLogger(ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };
  const fetchAuthoriser = async (qStr) => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_AUTHORISER]: {
          status: true,
          error: false,
          hasMore: true,
        },
      });
      let { data } = await getReviews(repositoryId, {
        query: `${qStr}`,
      });
      setAuthorisers((prevData) => [...prevData, ...data.usersForReview]);
      authoriserUpdatePagination(data.pagination);
      dispatch({
        [USER_ACTIONS.LOAD_AUTHORISER]: {
          status: false,
          error: false,
          hasMore: data.pagination.hasNextPage,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.LOAD_AUTHORISER]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex, ex.response);
      notify("Error occurred while fetching data", "danger");
    }
  };

  React.useEffect(() => {
    fetchVersion();
  }, []);
  React.useEffect(() => {
    fetchSignee(signeeGetQuery());
  }, [signeeQuery]);

  React.useEffect(() => {
    fetchAuthoriser(authoriserGetQuery());
  }, [authoriserQuery]);

  const retriveReviewer = (reviewers) => {
    let reviewer =
      reviewers &&
      reviewers.find(
        (review) => review?.user?._id === getCurrentSessionData().user._id
      );
    return reviewer;
  };
  const getSignOrAuthorisationTabs = () => {
    return document?.repository?.privacy !== "Only me"
      ? ["Add users for signature", "Signee"]
      : [];
  };
  let key = document?.details?.key || document?.details?.Key;
  return (
    <div className="content">
      <Panels
        navLinks={
          authUser({
            service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
            action: ACTIONS.CREATE,
            effect: EFFECTS.ALLOW,
          }) &&
          entityAccessControl({
            users: [
              document?.repository?.created?.by,
              document?.repository?.owner,
              document?.details?.modified?.by?._id,
            ],
            effect: "Allow",
          })
            ? ["Details", ...getSignOrAuthorisationTabs()]
            : ["Details"]
        }
        defaultPanel={"Details"}
      >
        <Panel panelId="Details">
          {processing[USER_ACTIONS.LOAD_DOCUMENT].status ? (
            <Loading />
          ) : (
            <>
              <Row>
                {retriveReviewer(signee)?.status === "Pending" && (
                  <Col md="12" className="text-center mb-5">
                    <p>
                      I {retriveReviewer(signee)?.user?.name} hereby agree and
                      sign to follow the purpose stated in {key?.split("/")[1]}.
                    </p>
                    <HandleReview
                      fetchData={props.fetchData}
                      processing={processing}
                      dispatch={dispatch}
                      reviewer={retriveReviewer(signee)}
                    />
                  </Col>
                )}
                {retriveReviewer(authorisers)?.status === "Pending" && (
                  <Col md="12" className="text-center mb-5">
                    <p>
                      I {retriveReviewer(authorisers)?.user?.name} hereby
                      approve {key?.split("/")[1]} to be published.
                    </p>
                    <HandleReview
                      fetchData={props.fetchData}
                      processing={processing}
                      dispatch={dispatch}
                      reviewer={retriveReviewer(authorisers)}
                    />
                  </Col>
                )}
              </Row>
              <DetailsSectionHeader title={`Document details`} />
              <Row>
                <Col md="4">
                  <DetailsSectionContent
                    label={"Reference:"}
                    value={document?.reference}
                  />
                </Col>
                <Col md="4">
                  <DetailsSectionContent
                    label={"Document name:"}
                    value={key?.split("/")[1]}
                  />
                </Col>
                <Col md="4">
                  <DetailsSectionContent
                    label={"Status:"}
                    value={document?.status}
                  />
                </Col>
                <Col md="4">
                  <DetailsSectionContent
                    label={"Uploaded:"}
                    value={`${document?.details?.modified?.by?.name} ${moment(
                      document?.details?.modified?.on
                    ).format("DD/MM/YYYY")}`}
                  />
                </Col>
              </Row>

              <Row>
                {entityAccessControl({
                  users: [
                    document?.repository?.created?.by?._id,
                    document?.repository?.owner?._id,
                    authorisers.map((authoriser) => authoriser._id),
                  ],
                  effect: "Allow",
                }) && (
                  <>
                    <Col md="12" className="mb-4">
                      <h4 className="text-primary">Comments</h4>
                      <TimeLine
                        readOnly={true}
                        horizontalSpacing={false}
                        containerClass="mx-auto sm-10"
                        moduleType="documents"
                        moduleId={document?._id}
                        module={document}
                      />
                    </Col>
                  </>
                )}
              </Row>
            </>
          )}
        </Panel>
        <Panel panelId="Add users for signature">
          {document &&
            !processing[USER_ACTIONS.LOAD_SIGNEE].status &&
            !processing[USER_ACTIONS.LOAD_AUTHORISER].status && (
              <>
                <AddSignee
                  repository={document?.repository}
                  document={document}
                  processing={processing}
                  dispatch={dispatch}
                  signee={signee}
                  authorisers={authorisers}
                />
                {entityAccessControl({
                  users: [
                    document?.repository?.created?.by?._id,
                    document?.repository?.owner?._id,
                    authorisers.map((authoriser) => authoriser._id),
                  ],
                  effect: "Allow",
                }) && (
                  <>
                    <Col md="12" className="mb-4">
                      <h4 className="text-primary">Comments</h4>
                      <TimeLine
                        editLabel="comment"
                        editPlaceholder="Comment"
                        horizontalSpacing={true}
                        containerClass="mx-auto sm-10"
                        moduleType="docversiondetails"
                        moduleId={document?._id}
                        module={document}
                      />
                    </Col>
                  </>
                )}
              </>
            )}
        </Panel>
        <Panel panelId="Signee">
          <ErrorHandlerComponent
            hasError={processing[USER_ACTIONS.LOAD_SIGNEE].error}
            errorMessage="Could not found signee for this repository"
          >
            {processing[USER_ACTIONS.LOAD_SIGNEE].status ? (
              <Loading />
            ) : (
              <Row>
                {signee.map((signee) => (
                  <Reviewer
                    key={signee?._id}
                    repository={document?.repository}
                    reviewer={signee}
                    processing={processing}
                    dispatch={dispatch}
                    setSignee={setSignee}
                  />
                ))}
              </Row>
            )}
          </ErrorHandlerComponent>
        </Panel>
        <Panel panelId="Authorisers">
          <ErrorHandlerComponent
            hasError={processing[USER_ACTIONS.LOAD_AUTHORISER].error}
            errorMessage="Could not found authoriser for this repository"
          >
            {processing[USER_ACTIONS.LOAD_AUTHORISER].status ? (
              <Loading />
            ) : (
              <Row>
                {authorisers.map((authoriser) => (
                  <Reviewer
                    key={authoriser?._id}
                    repository={document?.repository}
                    reviewer={authoriser}
                    processing={processing}
                    dispatch={dispatch}
                    setAuthorisers={setAuthorisers}
                  />
                ))}
              </Row>
            )}
          </ErrorHandlerComponent>
        </Panel>
      </Panels>
    </div>
  );
};

export default Document;
