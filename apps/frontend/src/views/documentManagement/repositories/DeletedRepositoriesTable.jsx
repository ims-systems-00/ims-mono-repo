import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Loading from "@/components/Loader/Loading";
import { Pagination } from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import useAlert from "@/hooks/useAlerts";
import { Badge, DataTable } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import USER_ACTIONS from "../repositories/store/actions";
import DeletedRepositoriesRowActions from "./DeletedRepositoriesRowActions";
import useRepositories from "./store/useStore";
import { getReviewInterval } from "@/utils/getReviewInterval";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
const defaultdata = [["No data found"]];

const DeletedRepositoriesTable = () => {
  let {
    deletedRepositories: dataTable,
    processing,
    handleRestore,
    handleHardDelete,
    deletedToolState,
    deletedQueryHandlers,
  } = useRepositories();
  let { alert } = useAlert();
  let history = useHistory();

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
          <DeletedRepositoriesRowActions
            row={row}
            onRestore={(repository) => handleRestore(repository._id)}
            onHardDelete={(repository) => handleHardDelete(repository._id)}
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
        <h4 className="mb-3">Recycle bin</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={deletedQueryHandlers} />
              </div>
            </div>
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_REPOSITORIES]?.status ? (
          <Loading height={600} />
        ) : (
          <>
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
              totalResults={deletedToolState?.pagination?.totalResults}
              currentPage={deletedToolState?.pagination?.currentPage || 1}
              onPageChange={(page) => {
                deletedQueryHandlers?.handlePagination({ page });
              }}
              size={deletedToolState?.pagination?.size || 10}
            />
          </>
        )}
      </Box>
    </ContentWrapper>
  );
};

export default DeletedRepositoriesTable;
