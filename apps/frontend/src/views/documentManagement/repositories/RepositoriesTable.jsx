import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Loading from "@/components/Loader/Loading";
import SearchInput from "@/components/SearchInput/search-input";
import { TourStep } from "@/components/Tour";
import { Pagination } from "@/components/Pagination/pagination";
import useAccess from "@/hooks/useAccess";
import useAlert from "@/hooks/useAlerts";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getReviewInterval } from "@/utils/getReviewInterval";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import { Badge, DataTable, DrawerRight } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import RepositoryForm from "../repository/RepositoryForm";
import CreateRepository from "./CreateRepository";
import RepositoriesRowActions from "./RepositoriesRowActions";
import { useRepositories } from "./store";
const defaultdata = [["No data found"]];

const RepositoriesTable = ({ props }) => {
  let { authUser } = useAccess();
  let {
    repositories: dataTable,
    toolState,
    queryHandlers,
    createRepository,
    handleDelete,
    processing,
    isFetchingTable,
    ...rest
  } = useRepositories();
  const history = useHistory();
  let { alert } = useAlert();

  dataTable = dataTable ? dataTable : defaultdata;

  const columns = React.useMemo(() => {
    return [
      {
        accessorKey: "reference",
        header: "Reference",
      },
      {
        accessorKey: "group",
        header: "Business unit",
        cell: ({ row }) => row.original?.group?.name || "N/A",
      },
      {
        accessorKey: "name",
        header: "Repository name",
        cell: ({ row }) => row.original?.name || "Untitled repository",
      },
      {
        id: "owners",
        header: "Owner(s)",
        cell: ({ row }) => (
          <div>
            {row.original?.owners?.map((owner) => (
              // <BadgeStatus status={owner.name} />
              <Badge color="primary"> {owner.name} </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "reviewInterval",
        header: "Review interval",
      },
      {
        id: "nextReview",
        header: "Next review date",
        cell: ({ row }) => {
          return getReviewInterval(
            row.original?.createdAt,
            row.original?.reviewInterval
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
          return <TimeDateComponent date={row?.original?.createdAt} />;
        },
      },
      {
        id: "actions",
        accessorKey: "",
        size: 50,
        header: () => <div className="dt-row-actions">Actions</div>,
        cell: ({ row }) => (
          <RepositoriesRowActions
            row={row}
            onDelete={(repository) => handleDelete(repository._id)}
            processing={processing}
          />
        ),
      },
    ];
  }, [processing]);

  return (
    <ContentWrapper>
      <Box>
        {alert}
        <h4 className="mb-3">Repositories</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={queryHandlers} />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            {authUser({
              service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
              action: ACTIONS.WRITE,
              effect: EFFECTS.ALLOW,
            }) && <CreateRepository />}
          </div>
        </div>

        {isFetchingTable() ? (
          <Loading height={600} />
        ) : (
          <TourStep stepId="repository-table">
            <div>
              <DataTable
                data={Array.isArray(dataTable) ? dataTable : []}
                columns={columns}
                disableMultiSelection={true}
                disableColumnResize={false}
                onRowClick={(row) => {
                  const repository = row?.original;
                  if (repository) {
                    history.push(
                      `/admin/document-repositories/${repository._id}`
                    );
                  }
                }}
                defaultSize={375}
                minSize={80}
                columnVisibility={{}}
              />
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={toolState?.pagination?.totalResults}
              currentPage={toolState?.pagination?.currentPage || 1}
              onPageChange={(page) => {
                queryHandlers?.handlePagination({ page });
              }}
              size={toolState?.pagination?.size || 10}
            />
          </TourStep>
        )}

        <DrawerRight drawerId="create-repository">
          <RepositoryForm
            drawerView={true}
            onSubmit={async (data) => {
              await createRepository(data);
            }}
          />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default RepositoriesTable;
