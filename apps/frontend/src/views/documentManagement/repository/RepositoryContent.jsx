import { Card, CardBody, CardHeader } from "@ims-systems-00/ims-ui-kit";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import RepositoryBody from "./RepositoryBody";
import RepositoryHeader from "./RepositoryHeader";
import USER_ACTIONS from "./store/actions";
import useRepository from "./store/useRepository";
import Loading from "@/components/Loader/Loading";
import Box from "@/components/Box/Index";
import React from "react";

const RepositoryContent = () => {
  let { repository, processing } = useRepository();
  return (
    <ErrorHandlerComponent
      hasError={processing[USER_ACTIONS.LOAD_REPOSITORY].error}
      errorMessage="This repository has been deleted or removed"
    >
      {processing[USER_ACTIONS.LOAD_REPOSITORY].status ? (
        <div className="repository-container p-5">
          <Loading />
        </div>
      ) : (
        repository && (
          <React.Fragment>
            <RepositoryHeader />

            <RepositoryBody />
          </React.Fragment>
        )
      )}
    </ErrorHandlerComponent>
  );
};

export default RepositoryContent;
