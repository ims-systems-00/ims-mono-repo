import RepoButton from "@/components/Button/Index";
import Loading from "@/components/Loader/Loading";
import FilePreviewer from "@/components/Previewer/FilePreviewer";
import RepoTabs from "@/components/Tabs/Index";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { getNode } from "@/services/documentManagement/index";
import { imsLogger } from "@/services/loggerService";
import USER_ACTIONS from "@/views/documentManagement/actions";
import TimeLine from "@/views/shared/Timeline/Timeline";
import DocumentPanel from "../RepositoryFragments/DocumentPanel";
import DocAuthorize from "./DocAuthorize";

const DocAuthorizationPanel = () => {
  const { id: repoId, nodeId } = useParams();
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_NODE },
    { action: USER_ACTIONS.GET_NODE_PATH },
    { action: USER_ACTIONS.LOAD_DOCUMENT },
  ]);
  const history = useHistory();
  let {
    query,
    toolState,
    getQuery,
    updatePagination,
    handlePagination,
    ...queryHandlers
  } = useQuery({
    required: {
      value: {
        sort: "-type name",
      },
    },
    filter: {
      value: {
        parentNode: nodeId,
        status: "Pending",
      },
    },
  });

  const [node, setNode] = React.useState([]);
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
  return (
    <div className="content">
      <div className="repository-container p-5">
        <i
          onClick={() => {
            history.push(`/admin/document-repositories/${repoId}`);
          }}
          className="ims-icons-20 icon-back-regular back-button"
        ></i>
        <Row>
          <Col xl="8">
            {processing[USER_ACTIONS.LOAD_NODE].status ? (
              <Loading />
            ) : (
              <>
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
                  fileDetails={{
                    ...node?.documentData?.storageInfo,
                    _id: node?.documentData?._id,
                  }}
                  modalView={false}
                  showToolbar={true}
                  scale={scale}
                  onDownload={() => {
                    // handleDownload(key, docData?.VersionId);
                  }}
                  onPreviewClose={() => {}}
                  //   {...props}
                />
              </>
            )}
          </Col>
          <Col xl="4">
            {processing[USER_ACTIONS.LOAD_NODE].status ? (
              <Loading />
            ) : (
              <>
                <div className="repo-sidebar">
                  <div className="repo-number">
                    <i className="ims-icons-20  icon-folder-fill me-2"></i>
                    <span>{node?.repository?.reference}</span>
                  </div>
                  <div className="mt-3">
                    <div className="sidebar-about-panel">
                      <RepoTabs
                        primaryBtn={"About"}
                        secondaryBtn={"Activity"}
                        primaryTab={
                          <>
                            <DocumentPanel docDescription={node} />
                          </>
                        }
                        secondaryTab={
                          <TimeLine
                            shouldRenderBelow={true}
                            editLabel="Comment"
                            editPlaceholder="New comment"
                            horizontalSpacing={true}
                            containerClass="mx-auto sm-10"
                            moduleType="documenttrees"
                            moduleId={node._id}
                            module={document}
                          />
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <DocAuthorize node={node} repoId={repoId} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DocAuthorizationPanel;
