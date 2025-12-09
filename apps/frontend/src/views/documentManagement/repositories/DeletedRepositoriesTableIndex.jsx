import Loading from "@/components/Loader/Loading";
import DeletedRepositoriesTable from "./DeletedRepositoriesTable";
import RepositoriesContextProvider from "./store/Context";
import useRepositories from "./store/useStore";

const DeletedRepositoriesTableIndex = (props) => {
  let {
    deletedRepos,
    fetchDeletedRepositories,
    deletedToolState,
    deletedQueryHandlers,
    isFetchingDeletedRepositories,
  } = useRepositories();
  return (
    <RepositoriesContextProvider>
        {isFetchingDeletedRepositories() && <Loading />}
        <DeletedRepositoriesTable
          dataTable={deletedRepos}
          pathname={props.match.url}
          onPageChange={fetchDeletedRepositories}
          pagination={deletedToolState.pagination}
          {...deletedQueryHandlers}
        />
    </RepositoriesContextProvider>
  );
};

export default DeletedRepositoriesTableIndex;
