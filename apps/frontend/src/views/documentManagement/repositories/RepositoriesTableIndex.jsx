import NavigationTabs from "@/components/NavigationTabs";
import useAccess from "@/hooks/useAccess";
import { TaskContextProvider } from "@/views/taskManagement/store";
import RepositoryOverviewIndex from "./Analytics/RepositoryOverviewIndex";
import DeletedRepositoriesTable from "./DeletedRepositoriesTable";
import RepositoriesTable from "./RepositoriesTable";
import { RepositoriesContextProvider } from "./store";

const RepositoriesTableIndex = (props) => {
  let { authUser } = useAccess();
  return (
    <RepositoriesContextProvider {...props}>
      <TaskContextProvider>
        <NavigationTabs
          activeTab="repositories"
          navigations={[
            {
              id: "overview",
              text: "Overview",
              icon: <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>,
              component: <RepositoryOverviewIndex {...props} />,
            },
            {
              id: "repositories-table-tab",
              text: "Repositories",
              icon: (
                <i className="ims-icons-20 icon-icon-foldersimple-24 me-1"></i>
              ),
              component: <RepositoriesTable {...props} />,
            },
            {
              id: "recycleBin",
              text: "Recycle Bin",
              icon: (
                <i className="ims-icons-20 icon-icon-trashsimple-24 me-1"></i>
              ),
              component: <DeletedRepositoriesTable {...props} />,
            },
          ]}
        />
      </TaskContextProvider>
    </RepositoriesContextProvider>
  );
};

export default RepositoriesTableIndex;
