import { useState } from "react";
function useNodeLists(dispatch, USER_ACTIONS) {
  const [createFolderFormActive, setCrea] = useState();
  return {
    nodeLists,
    setNodeLists,
    lazyLoadNodes,
    handleNodeLists,
    lazyLoadTrashedNodes,
    setTrashedNodeList,
    trashedNodeList,
    addToTrashedNodes,
  };
}

export default useNodeLists;
