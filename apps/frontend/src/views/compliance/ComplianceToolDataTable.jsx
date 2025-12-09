import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { getColoredPercentage } from "@/utils/getColoredPercentage";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import Loading from "@/components/Loader/Loading";
import { Pagination } from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import { RowActions } from "./row-actions";
import { useState } from "react";
import { ComplianceDrawer } from "./ComplainceDrawer";
import ComplianceToolBar from "./ComplianceToolBar";
import { FileFinder } from "./evidence/fileEvidence/FileFinder";
import { RiskFinder } from "./evidence/riskEvidence/RiskFinder";
import { IncidentFinder } from "./evidence/incidentEvidence/IncidentFinder";
import { CipFinder } from "./evidence/cipEvidence/CipFinder";
import { DocumentFinder } from "./evidence/documentEvidence/DocumentFinder";

const defaultdata = [];

function ComplianceToolDataTable({
  toolkit,
  dataTable,
  processing,
  updateDataTable,
  queryHandlers,
  filterToolbar,
}) {
  const [selectedRowData, setSelectedRowData] = useState([]);
  let { openDrawer } = useDrawer();
  dataTable = dataTable ? dataTable : defaultdata;

  const columnsForCompliance = [
    {
      accessorKey: "control.clause",
      header: () => <p>Clause</p>,
      size: 100,
    },
    {
      accessorKey: "control.title",
      header: () => <p>Title</p>,
      size: 400,
    },
    {
      accessorKey: "selected",
      header: () => <p>Selected</p>,
      cell: ({ row }) =>
        row.original.selected === "Selected" ? (
          <span className="text-success">{row.original.selected}</span>
        ) : (
          <span className="text-danger">{row.original.selected}</span>
        ),
      size: 140,
    },
    {
      accessorKey: "requirementMet",
      header: () => <p>Status</p>,
      cell: ({ row }) => <BadgeStatus status={row.original.state} />,
      size: 180,
    },
    {
      accessorKey: "compliance",
      header: () => <p>Compliance</p>,
      cell: ({ row }) => (
        <span
          className={getColoredPercentage(row.original.compliancePercentage)}
        >
          {row.original.compliancePercentage}
        </span>
      ),
      size: 140,
    },
    {
      accessorKey: "updatedOn",
      header: () => <p>Last updated</p>,
      cell: ({ row }) =>
        row.original.updated && row.original.updated.on ? (
          <TimeDateComponent date={row.original.updated?.on} />
        ) : (
          ""
        ),
      size: 250,
    },
    {
      accessorKey: "updatedBy",
      header: () => <p>Updated by</p>,
      cell: ({ row }) =>
        row.original.updated &&
        row.original.updated.by &&
        row.original.updated.by.name,
      size: 200,
    },
    {
      id: "actions",
      header: () => <p>Actions</p>,
      cell: ({ row }) => (
        <RowActions row={row} updateDataTable={updateDataTable} />
      ),
      size: 100,
    },
  ];

  const Filter = filterToolbar;

  return (
    <>
      <h4 className="mb-3">{toolkit}</h4>
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="row g-2 align-items-center">
            <div className="col-md-8">
              <SearchInput queryHandlers={queryHandlers} />
            </div>
            <div className="col-md-4">{Filter}</div>
          </div>
        </div>
      </div>
      {processing.action === "load-compliance" && (
        <span className="text-success text-center font-size-subtitle-1">
          Loading {toolkit}
        </span>
      )}
      {processing.status ? (
        <Loading height={600} />
      ) : (
        <>
          <div>
            <DataTable
              data={dataTable}
              columns={columnsForCompliance || []}
              disableMultiSelection={true}
              disableColumnResize={false}
              defaultSize={375}
              minSize={80}
              onRowClick={({ original }) => {
                setSelectedRowData(original);
                openDrawer("complaince-detail");
              }}
              columnVisibility={{}}
              enableExpanding={true}
            />
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

      <DrawerRight drawerId="complaince-detail" toolbar={<ComplianceToolBar />}>
        <ComplianceDrawer
          compliance={selectedRowData}
          updateDataTable={updateDataTable}
        />
      </DrawerRight>
      <DrawerRight
        drawerId="file-link-evidence"
        toolbar={<ComplianceToolBar />}
      >
        <FileFinder
          compliance={selectedRowData}
          updateDataTable={updateDataTable}
        />
      </DrawerRight>
      <DrawerRight drawerId="risk-link-evidence">
        <RiskFinder clause={selectedRowData} />
      </DrawerRight>

      <DrawerRight drawerId="incident-link-evidence">
        <IncidentFinder clause={selectedRowData} />
      </DrawerRight>

      <DrawerRight drawerId="cip-link-evidence">
        <CipFinder clause={selectedRowData} />
      </DrawerRight>

      <DrawerRight drawerId="document-link-evidence">
        <DocumentFinder clause={selectedRowData} />
      </DrawerRight>
    </>
  );
}

export default ComplianceToolDataTable;
