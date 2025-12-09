import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import { Card } from "@ims-systems-00/ims-ui-kit";
import useAccess from "@/hooks/useAccess";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import USER_ACTIONS from "../actions";
import RepositoriesContextProvider from "../context/RepositoriesContext";
import RepositoryForm from "../repository/RepositoryForm";
import RepositoryOverview from "./Analytics/RepositoryOverview";
import DeletedRepositoriesTable from "./DeletedRepositoriesTable";
import useRepositories from "./store/useRepositories";
import RepositoriesTable from "./RepositoriesTable";
import React from "react";

const Repositories = (props) => {
  let {
    alert,
    overview,
    myRepos,
    deletedRepos,
    toolState,
    queryHandlers,
    filters,
    fetchRepositories,
    createRepository,
    fetchDeletedRepositories,
    deletedToolState,
    deletedQueryHandlers,
    isLoadingOverview,
    isFetchingTable,
    isFetchingDeletedRepositories,
  } = useRepositories();

  let { authUser } = useAccess();

  return (
    <React.Fragment>
      {alert}
      <div className="content">
        <RepositoriesContextProvider>
          <Panels
            defaultPanel={"Repositories"}
            navLinks={
              authUser(
                {
                  service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
                  action: ACTIONS.CREATE,
                  effect: EFFECTS.ALLOW,
                },
                true
              )
                ? ["Overview", "New repository", "Repositories", "Recycle bin"]
                : authUser({
                    service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
                    action: ACTIONS.CREATE,
                    effect: EFFECTS.ALLOW,
                  })
                ? ["Overview", "New repository", "Repositories", "Recycle bin"]
                : ["Overview", "Repositories"]
            }
          >
            <Panel panelId="Overview">
              <Card>
                {isLoadingOverview() ? (
                  <Loading />
                ) : (
                  <RepositoryOverview overview={overview} />
                )}
              </Card>
            </Panel>
            <Panel panelId="New repository">
              <Card>
                <RepositoryForm onSubmit={createRepository} />
              </Card>
            </Panel>
            <Panel panelId="Repositories">
              <Card>
                {isFetchingTable() && <Loading />}
                <RepositoriesTable
                  dataTable={myRepos}
                  pathname={props.match.url}
                  onPageChange={fetchRepositories}
                  pagination={toolState.pagination}
                  filters={filters}
                  {...queryHandlers}
                />
              </Card>
            </Panel>
            <Panel panelId="Recycle bin">
              <Card>
                {isFetchingDeletedRepositories() && <Loading />}
                <DeletedRepositoriesTable
                  dataTable={deletedRepos}
                  pathname={props.match.url}
                  onPageChange={fetchDeletedRepositories}
                  pagination={deletedToolState.pagination}
                  {...deletedQueryHandlers}
                />
              </Card>
            </Panel>
          </Panels>
        </RepositoriesContextProvider>
      </div>
    </React.Fragment>
  );
};

export default Repositories;
