import { Pagination } from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import useAccess from "@/hooks/useAccess";
import useModal from "@/hooks/useModal";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { Button, DataTable, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import GroupProfile from "./GroupProfile";
import LOADERS from "./LoadingActions";
import RowActions from "./RowActions";
import Loading from "@/components/Loader/Loading";
import { TourStep } from "@/components/Tour";

const defaultdata = [
  {
    _id: "no-data",
    name: "",
    responsibility: "",
    type: "",
  },
];

const GroupTable = ({
  dataTable,
  setGroups,
  processing,
  dispatch,
  queryHandlers,
}) => {
  dataTable = dataTable ? dataTable : defaultdata;
  let { authUser } = useAccess();

  let updateDataTable = (updatedGroup) => {
    dispatch({
      [LOADERS.DELETE_GROUP]: {
        status: true,
        error: false,
        id: updatedGroup._id,
      },
    });
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group._id === updatedGroup._id ? updatedGroup : group
      )
    );
    dispatch({
      [LOADERS.DELETE_GROUP]: { status: false, error: false, id: null },
    });
  };
  let { activateView, Modal, isOpen } = useModal({ onUpdate: updateDataTable });

  const columns = React.useMemo(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        size: 400,
      },
      {
        accessorKey: "type",
        header: "Type",
        size: 400,
      },
      {
        accessorKey: "responsibility",
        header: "Responsibility",
        size: 350,
      },
      {
        accessorKey: "totalMembers",
        header: "Number of members",
        size: 350,
      },
      {
        id: "actions",
        header: () => <div className="dt-row-actions">Actions</div>,
        cell: ({ row }) => (
          <RowActions row={row} onDetails={(group) => activateView(group)} />
        ),
        size: 100,
      },
    ];
  }, [processing]);
  return (
    <>
      <h4 className="mb-3">Business units</h4>
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
            service: IMS_SERVICES.IAM_GROUPS,
            action: ACTIONS.CREATE,
            effect: EFFECTS.ALLOW,
          }) && (
            <TourStep key="create-group" stepId="create-business-unit-button">
              <DrawerOpener drawerId="create-group-drawer">
                <Button color="primary">
                  <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0" />
                  Create a function
                </Button>
              </DrawerOpener>
            </TourStep>
          )}
        </div>
      </div>
      {processing[LOADERS.LOAD_GROUPS]?.status ? (
        <Loading height={600} />
      ) : (
        <>
          <div>
            <TourStep key="groups-table" stepId="groups-table">
              <DataTable
                data={Array.isArray(dataTable) ? dataTable : []}
                columns={columns}
                disableMultiSelection={true}
                disableColumnResize={false}
                onRowClick={(row) => {
                  const group = row?.original;
                  if (group) {
                    activateView(group);
                  }
                }}
                defaultSize={375}
                minSize={80}
                columnVisibility={{}}
              />
            </TourStep>
          </div>

          <Pagination
            containerClassName="pull-right my-2"
            totalResults={queryHandlers?.toolState?.pagination?.totalResults}
            currentPage={queryHandlers?.toolState?.pagination?.currentPage || 1}
            onPageChange={(page) => {
              queryHandlers?.handlePagination({ page });
            }}
            size={queryHandlers?.toolState?.pagination?.size || 10}
          />
        </>
      )}
      <Modal title="Business unit">
        <GroupProfile isModalOpen={isOpen} />
      </Modal>
    </>
  );
};

export default GroupTable;
