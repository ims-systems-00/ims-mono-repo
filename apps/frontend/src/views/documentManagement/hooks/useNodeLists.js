import { useState } from "react";

function useNodeLists(dispatch, USER_ACTIONS) {
  let [nodeLists, setNodeLists] = useState([]);
  let [trashedNodeList, setTrashedNodeList] = useState([]);
  const handleNodeLists = (node) => {
    setNodeLists((prevNodes) => {
      return [node, ...prevNodes];
    });
  };
  const addToTrashedNodes = (node) => {
    setTrashedNodeList((prevNodes) => {
      return [node, ...prevNodes];
    });
  };
  async function lazyLoadNodes(options) {}

  // Really bad implementation have to find a better way..
  async function lazyLoadTrashedNodes(options) {}
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
