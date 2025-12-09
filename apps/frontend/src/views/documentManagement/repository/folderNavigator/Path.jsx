import BreadCrumb from "@/components/Breadcrumb/BreadCrumb";
import useRepository from "../store/useRepository";
import USER_ACTIONS from "../store/actions";
import Loading from "@/components/Loader/Loading";
import React from "react";
const Path = () => {
  let { processing, repository, visitingNodePath, visitNode } = useRepository();
  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_CHILD_NODES].status ? (
        <React.Fragment>
          <Loading text="Loading path" />
        </React.Fragment>
      ) : (
        <BreadCrumb
          onSelect={(nodeId) => {
            visitNode(nodeId);
          }}
          crumbs={[
            { name: repository?.reference, nodeId: null },
            ...visitingNodePath,
          ]}
          listTag={"div"}
        />
      )}
    </React.Fragment>
  );
};

export default Path;
