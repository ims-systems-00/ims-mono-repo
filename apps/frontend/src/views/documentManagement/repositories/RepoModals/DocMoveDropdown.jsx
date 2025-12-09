import Loading from "@/components/Loader/Loading";
import NotificationContext from "@/contexts/notificationContext";
import useProcessingControl from "@/hooks/useProcessingControl";
import useQuery from "@/hooks/useQuery";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { getNodePath, moveNode } from "@/services/documentManagement/index";
import USER_ACTIONS from "@/views/documentManagement/actions";
import useNodeLists from "@/views/documentManagement/hooks/useNodeLists";
import UploadFolderModal from "../../repository/FolderForm";
import useRepository from "../store/repository/useRepository";

const DocMove = ({ ...props }) => {
  let notify = React.useContext(NotificationContext);
  const { event, handleMoveDropdown, moveDropdownRef, uploadFolderRef } =
    props || {};
  let { repository, visitingNodeChildren, visitingNode } = useRepository();
  const repoId = props.match && props.match.params.id;
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_NODES, id: null, hasMore: true },
    { action: USER_ACTIONS.LOAD_NODE },
    { action: USER_ACTIONS.GET_NODE_PATH },
    { action: USER_ACTIONS.ADD_FOLDER },
    { action: USER_ACTIONS.MOVE_NODE },
  ]);

  let { query, toolState, getQuery, handleFilter } = useQuery({
    required: {
      value: {
        sort: "-type name",
      },
    },
    filter: {
      value: {
        parentNode: visitingNode?.parentNode || null,
        status: "Published",
      },
    },
  });

  let { nodeLists: enteredNodeList, lazyLoadNodes } = useNodeLists(
    dispatch,
    USER_ACTIONS
  );

  let [movableFolders, setMovableFolders] = React.useState(
    visitingNodeChildren?.filter((node) => {
      return node?.type === "folder" && node?._id !== visitingNode?._id;
    })
  );

  const [enteredNodePaths, setEnteredNodePaths] = React.useState([]);
  const [selectedToMove, setSelectedToMove] = React.useState("");
  const [isRepoModalOpen, setIsRepoModalOpen] = React.useState("");
  const toggleRepoModal = (value) => {
    setIsRepoModalOpen(value);
  };

  const getEnteredNodeList = async (qstr) => {
    try {
      await lazyLoadNodes({
        repoId,
        query: qstr,
      });
      dispatch({});
    } catch (err) {
      console.error(err);
    }
  };
  const getEnteredNodePaths = async (nodeId) => {
    try {
      let response = await getNodePath(repoId, nodeId);
      setEnteredNodePaths(response?.data?.path);
    } catch (err) {
      console.error(err);
    }
  };

  const moveToNodeList = async () => {
    try {
      dispatch({
        [USER_ACTIONS.MOVE_NODE]: {
          status: true,
          error: false,
        },
      });
      const { data } = await moveNode(repoId, visitingNode._id, selectedToMove);
      handleMoveDropdown(false);
      dispatch({
        [USER_ACTIONS.MOVE_NODE]: {
          status: false,
          error: false,
        },
      });
      notify(
        `${
          data.node.type === "folder" ? "Folder" : "Document"
        } moved successfully`,
        "success"
      );
    } catch (err) {
      console.error(err);
      dispatch({
        [USER_ACTIONS.MOVE_NODE]: {
          status: false,
          error: true,
        },
      });
    }
  };

  React.useEffect(() => {
    getEnteredNodeList(getQuery());
    getEnteredNodePaths(toolState?.filter?.value?.parentNode || null);
  }, [query]);

  React.useEffect(() => {
    setMovableFolders(
      enteredNodeList.filter((node) => {
        return node?.type === "folder" && node?._id !== visitingNode?._id;
      })
    );
  }, [enteredNodeList]);
  return (
    <>
      <div
        ref={moveDropdownRef}
        style={{
          top:
            event.pageY > window.innerHeight ? event.pageY - 200 : event.pageY,
          left:
            window.innerWidth < 768
              ? "50%"
              : event.pageX > window.innerWidth - 300
              ? event.pageX - 300
              : event.pageX,
          transform:
            window.innerWidth < 768
              ? "translate(-50%, -50%)"
              : "translate(0,0)",
        }}
        className="doc-move-container"
      >
        <div className="doc-move-header  d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-between align-items-center">
            <i
              onClick={() => {
                setSelectedToMove("");
                if (enteredNodePaths.length > 1) {
                  handleFilter({
                    value: {
                      parentNode:
                        enteredNodePaths[enteredNodePaths?.length - 2].nodeId,
                      status: "Published",
                    },
                  });
                } else {
                  handleFilter({
                    value: {
                      parentNode: null,
                      status: "Published",
                    },
                  });
                  setSelectedToMove(null);
                }
              }}
              className={`ims-icons-20  icon-back-regular me-2 move-icons back-icon ${
                enteredNodePaths.length === 0 ? "invisible" : ""
              }`}
            ></i>
            <span className="doc-move-title mb-0 font-size-subtitle-2">
              {repository?.reference}
            </span>
          </div>
          <div
            onClick={() => {
              setSelectedToMove("");
              handleMoveDropdown(false);
            }}
            className="doc-move-close"
          >
            {/* movableFolders.length === 0 ? () : */}
            <i className="ims-icons-20 icon-cancel-regular move-icons cross-icon"></i>
          </div>
        </div>
        {processing[USER_ACTIONS.LOAD_NODES].status ? (
          <div className="py-5">
            <Loading />
          </div>
        ) : (
          <div className="doc-move-body">
            {movableFolders.length === 0 ? (
              <div>
                <span className="text-center py-5 font-size-subtitle-2">
                  No folders found
                </span>
              </div>
            ) : (
              movableFolders.map((folder) => {
                return (
                  <div
                    onClick={(e) => {
                      processing[USER_ACTIONS.MOVE_NODE].status === false &&
                        e.target.id !== "enter-folder-icon" &&
                        e.target.id !== "enter-folder" &&
                        setSelectedToMove(folder?._id);
                    }}
                    className={`d-flex justify-content-between align-items-center px-3 py-1 movable-folders
                ${selectedToMove === folder?._id ? "active-move" : ""}
                `}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <i className="ims-icons-20 icon-folder-fill me-2 move-icons folder-icon"></i>
                      <span className="doc-move-title mb-0 font-size-subtitle-2">
                        {folder?.name}
                      </span>
                    </div>
                    <div id="enter-folder">
                      <i
                        id="enter-folder-icon"
                        onClick={() => {
                          setSelectedToMove("");
                          handleFilter({
                            value: {
                              parentNode: folder?._id,
                              status: "Published",
                            },
                          });
                        }}
                        className="ims-icons-20 icon-share-regular move-icons enter-folder-icon"
                      ></i>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        <div className="doc-move-footer d-flex justify-content-between align-items-center">
          <i
            onClick={(e) => {
              toggleRepoModal("Create Folder");
            }}
            className="ims-icons-20 icon-new-folder-fill move-icons add-folder-icon"
          ></i>
          <span className="move-button">
            <Button
              disabled={processing[USER_ACTIONS.MOVE_NODE].status}
              onClick={() => {
                moveToNodeList();
              }}
              className={`${
                selectedToMove === null || selectedToMove
                  ? "active-move-btn"
                  : ""
              }`}
            >
              Move Here
            </Button>
          </span>
        </div>
        <div>
          <UploadFolderModal
            repository={repository}
            addToNodeList={() => {}}
            isRepoModalOpen={isRepoModalOpen}
            toggleRepoModal={toggleRepoModal}
            uploadFolderRef={uploadFolderRef}
            toolState={toolState}
          />
        </div>
      </div>
    </>
  );
};

export default DocMove;
