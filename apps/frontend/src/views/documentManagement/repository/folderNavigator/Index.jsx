import React, { useEffect, useState } from "react";
import RepositoryContextProvider from "../store/Context";
import Folders from "./Folders";
import Footeractions from "./Footeractions";
import Path from "./Path";

const FolderNavigator = ({ node, onMoveSubmit }) => {
  let [loaded, setloaded] = useState(false);
  useEffect(() => {
    /**
     * we are implementing this work arroound to bypass  bootstrap async modal render issue.
     */
    setTimeout(() => {
      setloaded(true);
    }, 1000);
  }, []);
  if (!loaded) return <p className="text-center">Preparing...</p>;
  return (
    <React.Fragment>
      <RepositoryContextProvider
        repoId={node?.repository?._id || node?.repository}
      >
        <span className="text-secondary font-size-subtitle-2">
          Selected {node.type}{" "}
          <span className="tex-bold text-info">{node.name}</span>
        </span>
        <Path />
        <Folders selectionNode={node} />
        <Footeractions selectionNode={node} onMoveSubmit={onMoveSubmit} />
      </RepositoryContextProvider>
    </React.Fragment>
  );
};

export default FolderNavigator;
