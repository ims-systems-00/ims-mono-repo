import { TaskContextProvider } from "@/views/taskManagement/store";
import RepositoryContent from "./RepositoryContent";
import RepositoryContextProvider from "./store/Context";
const Repository = (props) => {
  return (
    <div className="content">
      <RepositoryContextProvider
        repoId={
          (props.match && props.match.params.id) ||
          (props.view && props.view._id)
        }
      >
        <TaskContextProvider>
          <RepositoryContent />
        </TaskContextProvider>
      </RepositoryContextProvider>
    </div>
  );
};

export default Repository;
