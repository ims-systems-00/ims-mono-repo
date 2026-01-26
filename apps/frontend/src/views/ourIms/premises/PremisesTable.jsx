import useModal from "@/hooks/useModal";
import { DataTable, DrawerOpener, Button } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import PremisesDetail from "./PremisesDetail";
import { TourStep } from "@/components/Tour";
import { RowActions } from "./row-actions";
import SearchInput from "@/components/SearchInput/search-input";
import { Pagination } from "@/components/Pagination/pagination";
import Loading from "@/components/Loader/Loading";

const defaultdata = [["No data found"]];
const PremisesTable = ({
  dataTable,
  processing,
  updateDataTable,
  handleDelete,
  queryHandlers,
}) => {
  let { activateView, Modal, isOpen } = useModal({ onUpdate: updateDataTable });
  dataTable = dataTable ? dataTable : defaultdata;

  const columnsForPrimises = [
    {
      accessorKey: "name",
      header: () => <p>Premise Name</p>,
      size: 400,
    },
    {
      accessorKey: "location",
      header: () => <p>Premise Location</p>,
      size: 350,
    },

    {
      accessorKey: "address",
      header: () => <p>Premise Address</p>,
      size: 320,
    },
    {
      id: "actions",
      header: () => <p className="dt-row-actions">Action</p>,
      cell: ({ row }) => (
        <RowActions
          row={row}
          onDetails={(group) => activateView(group)}
          handleDelete={handleDelete}
        />
      ),
      size: 150,
    },
  ];

  return (
    <>
      {alert}
      <h4 className="mb-3">Primises</h4>
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="row g-2 align-items-center">
            <div className="col-md-8">
              <SearchInput queryHandlers={queryHandlers} />
            </div>
          </div>
        </div>

        <div className="col-md-6 text-end">
          <DrawerOpener drawerId="create-premise-drawer">
            <TourStep stepId="business-premises-button">
              <Button
                color="primary"
                size="md"
                className="shadow-sm--hover ms-3"
              >
                <i className="ims-icons-20 icon-icon-notepencil-24 me-1 p-0" />
                Create premise
              </Button>
            </TourStep>
          </DrawerOpener>
        </div>
      </div>

      {processing.action === "load-premises" ? (
        <Loading height={600} />
      ) : (
        <>
          <div>
            <TourStep stepId="business-premises-table">
              <DataTable
                data={dataTable}
                columns={columnsForPrimises || []}
                disableMultiSelection={true}
                disableColumnResize={false}
                defaultSize={375}
                minSize={80}
                onRowClick={({ original }) => {
                  activateView(original);
                }}
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

      <Modal title="Premise">
        <PremisesDetail isModalOpen={isOpen} />
      </Modal>
    </>
  );
};

export default PremisesTable;
