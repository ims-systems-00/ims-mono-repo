import React from "react";
import RepositoriesContextProvider from "../repositories/store/Context";
import useRepositories from "../repositories/store/useStore";
import RepositoryForm from "./RepositoryForm";

const RepositoryFormIndex = () => {
  let { createRepository } = useRepositories();
  return (
    <RepositoriesContextProvider>
      <div className="content">
        <RepositoryForm onSubmit={createRepository} />
      </div>
    </RepositoriesContextProvider>
  );
};

export default RepositoryFormIndex;
